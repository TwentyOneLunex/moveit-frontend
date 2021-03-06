/**
 * Created by eugen on 16.06.17.
 */


import { ComponentFixture, async , TestBed } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { Login }                   from './login';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock,NavMock } from '../../mocks';
import { NavParams } from 'ionic-angular';
import { RestService } from "../../services/restService";
import { Http, Headers, RequestOptions } from '@angular/http';


let fixture: ComponentFixture<Login> = null;
let instance: any = null;

describe('Pages: Login', () => {
    let de: DebugElement;
    let comp: Login;
    let fixture: ComponentFixture<Login>;



    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Login],
            imports: [
                IonicModule.forRoot(Login)
            ],
            providers: [
                NavController,
                { provide: Platform, useClass: PlatformMock},
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
                { provide: NavParams, useClass: NavMock },
                { provide: RestService},
                { provide: Http}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Login);
        comp = fixture.componentInstance;
    });


    it('should be created', () => {
        expect(comp instanceof Login).toBe(true);
    });

    /*   it('should show an allert', () => {
        sypOn(window, 'alert');
        expect(alert).toHaveBeenCalled();
    }); */


});






