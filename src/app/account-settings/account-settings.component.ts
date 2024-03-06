import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {NgxImageCompressService} from 'ngx-image-compress';
import {from} from "rxjs";


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {

  constructor(private imageCompress: NgxImageCompressService, private router: Router, private userService: UserService) {
    this.userService.getProfilePicture(this.userName).subscribe((picture: any) => {
      console.log("da pic1"+picture);
      this.imageUrl = picture;
    });
  }

  changingName: boolean = false;
  changingPassword: boolean = false;
  changingPicture: boolean = false;

  newPassword: String = "";
  userName: string = localStorage.getItem("username")!;
  newUsername: String = "";
  imageUrl:string = "";
  newImageUrl : string = "";

  isAvailableText:string = "enter username";
  userExists: boolean = true;




  changeName(){
    this.changingName = !this.changingName;
  }

  changePassword(){
    this.changingPassword = !this.changingPassword;
  }

  notChangePic(){
    this.changingPicture = false;
    this.imageUrl = "";
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

  uploadImage() {
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

      console.log("old size: " + image.src.length);

      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.height = 100;
        canvas.width = 100;
        const context = canvas.getContext("2d");

        if (context) {
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          let lengthTest: number = canvas.toDataURL("image/jpeg").length;
          let quality: number = Math.min(((64000 / lengthTest) * 100), 100);

          this.newImageUrl = canvas.toDataURL("image/jpeg", quality);
          console.log("new size: " + this.newImageUrl.length);
        } else {
          console.error("Could not get 2D context from canvas.");
        }
      };
    };

  }



  async safeAllChanges(){
    if(this.changingName && this.userExists){return;}

    if(this.changingPicture){
      this.userService.changeProfilePicture(this.userName as string, "\"" + this.newImageUrl + "\"" as string).subscribe();
    }

    if(this.changingPassword){
      await this.sleep(1000);
      this.userService.changePassword(this.userName as string, this.newPassword as string).subscribe();
      this.userService.userLoggedIn = false;
      localStorage.removeItem("username");
      await this.router.navigate(["/login"])
    }

    if(this.changingName){
      await this.sleep(1000);
      this.userService.changeUserName(this.userName  as string, this.newUsername as string).subscribe();
      this.userService.userLoggedIn = false;
      localStorage.removeItem("username");
      await this.router.navigate(["/login"])
    }



    this.router.navigate(["/"]);
  }

  cancelAllChanges(){
    this.router.navigate(["/"]);
  }


  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
