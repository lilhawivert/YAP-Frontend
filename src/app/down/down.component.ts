import { Component } from '@angular/core';
import {GeneralService} from "../general.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-down',
  templateUrl: './down.component.html',
  styleUrl: './down.component.css'
})
export class DownComponent {

  constructor(private generalService: GeneralService, private router: Router) {
    generalService.getHealth().subscribe((r: string) =>{
      if(r==="OK")router.navigate(["/"]);
    });
  }

}
