import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Page } from 'ionic/ionic';
import { RestService } from '../../services/restService';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';
import { User } from '../../models/user';
import { Push, PushToken } from '@ionic/cloud-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: './login.html',
})
export class Login {

  loginVars = {
    username: '',
    password: ''
  };

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public restService: RestService, public user: User, public push: Push) {
    this.push.rx.notification()
      .subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
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

  login() {
    // Lokale Überprüfung der Eingaben bevor POST 
    if (this.loginVars.username == '' || this.loginVars.password == '') {
      this.presentAlert('Login failed', 'Missing credentials');
    } else {

      // POST ab hier
      this.restService.login(this.loginVars.username, this.loginVars.password)
        .subscribe(response => {
          if (response.message === 'User Login succesful') {
            this.restService.getUser().subscribe(userResponse => {
              this.user.$firstname = userResponse.firstName;
              this.user.$lastname = userResponse.lastName;
              this.user.$email = userResponse.email;
              this.user.$birthday = userResponse.birthdate;
              this.user.$picture = userResponse.picture;
              this.user.$gender = userResponse.sex;
              this.user.$username = userResponse.username;
            });

            this.push.register().then((token: PushToken) => {
              return this.push.saveToken(token);
            }).then((token: PushToken) => {
              console.log(token);
              this.restService.setPushToken(token.token).subscribe(response => {
                console.log(response.message);
              });
            }).catch(function (error) {
              console.log("Not a valide Device");
            });

            this.navCtrl.setRoot(TabsPage);
          } else if (response.message === 'User Not found') {
            this.presentAlert('Login failed', 'Username or Password is wrong');
          } else if (response.message === 'Invalid Password') {
            this.presentAlert('Login failed', 'Password is wrong');
          } else {
            this.presentAlert('Oh noes...', 'An unexpected error happened...');
          }
        }, error => {
          console.log("Oooops!");
          this.presentAlert('Oh noes...', 'An unexpected error happened. Maybe no internet connection?');
        });
    }
  }

  register() {
    this.navCtrl.push(Register);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }
}