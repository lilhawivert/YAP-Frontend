import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string | null | undefined = "";
  public userLoggedIn: boolean = false;
  private url: string = "http://localhost:8080/";

  constructor(private http: HttpClient, private router: Router) { }

  register(username: string, password: string): Observable<Object> {
    return this.http.post(this.url+"register", {username: username, password: password})
  }

  login(username: string, password: string) {
    return this.http.post(this.url+"login", {username: username, password: password})
  }

  userExists(username: string){
    return this.http.get<boolean>(this.url+"userExists/"+username);
  }

  changeUserName(oldUsername: string, newUsername: string){
    return this.http.post(this.url+"changeUserName/"+oldUsername, newUsername);
  }

  changePassword(username: string, newPassword: string){
    return this.http.post(this.url+"changePassword/"+username, newPassword);
  }

  changeProfilePicture(username: string, newPicture: string){
    console.log("changing Pic: "+username+" "+newPicture);
    return this.http.post(this.url+"changeProfilePicture/"+username, newPicture);
  }

  getProfilePicture(username: string){
    console.log("getting pp")
    return this.http.get<string>(this.url+"getProfilePicture/"+username);
  }

}
