import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Yap } from './yap.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public username: string | null | undefined = "";
  public userLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  register(username: string, password: string): Observable<Object> {
    return this.http.post("http://localhost:8080/register", {username: username, password: password})
  }

  login(username: string, password: string) {
    return this.http.post("http://localhost:8080/login", {username: username, password: password})
  }

  getYapsByUser(username: string) {
    return this.http.get<Yap[]>("http://localhost:8080/yaps/"+username)
  }

  follow(userWhoFollows: string | null, userWhosFollowed: string | null) {
    return this.http.post<boolean>("http://localhost:8080/"+userWhosFollowed+"/follow", userWhoFollows);
  }

  isFollowed(userWhoFollows: string | null, userWhosFollowed: string | null) {
    return this.http.get<boolean>("http://localhost:8080/"+userWhosFollowed+"/follow?userWhoFollows="+userWhoFollows);
  }


}
