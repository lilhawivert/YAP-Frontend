import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Yap, YapService } from '../yap.service';

@Component({
  selector: 'app-yap',
  templateUrl: './yap.component.html',
  styleUrl: './yap.component.css'
})
export class YapComponent {

  constructor(private yapService: YapService, public activatedRoute: ActivatedRoute) {}

  public yap: Yap = {username: "", message: ""};

  ngOnInit() {
    this.activatedRoute.params.subscribe(s => {
      this.yapService.getYap(s["id"]).subscribe((yapResponse: Yap) => {
        this.yap = yapResponse;
      })
    });
      
  }

}
