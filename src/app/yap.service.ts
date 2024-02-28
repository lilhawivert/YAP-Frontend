import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Yap {
  username: string,
  message: string,
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

  yapAway(yap: Yap) {
    return this.http.post(this.url+"yap", yap, { headers: this.headers });
  }

}
