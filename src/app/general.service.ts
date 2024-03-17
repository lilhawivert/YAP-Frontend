import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Yap } from './yap.service';

export interface User {
  id: string,
  username: string,
  password: string,
  profilePic: string,
}

@Injectable({
  providedIn: 'root'
})

export class GeneralService {

  private url: string = "http://localhost:8080/";
  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private http: HttpClient, private router: Router) {

  }

  getHealth(){
    return this.http.get(this.url+"health", { responseType: 'text' });
}

}
