import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { YapService } from '../yap.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  @ViewChild('yapTextArea') textareaInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: any;
  public selectedFile: File | undefined;

  constructor(public userService: UserService, private router: Router, public yapService: YapService,) {}

  ngOnInit() { 
    if(!localStorage.getItem("username")) this.router.navigate(["/login"])
  }

  onClickYap() {
    this.yapService.yapAway({username: localStorage.getItem("username"), message: this.textareaInput.nativeElement.value}).subscribe((receivedId: string) => {
      this.yapService.loadedYaps.unshift({username: localStorage.getItem("username"), message: this.textareaInput.nativeElement.value, id: receivedId})
      this.textareaInput.nativeElement.value = "";
    }, () => {
      //on yap error
    });
  }

  addImage(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

}
