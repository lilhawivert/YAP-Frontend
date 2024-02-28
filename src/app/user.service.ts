import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string = "";
  public userLoggedIn: boolean = false;

  constructor(private http: HttpClient) { }

  register(): void {

  }

  login(username: string, password: string): void {
    this.http.post("http://localhost:8080/login", {username: username, password: password}).subscribe((response) => {
      if(response) {
        this.username = username;
        this.userLoggedIn = true;
      }
      else {
        console.log("PASSWORD FAKE")
      }
    })
  }

}
