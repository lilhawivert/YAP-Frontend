import { Component, ElementRef, ViewChild } from '@angular/core';
import { YapService } from '../../yap.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-yaps',
  templateUrl: './yaps.component.html',
  styleUrl: './yaps.component.css'
})
export class YapsComponent {

  @ViewChild('yapTextArea') textareaInput!: ElementRef;

  constructor(public yapService: YapService, private userService: UserService) {}

  onClickYap() {
    this.yapService.yapAway({username: ""+this.userService.username, message: this.textareaInput.nativeElement.value}).subscribe(() => {
      this.yapService.loadedYaps.unshift({username: ""+this.userService.username, message: this.textareaInput.nativeElement.value})
    }, () => {
      //on yap error
    });
  }

  getMaxYaps() {
    return Math.min(10, this.yapService.loadedYaps.length);
  }

}
