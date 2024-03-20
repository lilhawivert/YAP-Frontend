import { Component } from '@angular/core';
import {User, UserService} from '../../user.service';
import {Yap, YapService} from "../../yap.service";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent {

 trends: [string, number][] = [];
 maxTrends: number = 5;

  constructor(public yapService: YapService, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.yapService.getTrends().subscribe( (t: string[]) => {
      const stringCounts = new Map<string, number>();
      t.forEach(str => {
        if (stringCounts.has(str)) {
          stringCounts.set(str, stringCounts.get(str)! + 1);
        } else {
          stringCounts.set(str, 1);
        }
      });
      this.trends = Array.from(stringCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, this.maxTrends);
      // console.log("trending:");
      // console.log(this.trends);
    });
  }

  onClickSpecificTrend(i: number){
    this.router.navigate([`trend/${this.trends[i][0]}`]);
  }



}
