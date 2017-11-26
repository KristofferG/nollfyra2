import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  aqi: any;
  alco: any;
  weight: any;
  gender: any;
  beers: any;
  time: any;
  timeValue: any;
  alcoRound: any;
  statusText: any;
  constructor(public loader: LoadingController, public navCtrl: NavController, public http: Http) {
    this.http = http;
    this.loader = loader;
    this.aqi = { data: {} };
    this.reload();
    this.weight = 77;
    this.gender = "M";
    this.beers = 0;
    this.time = 0;
    this.alco = 0;
    this.alcoRound = 0
  }
  reload() {
    let loading = this.loader.create({
      spinner: 'dots',
      content: 'Loading',
      duration: 60000
    });
    this.http.get(`https://api.waqi.info/feed/here/?token=e936067d852a0d33f044c216389edfa0ae0176eb`)
      .toPromise()
      .then(response => {
        this.aqi = response.json();
        loading.dismiss();

      })
      .catch(error => {
        loading.dismiss();
        console.log(error.json())
        let eloading = this.loader.create({
          content: 'Connectivity Issue!',
          duration: 5000
        });
        eloading.present();
      });
  }

  aqiStatus(val) {

    if (val <= 50) {
      return { code: 'good', val: 'Good' };
    } else if (val <= 100) {
      return { code: 'mod', val: 'Moderate' };
    } else if (val <= 200) {
      return { code: 'unhealthy', val: 'Unhealthy' };
    } if (val <= 300) {
      return { code: 'vunhealthy', val: 'Very Unhealthy' };
    } else if (val > 300) {
      return { code: 'hazardous', val: 'Hazardous' };
    } else {
      return { code: '', val: '' }
    }
  }

  testKlick() {

    this.alco = (this.beers * 20)  / (0.72 * this.weight);
    if (this.time < 1) {
      this.alco -= 0.25;
    } else if (this.time == 1) {
      this.alco -= 0.13;
    } else {
      this.alco -= 0.15 * (this.time - 0.5);
    }

    if (this.alco < 0.01){
      this.alco = 0;
    }
    this.alcoRound = Math.round( this.alco * 10 ) / 10

  }

  kgTest(val) {

    if (val <= 50) {
      return "Hej";
      } else {
      return "Hej då"
      }
  }

  alcoStatus(val) {

    if (val <= 0.2) {
      this.statusText = "Spik";
      return { code: 'good', val: 'Good' };
    } else if (val <= 0.6) {
      this.statusText = "Livet är riktigt bra";
      return { code: 'mod', val: 'Moderate' };
    } else if (val <= 1.0) {
      this.statusText = "Nu börjar det bli högljutt";
      return { code: 'unhealthy', val: 'Unhealthy' };
    } if (val <= 1.6) {
      this.statusText = "Rätt vingligt och sluddrande";
      return { code: 'vunhealthy', val: 'Very Unhealthy' };
    } else if (val > 2.6) {
      this.statusText = "Dags att gå hem!";
      return { code: 'hazardous', val: 'Hazardous' };
    } else {
      return { code: '', val: '' }
    }
  }


}
