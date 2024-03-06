import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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


}
