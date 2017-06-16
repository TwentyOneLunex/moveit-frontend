import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Page } from 'ionic/ionic';

import { Login } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class Register {

  registerVars = {
    firstname: '',
    lastname: '',
    email: '',
    birthdate: '1990-01-01',
    sex: 'male',
    picture: '',  // noch unbenutzt, Bild wird nicht direkt bei Anmeldung gesetzt
    username: '',
    password: '',
    passwordCheck: ''
  };

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register');
  }

  createAccount() {

    // Lokale Überprüfung der Eingaben bevor POST 
    if (this.registerVars.firstname == '' ||
      this.registerVars.lastname == '' ||
      this.registerVars.email == '' ||
      this.registerVars.username == '' ||
      this.registerVars.password == '' ||
      this.registerVars.passwordCheck == '' ||
      this.registerVars.sex == '' ||
      this.registerVars.birthdate == '') {
      this.presentAlert('Login fehlgeschlagen', 'Nicht alle Felder ausgefüllt');
    } else if (this.registerVars.password != this.registerVars.passwordCheck) {
      this.presentAlert('Login fehlgeschlagen', 'Passwörter stimmen nicht überein');
    } else {

      // POST ab hier

      var link = 'https://moveit-backend.herokuapp.com/signup';

      this.http.post(link, {
        firstName: this.registerVars.firstname,
        lastName: this.registerVars.lastname,
        email: this.registerVars.email,
        birthdate: this.registerVars.birthdate,
        sex: this.registerVars.sex,
        username: this.registerVars.username,
        password: this.registerVars.password,
        passwordCheck: this.registerVars.passwordCheck
      })
        .map(response => response.json())
        .subscribe(response => {
          if (response.message === 'Missing credentials') {
            this.presentAlert('Fehlgeschlagen', 'Benutzername oder Passwort fehlt');
          } else if (response.message === 'User Already Exists') {
            this.presentAlert('Fehlgeschlagen', 'Benutzername bereits vergeben.');
          } else if (response.message === 'User Registration succesful') {
            this.presentAlert('Erfolgreich', 'Glückwunsch, Sie können sich jetzt anmelden');
          } else {
            this.presentAlert('Oh noes...', 'Unerwarteter Fehler aufgetreten... Keine Internetverbindung?');
          }
        }, error => {
          console.log("Oooops!");
        });
    }
  }

  resetInputs() {
    this.registerVars.firstname = '',
      this.registerVars.lastname = '',
      this.registerVars.email = '',
      this.registerVars.birthdate = '',
      this.registerVars.sex = '',
      this.registerVars.username = '',
      this.registerVars.password = '',
      this.registerVars.passwordCheck = ''
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