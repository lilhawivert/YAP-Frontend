import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Yap, YapService } from '../yap.service';

@Component({
  selector: 'app-yap',
  templateUrl: './yap.component.html',
  styleUrl: './yap.component.css'
})
export class YapComponent {
  @ViewChild('commentTextArea') textareaInput!: ElementRef;

  constructor(private router: Router, private yapService: YapService, public activatedRoute: ActivatedRoute) {}

  public yap: Yap = {username: "", message: ""};
  public yapComments: Comment[] | undefined;
  public showReplyTextArea: boolean = false;
  public loading: boolean = false;

  ngOnInit() {
    this.activatedRoute.params.subscribe(s => {
      this.loading = true;
      this.yapService.getYap(s["id"]).subscribe((yapResponse: Yap) => {
        this.yap = yapResponse;
        this.loading = false;
      }, () => {
        this.loading = false;
        // this.router.navigate(["/down"])
      })
    });
      
  }

  onClickReply(): void {
    this.showReplyTextArea = !this.showReplyTextArea;
  }

  onClickCommentSend(): void {
    this.yapService.postComment(localStorage.getItem("username"), this.textareaInput.nativeElement.value, this.yap);
    this.yap.comments?.unshift({username: localStorage.getItem("username") || "", message: this.textareaInput.nativeElement.value, likes: 0, new: true})
    this.showReplyTextArea = !this.showReplyTextArea;
  }

}
