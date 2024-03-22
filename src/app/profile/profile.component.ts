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
  public userBlocked: boolean = false;
  public userBlockedMe: boolean = false;

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

    this.userService.isBlocked(localStorage.getItem("username"), this.username).subscribe((blocked: boolean) => {
      this.userBlocked = blocked;
    })

    this.userService.amIBlocked(localStorage.getItem("username"), this.username).subscribe((blockedMe: boolean) => {
      this.userBlockedMe = blockedMe;
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

  onClickBlock() {
    this.userService.block(localStorage.getItem("username"), this.username).subscribe((blocked: boolean) => {
      this.userBlocked = !this.userBlocked;
      if(this.showFollowedCheck) this.showFollowedCheck = false;
    });
  }

}
