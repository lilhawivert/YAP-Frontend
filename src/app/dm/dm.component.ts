import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user.service';
// import SockJS from 'sockjs-client';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
// import Stomp from 'stompjs';

// declare var SockJS: any;
var stompClient: any = null;

export interface DM {
  sender: string;
  receiver: string;
  message: string;
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
      let tst: DM[] = this.dms;


      let a = this;

      stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame: any) {
        stompClient.subscribe('/send/'+localStorage.getItem("username")+params.get("profile"), (request: any) => {

          console.log(request)
          // console.log("heawer")
          // console.log(document.getElementById("dmTextArea"))
          // document.getElementById("dmTextArea")!.innerText = request.body;
          a.dms.push({sender: params.get("profile") + "", receiver: localStorage.getItem("username") + "", message: request.body})
          // this.dms.push({sender: params.get("profile") + "", receiver: localStorage.getItem("username") + "", message: request.body})



        })
      });



  })


}

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

receiveMessage(event:any) {
  console.log("XXXXXXXXXX")
  this.dms.push({sender: this.partner + "", receiver: localStorage.getItem("username") + "", message: document.getElementById("dmTextArea")!.innerText})
}

sendMessage() {
  stompClient.send("/send/"+this.partner+localStorage.getItem("username"), {}, this.dmInput.nativeElement.value)
  // document.getElementById("dmTextArea")!.innerText += localStorage.getItem("username") + ": " + this.dmInput.nativeElement.value;
  this.dms.push({sender: localStorage.getItem("username") + "", receiver: this.partner + "", message: this.dmInput.nativeElement.value})
  this.userService.sendMessage(localStorage.getItem("username"), this.partner, this.dmInput.nativeElement.value);
  this.dmInput.nativeElement.value = "";
}
}



