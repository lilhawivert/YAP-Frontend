import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Yap, YapService} from '../../yap.service';
import {User, UserService} from '../../user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-yaps',
  templateUrl: './yaps.component.html',
  styleUrl: './yaps.component.css'
})
export class YapsComponent {

  @ViewChild('yapTextArea') textareaInput!: ElementRef;
  // @ViewChild('fileInput') fileInput!: any;
  // public selectedFile: File | undefined;
  public loading: boolean = false;
  public down: boolean = false;
  username: string | null;
  yapsPerRequest: number = 10;

  constructor(public yapService: YapService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.username = params.get('profile');
    });
    if(this.username) {
      this.userService.getYapsByUser(this.username).subscribe((yaps: Yap[]) => {
        this.loading = false;
        this.yapService.loadedYaps = yaps;
      }, () => {
        this.loading = false;
        this.down = true;
      })
    }

    else {
      this.loadYaps(this.yapsPerRequest);
    }
  }

  public get getUsername(): string | null {
    return localStorage.getItem("username");
  }

  onClickSpecificYap(index: number) {
    console.log(index);
    this.router.navigate([`yap/${this.yapService.loadedYaps[index].id}`]);
  }

  onClickProfile(username: string | null) {
    this.router.navigate([username]);
  }

  onClickYap() {
    this.yapService.yapAway({username: localStorage.getItem("username"), message: this.textareaInput.nativeElement.value}).subscribe((receivedId: string) => {
      this.yapService.loadedYaps.unshift({username: localStorage.getItem("username"), message: this.textareaInput.nativeElement.value, id: receivedId})
      this.textareaInput.nativeElement.value = "";
    }, () => {
      //on yap error
    });
  }

  splitTrendsYap(message: string): string[] {
    const regex = /(?=[ @#/;()?!]|<br>)/;
    message = message.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");
    console.log(message.replace(/\n/g, '<br>').split(regex))
    return message.replace(/\n/g, '<br>').split(regex);
  }

  navigateToTrend(trend: string){
    this.router.navigate([`trend/${trend}`]);
  }

  loadYaps(maxYaps: number){
    this.loading=true;
    this.yapService.getYaps(localStorage.getItem("username"),maxYaps).subscribe((val: Yap[]) => {
      console.log(val);
      if(val.length > 0) {
        this.yapService.loadedYaps = val;
        this.userService.getUsersOfYaps(this.yapService.loadedYaps).subscribe((u: User[]) => {
          this.yapService.usersOfYaps = u;
          console.log(u);
          this.loading = false;
        });
      }else {
        this.loading = false
      }

    }, () => {
      this.loading = false;
      this.down = true;
      this.router.navigate(["/down"])
    });
  }


  // addImage(): void {
  //   this.fileInput.nativeElement.click();
  // }

  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  //   console.log('Selected file:', this.selectedFile);
  // }





}
