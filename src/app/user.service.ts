import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Yap } from './yap.service';

export interface User {
  id: string,
  username: string,
  password: string,
  profilePic: string,
  bgColor: number
}

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
    return this.http.post(this.url+"changeProfilePicture/"+username, newPicture);
  }

  getYapsByUser(username: string) {
    return this.http.get<Yap[]>(this.url+"yaps/"+username)
  }

  follow(userWhoFollows: string | null, userWhosFollowed: string | null) {
    return this.http.post<boolean>(this.url+userWhosFollowed+"/follow", userWhoFollows);
  }

  isFollowed(userWhoFollows: string | null, userWhosFollowed: string | null) {
    return this.http.get<boolean>(this.url+userWhosFollowed+"/follow?userWhoFollows="+userWhoFollows);
  }

  getUserByUsername(username: string){
    return this.http.get<User>(this.url+"getUser/"+username);
  }

  getUsersOfYaps(yaps: Yap[]){
    return this.http.post<User[]>(this.url+"getUsersOfYaps",yaps);
  }

  getUserByUserID(userId: string){
    return this.http.get<User>(this.url+"getUserById/"+userId);
  }

  getUsersByUsernamePartial(username: string){
    return this.http.get<User[]>(this.url+"getUsersByUsernamePartial/"+username);
  }

  changeBGColor(username: string, bgColor: number){
    return this.http.post(this.url+"changeBgColor/"+username, bgColor);
  }

}
