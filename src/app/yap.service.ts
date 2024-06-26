import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {User} from "./user.service";

export interface Comment {
  id?: string,
  username: string,
  message: string,
  new?: boolean,
  likes?: number,
  liked?: boolean,
  deleted?: boolean,
  yap?: Yap
}

export interface Yap {
  username: string | null,
  message: string,
  likes?: number,
  liked?: boolean,
  comments?: Comment[],
  id?: string
}

@Injectable({
  providedIn: 'root'
})
export class YapService {


  constructor(private http: HttpClient) { }

  private url: string = "http://localhost:8080/";
  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  public loadedYaps: Yap[] = [];
  public usersOfYaps: User[] = [];

  getYaps(username: string | null, maxYaps: number) {
    return this.http.post<Yap[]>(this.url+"yaps/"+maxYaps, username, { headers: this.headers });
  }

  getYap(id: string, username: string | null) {
    return this.http.post<Yap>(this.url+"yap/"+id, username);
  }

  getYapById(){

  }

  likeYap(id: string | undefined, user: string | null) {
    return this.http.post(this.url+"yap/"+id+"/like", user);
  }

  yapAway(yap: Yap) {
    return this.http.post<string>(this.url+"yap", yap, { headers: this.headers });
  }

  deleteYap(yap: Yap) {
    return this.http.delete(this.url+"yap/"+yap.id);
  }

  postComment(username: string | null, message: string, yap: Yap) {
    return this.http.post<string>(this.url+"yap/"+yap.id+"/comment", {yap: yap, username: username, message: message});
  }

  getComments(yap: Yap) {
    this.http.get<Yap[]>(this.url+"yap/"+yap.id+"/comment")
  }

  deleteComment(yap: Yap, commentId: string | undefined) {
    return this.http.delete(this.url+"yap/"+yap.id+"/comment/"+commentId)
  }

  likeComment(yap: Yap, commentId: string | undefined, user: string | null) {
    return this.http.post(this.url+"yap/"+yap.id+"/comment/"+commentId, user)
  }

  getTrends(){
    return this.http.get<string[]>(this.url+"getTrends");
  }

  getYapsOfTrend(trend: String){
  return this.http.get<Yap[]>(this.url+"getYapsOfTrend/"+trend);
  }

  safeYap(yapId: string, username: string){

  }

}
