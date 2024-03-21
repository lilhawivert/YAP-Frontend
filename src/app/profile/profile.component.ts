import {Component, ElementRef, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {BgColors} from "../bgColors";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  public username: string | null;

  public showFollowedCheck: boolean = false;

  constructor(private bgColors: BgColors, private elementRef: ElementRef, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const bgCol = localStorage.getItem('bgColorValue');
    if(bgCol){
      this.bgColors.setBgColorToCss(Number(bgCol), this.elementRef);
    }

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.username = params.get('profile');
    });

    this.userService.isFollowed(localStorage.getItem("username"), this.username).subscribe((followed: boolean) => {
      this.showFollowedCheck = followed;
    })

  }

  public get notMe(): boolean {
    return this.username !== localStorage.getItem("username");
  }

  onClickDM() {
    this.router.navigate([this.username + "/dm"])
  }

  onClickFollow() {
    this.userService.follow(localStorage.getItem("username"), this.username).subscribe((followed: boolean) => {
      this.showFollowedCheck = !this.showFollowedCheck;
    });
  }

}
