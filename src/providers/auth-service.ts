import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';

export class User {
  firstName: string;
  lastName: string;
  email: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}


@Injectable()
export class AuthService {
  currentUser: User;
  url: String = "https://dev.tuten.cl/TutenREST/rest/user/";

  constructor(public http: Http) {}


   public login(credentials) {
    if (credentials.email === null || credentials.pass === null) {
      return Observable.throw("Faltan credenciales");
    } else {
      return Observable.create(observer => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('password', credentials.pass);
        headers.append('app', 'APP_WEB');
        headers.append('Accept', 'application/json');

        this.http.put(this.url+credentials.email, null, {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.currentUser = new User(data.firstName, data.lastName, data.email);
            observer.next(true);
            observer.complete();
          }, (err) => {
            console.log(err);
            observer.next(false);
            observer.complete();
          });
      });
    }
  }


  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}
