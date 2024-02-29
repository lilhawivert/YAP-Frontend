import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Comment {
  id?: string,
  username: string,
  message: string,
  new?: boolean,
  likes: number,
  yap?: Yap
}

export interface Yap {
  username: string,
  message: string,
  likes?: number,
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
    this.http.get<Yap[]>(this.url+"yap").subscribe((val: Yap[]) => {
      this.loadedYaps = val;
    })
  }

  getYap(id: string) {
    return this.http.get<Yap>(this.url+"yap/"+id);
  }

  yapAway(yap: Yap) {
    return this.http.post(this.url+"yap", yap, { headers: this.headers });
  }

  postComment(username: string | null, message: string, yap: Yap) {
    this.http.post(this.url+"yap/"+yap.id+"/comment", {yap: yap, username: username, message: message}).subscribe();
  }

  getComments(yap: Yap) {
    this.http.get<Yap[]>(this.url+"yap/"+yap.id+"/comment")
  }

}
