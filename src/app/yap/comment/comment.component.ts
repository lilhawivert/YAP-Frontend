import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Comment, Yap, YapService } from '../../yap.service';
import {User, UserService} from "../../user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  @ViewChild('replyTextArea') textareaInput!: ElementRef;
  @Input() public comment: Comment;
  @Input() public yap: Yap;
  public profilePic = "../../assets/pfb.jpg"

  @Output() newReplyEvent = new EventEmitter<Comment>();
  @Output() deleteEvent = new EventEmitter<Comment>();
  @Output() likeCommentEvent = new EventEmitter<Comment>();

  public showReplyTextArea: boolean = false;

  constructor(private userService: UserService, private yapService: YapService, private router: Router) {}

  ngOnInit(){
    this.userService.getUserByUsername(this.comment.username!).subscribe((u : User) => {
      if(u.profilePic)this.profilePic = u.profilePic;
    });
  }

  public get getUsername(): string | null {
    return localStorage.getItem("username");
  }

  public onClickReplyComment() {
    this.showReplyTextArea = !this.showReplyTextArea;
  }

  public onClickReplySend() {
    const msg = `@${this.comment.username} `+this.textareaInput.nativeElement.value;
    this.yapService.postComment(this.getUsername, msg, this.yap).subscribe(commentId => {
      this.newReplyEvent.emit({username: this.getUsername || "", message: msg, yap: this.yap, id: commentId})
      this.showReplyTextArea = !this.showReplyTextArea;
    })
  }

  public onClickHeartComment() {
    this.yapService.likeComment(this.yap, this.comment.id, localStorage.getItem("username")).subscribe(() => {
      this.likeCommentEvent.emit(this.comment)
    }, () => {

    })
  }

  public deleteOwnComment() {
    this.deleteEvent.emit(this.comment);
  }

  public clickOnUser(username: string) {
    this.router.navigate([username]);
  }

}
