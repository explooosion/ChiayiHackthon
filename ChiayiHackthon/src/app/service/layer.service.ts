import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { GeoJson, Features, Geometry } from '../class/geo-json';

import { Hospi } from '../class/hospi';
import { Secure } from '../class/secure';
import { Care } from '../class/care';
import { Temple } from '../class/temple';
import { Burglary } from '../class/burglary';

@Injectable()
export class LayerService {

  private hospiGeoJson: GeoJson = new GeoJson();
  private secureGeoJson: GeoJson = new GeoJson();
  private careGeoJson: GeoJson = new GeoJson();
  private templeGeoJson: GeoJson = new GeoJson();
  private burglaryGeoJson: GeoJson = new GeoJson();

  private hospi: Hospi;
  private secure: Secure;
  private care: Care;
  private temple: Temple;
  private burglary: Burglary;

  private hospiArr: Hospi[];
  private secureArr: Secure[];
  private careArr: Care[];
  private templeArr: Temple[];
  private burglaryArr: Burglary[];

  private fileUrl: string = 'assets/layer/';
  private fileCategory: string = '';
  private fileExtend: string = '.csv';

  private fileUrlMap: string = 'assets/layer/map/county.json';
  constructor(private http: Http) { }

  /**
   * 讀取地區 JSON（GeoJson）
   */
  public getTaiwanLayer() {
    return this.http.get(this.fileUrlMap)
      .map((res) => {
        return res.json() || {}
      });
  }

  /**
   * 讀取指標 CSV（監視器、醫院診所、照護機構、宗教建設、竊盜紀錄）
   * @param category 
   * @param city 
   */
  public getPointerLayer(category: string, city: string) {
    return this.http.get(this.fileUrl + category + '/' + city + this.fileExtend)
      .map(
      (res) => {
        switch (category) {
          case 'hospi':
            return this.saveHospi(res);

          case 'secure':
            return this.saveSecure(res);

          case 'care':
            return this.saveCare(res);

          case 'temple':
            return this.saveTemple(res);

          case 'burglary':
            return this.saveBurglary(res);
        }
      }
      );
  }

  /**
   * Layer - 宗教建設
   * @param res 
   */
  public saveTemple(res: Response): Temple[] {
    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');

    let lines = [];
    for (let i = 1; i < allTextLines.length; i++) {

      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {

        this.temple = new Temple(
          data[0],  // name
          data[1],  // lordgod
          data[2],  // area
          data[3],  // address
          data[4],  // lat
          data[5]   // lng
        );

        lines.push(this.temple);
      }
      this.templeArr = lines;

    }
    return this.templeArr;
  }

  /**
   * Layer - 照護機構
   * @param res 
   */
  public saveCare(res: Response): Care[] {
    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');

    let lines = [];
    for (let i = 1; i < allTextLines.length; i++) {

      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {

        this.care = new Care(
          data[0],    // name
          data[6],    // service
          data[1],    // area
          data[4],    // address
          data[11],   // lat
          data[12]    // lng
        );

        lines.push(this.care);
      }
      this.careArr = lines;

    }
    return this.careArr;
  }

  /**
   * Layer - 監視器
   * @param res 
   */
  public saveSecure(res: Response): Secure[] {
    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');

    let lines = [];
    for (let i = 1; i < allTextLines.length; i++) {

      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {

        this.secure = new Secure(
          data[0],  // address
          data[1],  // lat
          data[2],  // lng 
        );

        lines.push(this.secure);
      }
      this.secureArr = lines;

    }
    return this.secureArr;
  }

  /**
   * Layer - 竊盜紀錄
   * @param res 
   */
  public saveBurglary(res: Response): Burglary[] {
    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');

    let lines = [];
    for (let i = 1; i < allTextLines.length; i++) {

      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {

        this.burglary = new Burglary(
          data[0],  // address
          data[1],  // lat
          data[2],  // lng
          data[3]   // date
        );

        lines.push(this.burglary);
      }
      this.burglaryArr = lines;

    }
    return this.burglaryArr;
  }

  /**
   * Layer - 醫院診所
   * @param res 
   */
  public saveHospi(res: Response): Hospi[] {
    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');

    let lines = [];
    for (let i = 1; i < allTextLines.length; i++) {

      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {

        this.hospi = new Hospi(
          data[0],  // address
          data[1],  // lat
          data[2],  // lng
          data[3],  // Address
          data[4] == null ? '' : data[4], // level
        );

        lines.push(this.hospi);
      }
      this.hospiArr = lines;

    }
    return this.hospiArr;
  }

  /**
   * GeoJson - 宗教建設
   * @param temple 
   */
  public getTempleGeoJson(temple: any[]): GeoJson {

    temple.forEach(element => {
      this.templeGeoJson.features.push(
        new Features(
          {
            group: 'temple',
            name: element.name,
            address: element.address,
            lat: Number(element.lat),
            lng: Number(element.lng),
            lordgod: element.lordgod,
          },
          new Geometry('Point', [Number(element.lng), Number(element.lat)])
        )
      );
    });

    return JSON.parse(JSON.stringify(this.templeGeoJson));
  }

  /**
   * GeoJson - 照護機構
   * @param care 
   */
  public getCareGeoJson(care: any[]): GeoJson {

    care.forEach(element => {
      this.careGeoJson.features.push(
        new Features(
          {
            group: 'care',
            name: element.name,
            address: element.address,
            lat: Number(element.lat),
            lng: Number(element.lng),
            service: element.service,
          },
          new Geometry('Point', [Number(element.lng), Number(element.lat)])
        )
      );
    });

    return JSON.parse(JSON.stringify(this.careGeoJson));
  }

  /**
   * GeoJson - 監視器
   * @param secure 
   */
  public getSecureGeoJson(secure: any[]): GeoJson {

    secure.forEach(element => {
      this.secureGeoJson.features.push(
        new Features(
          {
            group: 'secure',
            address: element.address,
            lat: Number(element.lat),
            lng: Number(element.lng),
          },
          new Geometry('Point', [Number(element.lng), Number(element.lat)])
        )
      );
    });
    return JSON.parse(JSON.stringify(this.secureGeoJson));
  }

  /**
   * GeoJson - 竊盜紀錄
   * @param burglary 
   */
  public getBurglaryGeoJson(burglary: any[]): GeoJson {

    burglary.forEach(element => {
      this.burglaryGeoJson.features.push(
        new Features(
          {
            group: 'burglary',
            address: element.address,
            lat: Number(element.lat),
            lng: Number(element.lng),
            date: element.date,
          },
          new Geometry('Point', [Number(element.lng), Number(element.lat)])
        )
      );
    });
    return JSON.parse(JSON.stringify(this.burglaryGeoJson));
  }

  /**
   * GeoJson - 醫院診所
   * @param hospi 
   */
  public getHospiGeoJson(hospi: any[]): GeoJson {

    hospi.forEach(element => {
      this.hospiGeoJson.features.push(
        new Features(
          {
            group: 'hospi',
            name: element.name,
            address: element.address,
            lat: Number(element.lat),
            lng: Number(element.lng),
            level: element.level
          },
          new Geometry('Point', [Number(element.lng), Number(element.lat)])
        )
      );
    });
    return JSON.parse(JSON.stringify(this.hospiGeoJson));
  }
}
