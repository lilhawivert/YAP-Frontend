import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user.service';
// import SockJS from 'sockjs-client';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
// import Stomp from 'stompjs';

// declare var SockJS: any;
var stompClient: any = null;

@Component({
  selector: 'app-dm',
  templateUrl: './dm.component.html',
  styleUrl: './dm.component.css'
})
export class DmComponent {

  public partner: string | null;
  private webSocketConnect: string = "http://localhost:8080/websocket";

  @ViewChild('dmTextArea') textareaInput!: ElementRef;
  @ViewChild('dmInput') dmInput!: ElementRef;

  constructor(public activatedRoute: ActivatedRoute, public userService: UserService) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.partner = params.get('profile');

      var socket = new SockJS(this.webSocketConnect);

      stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame: any) {
        stompClient.subscribe('/send/'+localStorage.getItem("username")+params.get("profile"), (request: any) => {
          document.getElementById("dmTextArea")!.innerText += params.get("profile") + ": " + request.body;
        })
      });



  })


}

sendMessage() {
  stompClient.send("/send/"+this.partner+localStorage.getItem("username"), {}, this.dmInput.nativeElement.value)
}
}



