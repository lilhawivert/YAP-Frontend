import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string = "";

  constructor(private http: HttpClientModule) { }

  
}
