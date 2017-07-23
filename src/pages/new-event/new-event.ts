import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Page } from 'ionic/ionic';
import { EventCreateMap } from '../event-map-create/event-map-create';
import { MapView } from '../map-view/map-view';
import { RestService } from "../../services/restService";
import { Push } from "@ionic/cloud-angular";
import { MyEvent } from '../../models/event';
import { Camera, CameraOptions } from "@ionic-native/camera";

/**
 * Generated class for the NewEvent page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-new-event',
  templateUrl: './new-event.html',
})
export class NewEvent {

  debugVar = {
    start: '',
    title: '',
    longitude: '',
    latitude: '',
    keywords: '',
    firstTime: '',
    secondTime: ''
  };

  lat: number;
  lng: number;
  event: MyEvent = new MyEvent();
  eventCreated: MyEvent = new MyEvent();
  nextMove: MyEvent = new MyEvent();
  newKeyword: string = "";

  constructor(private camera: Camera, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public restService: RestService, public modelCrtl: ModalController, public push: Push) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewEvent');
    // beim Laden der Page bekommen wir alle Events die der eingelogte User erstellt hat
    this.restService.getMyEvents()
      .subscribe(response => {
        console.log(response);
        console.log(response.length);
        let eventLength: number = response.length;
        if(eventLength > 0){
          this.eventCreated.$title = response[eventLength-1].title;
          this.eventCreated.$starttimepoint = response[eventLength-1].starttimepoint;
        }
        
      }, error => {
        console.log("Oooops! @11");
      });

   

    this.restService.getMyEventSubscriber()
      .subscribe(response => {
        this.nextMove.$title = response[response.length - 1].title;
        this.nextMove.$starttimepoint = response[response.length - 1].starttimepoint;
        this.debugVar.firstTime = response[response.length - 1].starttimepoint;
      }, error => {
        console.log("Oooops! @22");
      });
  }

  selectStartOnMap() {
    let mapView = this.modelCrtl.create(EventCreateMap);
    mapView.present();
    mapView.onDidDismiss(data => {
      this.event.$latitude = data.latitude;
      this.event.$longitude = data.longitude;
    });
  }

  createMove() {
    this.restService.newEvent(this.event)
      .subscribe(response => {
        if (response.message === 'Event erstellt') {
          this.presentAlert('Erfolgreich', 'Event erfolgreich erstellt');
        } else {
          this.presentAlert('Oh noes...', 'Unerwarteter Fehler aufgetreten... Keine Internetverbindung?');
        }
      }, error => {
        console.log("Oooops!");
      });
  }

  addToKeywordList(){
    this.event.$keywords.push(this.newKeyword);
    this.newKeyword = "";
  }


  takePhotoLocation(){
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.event.$picture = base64Image;
      }, (err) => {
        console.log(err);
    });
  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Okay']
    });
    alert.present();
  }
}