import {Component, ElementRef, ViewChild} from '@angular/core';
import {User, UserService} from '../user.service';
import { Router } from '@angular/router';
import {BgColors} from "../bgColors";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {

  constructor(private bgColors: BgColors, private elementRef: ElementRef, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    const bgCol = localStorage.getItem('bgColorValue');
    if(bgCol){
      this.bgColors.setBgColorToCss(Number(bgCol), this.elementRef);
    }

    this.bgColor = parseInt(getComputedStyle(this.elementRef.nativeElement.ownerDocument.documentElement).getPropertyValue('--value'));

    this.userService.getUserByUsername(this.userName).subscribe((u: User) => {
      this.imageUrl = u.profilePic;
      if (!this.imageUrl)
        this.imageUrl="../../assets/pfb.jpg";
    });


  }

  @ViewChild('fileInput') fileInput!: any;
  changingName: boolean = false;
  changingPassword: boolean = false;
  changingPicture: boolean = false;
  changingBgColor: boolean = false;

  newPassword: String = "";
  userName: string = localStorage.getItem("username")!;
  newUsername: String = "";
  imageUrl:string = "";
  newImageUrl : string = "";
  pictureMaxSize: number = 64000;
  showingPassword: boolean = false;

  isAvailableText:string = "Enter username";
  userExists: boolean = true;
  bgColor: number = 20;


  changePasswordVisibility(){
    this.showingPassword = !this.showingPassword;
  }

  changeName(){
    this.changingName = !this.changingName;
  }

  changePassword(){
    this.changingPassword = !this.changingPassword;
  }

  notChangePic(){
    this.changingPicture = false;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.value = "";
  }

  handleUserNameChange(event: any){
    const username = event.target.value;
    if(username.length === 0){return;}
    if(!(/^[a-zA-Z]/.test(username) || /^[0-9]/.test(username)) || username.length>20){
      this.userExists = true;
      this.isAvailableText = "enter valid username";
      return;
    }
    this.userService.userExists(username).subscribe((exists: any) => {
      this.userExists = exists;
      this.isAvailableText = exists ? "This username is not available" : "This username is available";
      if (!exists) {
        this.newUsername = username;
      }
    });
  }

  handlePasswordChange(event: any){
    this.newPassword = event.target.value;
  }

  addImage(): void {
    this.fileInput.nativeElement.click();
  }

  uploadImage() {
    console.log("Ayy?")
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (!fileInput.files) {
      return;
    }

    let file = fileInput.files[0];

    this.changingPicture = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      let image_url = event.target?.result;
      let image = new Image();
      image.src = image_url as string;

      // console.log("old size: " + image.src.length);

      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.height = 500;
        canvas.width = 500;
        const context = canvas.getContext("2d");

        if (context) {
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          do {
            canvas.height = canvas.height-5;
            canvas.width = canvas.width-5;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            this.newImageUrl = canvas.toDataURL("image/jpeg");
          } while(this.newImageUrl.length >= this.pictureMaxSize);
          // console.log("new size: " + this.newImageUrl.length);
        } else {
          console.error("Could not get 2D context from canvas.");
        }
      };
    };

  }



  async safeAllChanges(){
    if(this.changingName && this.userExists){return;}

    if(this.changingPassword || this.changingName){
      this.userService.userLoggedIn = false;
      localStorage.removeItem("username");
      localStorage.removeItem("bgColorItem");
      this.router.navigate(["/login"]);
    }else{
      this.router.navigate(["/"]);
    }

    let changedPassword = false;
    let changedPicture = false;
    let changedBgColor = false;

    if(this.changingBgColor){
      this.userService.changeBGColor(this.userName as string, this.bgColor).subscribe(() =>{
        changedBgColor = true;
      });
      localStorage.setItem("bgColorValue",String(this.bgColor));
    }

    while (!changedBgColor && this.changingBgColor){
      await this.sleep(10);
    }

    if(this.changingPicture){
      this.userService.changeProfilePicture(this.userName as string, this.newImageUrl as string).subscribe(() =>{
          changedPicture = true;
      });
      localStorage.setItem("profilePicture", this.newImageUrl);
    }

    while (!changedPicture && this.changingPicture){
      await this.sleep(10);
    }

    if(this.changingPassword){
      this.userService.changePassword(this.userName as string, this.newPassword as string).subscribe(() => {
        changedPassword = true;
      });
    }

    while (!changedPassword && this.changingPassword){
      await this.sleep(10);
    }

    if(this.changingName){
      this.userService.changeUserName(this.userName  as string, this.newUsername as string).subscribe();
    }

  }

  cancelAllChanges(){
    this.router.navigate(["/"]);
  }

  changeBgColor(event: any){
    this.changingBgColor = true;
    this.bgColors.setBgColorToCss(this.bgColor, this.elementRef);
  }


  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
