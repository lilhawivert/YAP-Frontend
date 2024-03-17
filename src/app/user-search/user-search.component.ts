import {Component, ElementRef} from '@angular/core';
import {User, UserService} from '../user.service';
import { Router } from '@angular/router';
import {BgColors} from "../bgColors";

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {

  constructor(private bgColors: BgColors, private elementRef: ElementRef, private router: Router, private userService: UserService) {

  }

  searchByUser: boolean = true;
  input: string = "";
  users: User[] = [];


  ngOnInit() {
    const bgCol = localStorage.getItem('bgColorValue');
    if(bgCol){
      this.bgColors.setBgColorToCss(Number(bgCol), this.elementRef);
    }

    if(this.searchByUser){
      this.userService.getUsersByUsernamePartial(this.input).subscribe((u:User[]) =>{
        this.users = u;
        console.log(this.users);
      });
    }
  }

  handleDropdownChange(event: any) {
    const selectedOption = event.target.value;
    if(selectedOption === "option1"){
      this.searchByUser = true;
      this.userService.getUsersByUsernamePartial(this.input).subscribe((u:User[]) =>{
        this.users = u;
        console.log(this.users);
      });
    }else if(selectedOption === "option2"){
      this.searchByUser = false;
      this.users = [];
    }
  }

  handleInputChange(event: any) {
      this.input = event.target.value;
      if(this.searchByUser){
        this.userService.getUsersByUsernamePartial(this.input).subscribe((u:User[]) =>{
          this.users = u;
          console.log(this.users);
        });
      }
  }

  search(){
    if(this.searchByUser){
      this.userService.getUserByUsername(this.input).subscribe((u: User) => {
        if(u!=null)this.users = [u];
        console.log(this.users);
      });
    }else {
      this.userService.getUserByUserID(this.input).subscribe((u: User) => {
        if(u!=null)this.users = [u];
        console.log(this.users);
      });
    }
  }

  public get getUsername(): string | null {
    return localStorage.getItem("username");
  }

  onClickProfile(username: string | null) {
    this.router.navigate([username]);
  }





}
