import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private router: Router) {}

  onClickAccountSettings() {
    this.router.navigate([`accountSettings`]);
  }

  onClickSearchUser() {
    this.router.navigate([`userSearch`]);
  }

  onClickHome(){
    this.router.navigate([`/`]);
  }
  
  switchToDms() {
    this.router.navigate([`dms`]);
  }

  protected readonly provideAnimationsAsync = provideAnimationsAsync;
}
