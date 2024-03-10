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
      this.yapService.getYaps(localStorage.getItem("username")).subscribe((val: Yap[]) => {
        this.yapService.usersOfYaps = [];
        console.log(val);
        if(val.length > 0) {
          this.yapService.loadedYaps = val;
          this.userService.getUsersOfYaps(this.yapService.loadedYaps).subscribe((u: User[]) => {
            this.yapService.usersOfYaps = u;
            this.loading = false;
            console.log(u);
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

  getMaxYaps() {
    return Math.min(10, this.yapService.loadedYaps.length);
  }

  splitTrendsYap(message: string): string[] {
    const regex = /(?=[ @#]|<br>)/;
    return message.replace(/\n/g, '<br>').split(regex);
  }

  navigateToTrend(trend: string){
    this.router.navigate([`trend/${trend}`]);
  }



  // addImage(): void {
  //   this.fileInput.nativeElement.click();
  // }

  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  //   console.log('Selected file:', this.selectedFile);
  // }





}
