import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {User, UserService} from '../user.service';
import { Router } from '@angular/router';
import { YapService } from '../yap.service';
import {BgColors} from "../bgColors";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  @ViewChild('yapTextArea') textareaInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: any;
  public selectedFile: File | undefined;
  public usernameLoaded: boolean = false;

  constructor(private elementRef: ElementRef, private bgColors: BgColors, public userService: UserService, private router: Router, public yapService: YapService,) {}

  ngOnInit() {
    const userName = localStorage.getItem("username");
    console.log(userName)
    if(!userName) {
      this.router.navigate(["/login"])
    }
    else {
      this.usernameLoaded = true;
      if(localStorage.getItem('bgColorValue')) {
        this.bgColors.setBgColorToCss(Number(localStorage.getItem('bgColorValue')!), this.elementRef);
        return;
      }
      this.userService.getUserByUsername(userName).subscribe((u: User) =>{
        const bgColor = u.bgColor;
        if(bgColor){
          localStorage.setItem('bgColorValue', String(bgColor));
          this.bgColors.setBgColorToCss(bgColor, this.elementRef);
        }else{
          localStorage.setItem('bgColorValue', "0");
          this.bgColors.setBgColorToCss(0, this.elementRef);
        }
      });
    }


  }

  onClickYap() {
    this.yapService.yapAway({username: localStorage.getItem("username"), message: this.textareaInput.nativeElement.value}).subscribe((receivedId: string) => {
      console.log("here")
      this.yapService.loadedYaps.unshift({username: localStorage.getItem("username"), message: this.textareaInput.nativeElement.value, id: receivedId})
      this.yapService.usersOfYaps.unshift({
        username: localStorage.getItem("username") + "", profilePic: localStorage.getItem("profilePicture") + "",
      })
      this.textareaInput.nativeElement.value = "";
    }, () => {
      //on yap error
    });
  }

  addImage(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

}
