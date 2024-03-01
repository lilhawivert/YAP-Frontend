import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Comment, Yap, YapService } from '../../yap.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

  @ViewChild('replyTextArea') textareaInput!: ElementRef;
  @Input() public comment: Comment;
  @Input() public yap: Yap;

  @Output() newReplyEvent = new EventEmitter<Comment>();
  @Output() deleteEvent = new EventEmitter<Comment>();
  @Output() likeCommentEvent = new EventEmitter<Comment>();

  public showReplyTextArea: boolean = false;

  constructor(private yapService: YapService) {}

  public get getUsername(): string | null {
    return localStorage.getItem("username");
  }

  public onClickReplyComment() {
    this.showReplyTextArea = !this.showReplyTextArea;
  }

  public onClickReplySend() {
    const msg = `@${this.comment.username} `+this.textareaInput.nativeElement.value;
    this.yapService.postComment(this.getUsername, msg, this.yap)
    this.newReplyEvent.emit({username: this.getUsername || "", message: msg, yap: this.yap})
    this.showReplyTextArea = !this.showReplyTextArea;
  }

  public onClickHeartComment() {
    this.yapService.likeComment(this.yap, this.comment.id, localStorage.getItem("username")).subscribe(() => {
      // this.yap.liked = !this.yap.liked;
      // if(!this.yap.liked) this.yap.likes!--;
      // else if(this.yap.liked) this.yap.likes!++;
      this.likeCommentEvent.emit(this.comment)
    }, () => {

    })
  }

  public deleteOwnComment() {
    this.deleteEvent.emit(this.comment);
  }

}
