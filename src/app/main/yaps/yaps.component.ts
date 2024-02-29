import { Component, ElementRef, ViewChild } from '@angular/core';
import { Yap, YapService } from '../../yap.service';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-yaps',
  templateUrl: './yaps.component.html',
  styleUrl: './yaps.component.css'
})
export class YapsComponent {

  @ViewChild('yapTextArea') textareaInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: any;
  public selectedFile: File | undefined;
  public loading: boolean = false;
  constructor(public yapService: YapService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loading = true;
    this.yapService.getYaps().subscribe((val: Yap[]) => {
      this.loading = false;
      this.yapService.loadedYaps = val;
    }, () => {
      this.loading = false;
      this.router.navigate(["/down"])
    });
  }

  onClickSpecificYap(index: number) {
    this.router.navigate([`yap/${this.yapService.loadedYaps[index].id}`]);
  }

  onClickYap() {
    this.yapService.yapAway({username: ""+this.userService.username, message: this.textareaInput.nativeElement.value}).subscribe(() => {
      this.yapService.loadedYaps.unshift({username: ""+this.userService.username, message: this.textareaInput.nativeElement.value})
      this.textareaInput.nativeElement.value = "";
    }, () => {
      //on yap error
    });
  }

  getMaxYaps() {
    return Math.min(10, this.yapService.loadedYaps.length);
  }


  addImage(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

}
