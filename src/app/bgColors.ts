import {ElementRef, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class BgColors {

  constructor() {

  }

  setBgColorToCss(val: number, elementRef: ElementRef): void {
    const root = elementRef.nativeElement.ownerDocument.documentElement;
    const newColor: number = Math.round((255 / 100) * val);
    root.style.setProperty('--value', val);

    if(val<50){
      root.style.setProperty('--invertion', `0`);
      root.style.setProperty('--main-color', `rgb(${255 - newColor}, ${255 - newColor}, ${255 - newColor})`);
    }else{
      root.style.setProperty('--invertion', `1`);
      root.style.setProperty('--main-color', `rgb(${newColor}, ${newColor}, ${newColor})`);
    }

  }

}
