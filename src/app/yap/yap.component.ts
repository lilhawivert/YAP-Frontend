import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment, Yap, YapService } from '../yap.service';

@Component({
  selector: 'app-yap',
  templateUrl: './yap.component.html',
  styleUrl: './yap.component.css'
})
export class YapComponent {
  @ViewChild('commentTextArea') textareaInput!: ElementRef;

  constructor(private router: Router, private yapService: YapService, public activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef) {}

  public yap: Yap = {username: "", message: ""};
  public yapComments: Comment[] | undefined;
  public showReplyTextArea: boolean = false;
  public loading: boolean = false;
  public down: boolean = false;
  // public yapLiked: boolean = false;

  ngOnInit() {
    this.activatedRoute.params.subscribe(s => {
      this.loading = true;
      this.yapService.getYap(s["id"], localStorage.getItem("username")).subscribe((yapResponse: Yap) => {
        this.yap = yapResponse;
        this.loading = false;
      }, () => {
        this.loading = false;
        this.down = true;
      })
    });

  }

  likeComment(comment: Comment) {
    let cmn = this.yap.comments!.filter(cmt => cmt.message==comment.message && cmt.username==cmt.username)[0];
    cmn.liked = !cmn.liked;
    if(cmn.liked) cmn.likes!++;
    else if(!cmn.liked) cmn.likes!--;
  }

  addNewComment(comment: Comment) {
    comment.new = true;
    this.yap.comments?.push(comment)
  }

  public get getUsername(): string | null {
    return localStorage.getItem("username")
  }

  onClickReply(): void {
    this.showReplyTextArea = !this.showReplyTextArea;
  }

  onClickDeleteYap(): void {
    this.loading = true;
    this.yapService.deleteYap(this.yap).subscribe(() => {
      this.loading = false;
      this.router.navigate(["/"]);
    }, () => {
      this.loading = false;
    });
  }

  onClickHeartYap(): void {
    this.yapService.likeYap(this.yap.id, localStorage.getItem("username")).subscribe(() => {
      this.yap.liked = !this.yap.liked;
      if(!this.yap.liked) this.yap.likes!--;
      else if(this.yap.liked) this.yap.likes!++;
    }, () => {

    })
  }

  removeItemOnce(arr: Comment[] | undefined, value: Comment) {
    var index = arr!.indexOf(arr!.filter(x => x.id=value.id)[0]);
    if (index > -1) {
      arr!.splice(index, 1);
    }
    return arr;
  }

  onClickCommentSend(): void {
    this.loading = true;
    let text = this.textareaInput.nativeElement.value;
    this.yapService.postComment(localStorage.getItem("username"), text, this.yap).subscribe((commentId: string) => {
      this.loading = false;
      this.yap.comments?.unshift({username: localStorage.getItem("username") || "", message: text, likes: 0, new: true, id: commentId})
      this.showReplyTextArea = !this.showReplyTextArea;
    }, () => this.loading=false)
  }

  deleteComment(event: Comment) {
    this.yapService.deleteComment(this.yap, event.id).subscribe(() => {
      this.yap.comments!.filter(cmt => cmt.message==event.message && cmt.username==event.username)[0].deleted = true
      this.yap.comments!.filter(cmt => cmt.message==event.message && cmt.username==event.username)[0].message = "[deleted]"
    })
  }

}
