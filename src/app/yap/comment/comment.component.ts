import { Component, Input } from '@angular/core';
import { Comment } from '../../yap.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {


  @Input() public comment: Comment = {};

  constructor() {}

  public get getUsername(): string | null {
    return localStorage.getItem("username");
  }

}
