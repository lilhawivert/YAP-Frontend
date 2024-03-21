import {ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Yap, YapService} from "../yap.service";
import {User, UserService} from "../user.service";
import {BgColors} from "../bgColors";

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrl: './trend.component.css'
})
export class TrendComponent {

  constructor(private bgColors: BgColors, private elementRef: ElementRef, private router: Router, private userService: UserService, public yapService: YapService, public activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef) {}

  loading: boolean = true;
  down: boolean = false;
  trendName: string = "";

  ngOnInit() {
    const bgCol = localStorage.getItem('bgColorValue');
    if(bgCol){
      this.bgColors.setBgColorToCss(Number(bgCol), this.elementRef);
    }
    this.activatedRoute.params.subscribe(s => {
      this.trendName = s["t"];
      this.loading = true;
      this.yapService.getYapsOfTrend(s["t"]).subscribe((yapResponse: Yap[]) => {
        this.yapService.loadedYaps = yapResponse;

        this.userService.getUsersOfYaps(this.yapService.loadedYaps).subscribe((u: User[]) => {
          this.yapService.usersOfYaps = u;
          this.loading = false;
          console.log(u);
          console.log(yapResponse);
        });
      }, () => {
        this.loading = false;
        this.down = true;
      })
    });
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


}
