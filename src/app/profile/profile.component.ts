import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  public username: string | null;

  public showFollowedCheck: boolean = false;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.username = params.get('profile');
    });

    this.userService.isFollowed(localStorage.getItem("username"), this.username).subscribe((followed: boolean) => {
      this.showFollowedCheck = followed;
    })

  }

  onClickDM() {

  }

  onClickFollow() {
    this.userService.follow(localStorage.getItem("username"), this.username).subscribe((followed: boolean) => {
      this.showFollowedCheck = !this.showFollowedCheck;
    });
  }

}
