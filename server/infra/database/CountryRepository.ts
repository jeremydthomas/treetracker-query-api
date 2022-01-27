import Country from 'interfaces/Country';
import HttpError from 'utils/HttpError';
import BaseRepository from './BaseRepository';
import Session from './Session';

export default class CountryRepository extends BaseRepository<Country> {
  constructor(session: Session) {
    super('region', session);
  }

  async getById(id: string | number) {
    const object = await this.session
      .getDB()
      .select(
        this.session.getDB().raw(`
        id,
        name,
        St_asgeojson(centroid) as centroid
      `),
      )
      .table(this.tableName)
      .where('id', id)
      .first();
    if (!object) {
      throw new HttpError(404, `Can not found ${this.tableName} by id:${id}`);
    }
    return object;
  }

  async getByFilter(
    filter: any,
    // options?: { limit?: number | undefined } | undefined,
  ): Promise<any[]> {
    const { lat, lon } = filter;
    const sql = `
      SELECT
        id,
        name,
        St_asgeojson(centroid) as centroid
      FROM
        region
      WHERE 
        ST_Contains(geom, ST_GeomFromText('POINT(${lon} ${lat})', 4326)) = true
        AND 
        type_id = 6
    `;
    const object = await this.session.getDB().raw(sql);
    if (!object && object.rows.length !== 1) {
      throw new HttpError(
        404,
        `Can not found ${this.tableName} by lat:${lat} lon:${lon}`,
      );
    }
    return object.rows[0];
  }

  // eslint-disable-next-line class-methods-use-this
  getLeaderBoard(/* top = 10 */) {
    // const sql = `
    //   select r.*, region.name, ST_AsGeoJSON(centroid) as centroid  from (
    //   select count(region.id) as planted, region.id
    //   from trees
    //   LEFT JOIN region
    //   on ST_WITHIN(trees.estimated_geometric_location, region.geom)
    //   left join region_type
    //   on region.type_id = region_type.id
    //   where
    //   region_type.type = 'country'
    //   group by region.id
    //   order by count(region.id) desc
    //   limit ${top}
    //   ) r left join region
    //   on r.id = region.id
    //   ;
    // `;
    // const object = await this.session
    //   .getDB()
    //   .raw(sql);
    // return object.rows;

    // The sql is too slow, need to optimize TODO
    return [
      {
        planted: '182499',
        id: 6632405,
        name: 'Sierra Leone',
        centroid:
          '{"type":"Point","coordinates":[-11.7927124667898,8.56329593037589]}',
      },
      {
        planted: '38178',
        id: 6632386,
        name: 'Tanzania',
        centroid:
          '{"type":"Point","coordinates":[34.8130998093246,-6.27565408331664]}',
      },
      {
        planted: '22384',
        id: 6632488,
        name: 'India',
        centroid:
          '{"type":"Point","coordinates":[79.6119760945121,22.8857819800289]}',
      },
      {
        planted: '11156',
        id: 6632357,
        name: 'United States',
        centroid:
          '{"type":"Point","coordinates":[-112.461673699567,45.679547202551]}',
      },
      {
        planted: '4218',
        id: 6632460,
        name: 'Malaysia',
        centroid:
          '{"type":"Point","coordinates":[109.697622842647,3.78986845571309]}',
      },
      {
        planted: '3830',
        id: 6632393,
        name: 'South Sudan',
        centroid:
          '{"type":"Point","coordinates":[30.2479000185772,7.30877944922343]}',
      },
      {
        planted: '2955',
        id: 6632375,
        name: 'Uganda',
        centroid:
          '{"type":"Point","coordinates":[32.3690797137035,1.27469298730871]}',
      },
      {
        planted: '1804',
        id: 6632492,
        name: 'Haiti',
        centroid:
          '{"type":"Point","coordinates":[-72.6852750898533,18.935025634308]}',
      },
      {
        planted: '1004',
        id: 6632436,
        name: 'Nigeria',
        centroid:
          '{"type":"Point","coordinates":[8.08943894770572,9.59411452232656]}',
      },
      {
        planted: '898',
        id: 6632538,
        name: 'Democratic Republic of the Congo',
        centroid:
          '{"type":"Point","coordinates":[23.6439610660395,-2.87746288969974]}',
      },
    ];
  }
}
