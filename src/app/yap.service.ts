import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Comment {
  id?: string,
  username: string,
  message: string,
  new?: boolean,
  likes?: number,
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

  getYaps() {
    return this.http.get<Yap[]>(this.url+"yap");
  }

  getYap(id: string, username: string | null) {
    return this.http.post<Yap>(this.url+"yap/"+id, username);
  }

  likeYap(id: string | undefined, user: string | null) {
    return this.http.post(this.url+"yap/"+id+"/like", user);
  }

  yapAway(yap: Yap) {
    return this.http.post<string>(this.url+"yap", yap, { headers: this.headers });
  }

  postComment(username: string | null, message: string, yap: Yap) {
    this.http.post(this.url+"yap/"+yap.id+"/comment", {yap: yap, username: username, message: message}).subscribe();
  }

  getComments(yap: Yap) {
    this.http.get<Yap[]>(this.url+"yap/"+yap.id+"/comment")
  }

  deleteComment(yap: Yap, commentId: string | undefined) {
    console.log(this.url+"yap/"+yap.id+"/comment/"+commentId)
    return this.http.delete(this.url+"yap/"+yap.id+"/comment/"+commentId)
  }

}
