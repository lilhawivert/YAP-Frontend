import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user.service';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
var stompClient: any = null;

export interface DM {
  sender: string;
  receiver: string;
  message: string;
  date?: Date
}
@Component({
  selector: 'app-dm',
  templateUrl: './dm.component.html',
  styleUrl: './dm.component.css'
})
export class DmComponent {

  public partner: string | null;
  public loading: boolean = false;
  private webSocketConnect: string = "http://localhost:8080/websocket";

  public dms: DM[] = [];


  textareaInput!: string;
  @ViewChild('dmInput') dmInput!: ElementRef;

  constructor(public activatedRoute: ActivatedRoute, public userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.partner = params.get('profile');

      this.userService.getMessages(localStorage.getItem("username"), this.partner).subscribe((res: DM[]) => {
        this.dms = res;
        this.loading = false;
      })

      var socket = new SockJS(this.webSocketConnect);
      console.log(this.dms)
      let a = this;
      stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame: any) {
        stompClient.subscribe('/send/'+localStorage.getItem("username")+params.get("profile"), (request: any) => {
          a.dms.push({sender: params.get("profile") + "", receiver: localStorage.getItem("username") + "", message: request.body})
        })
      });
  })
}

sendMessage() {
  stompClient.send("/send/"+this.partner+localStorage.getItem("username"), {}, this.dmInput.nativeElement.value)
  console.log(new Date(Date.now()))
  this.dms.push({sender: localStorage.getItem("username") + "", receiver: this.partner + "", message: this.dmInput.nativeElement.value})
  this.userService.sendMessage(localStorage.getItem("username"), this.partner, this.dmInput.nativeElement.value);
  this.dmInput.nativeElement.value = "";
}

formatHours(date: Date | undefined): string {
  if(date == undefined) return "now";
  return date?.toString().split("T")[1].split(".")[0] + "";
}

formatDate(date: Date | undefined): string {
  if(date == undefined) return "";
  return date?.toString().split("T")[0] + "";
}

}



