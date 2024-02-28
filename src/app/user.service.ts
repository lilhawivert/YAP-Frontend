import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string = "";
  public userLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  register(username: string, password: string): void {
    this.http.post("http://localhost:8080/register", {username: username, password: password}).subscribe((response) => {
      if(response) {
        this.username = username;
        this.userLoggedIn = true;
        this.router.navigate(["/"])
      }
      else {
        console.log("Unknown Error")
      }
    })
  }

  login(username: string, password: string): void {
    this.http.post("http://localhost:8080/login", {username: username, password: password}).subscribe(() => {
        this.username = username;
        this.userLoggedIn = true;
        this.router.navigate(["/"])
    });
  }

}
