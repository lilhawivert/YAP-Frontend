import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { GeneralService } from "../general.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-down',
  templateUrl: './down.component.html',
  styleUrls: ['./down.component.css']
})


export class DownComponent implements OnInit {

  started: boolean = false;
  ended: boolean = false;


  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  cw!: number;

  radius: number = 20;
  x: number = 0;
  y: number = 0;
  xSpeed: number = 0;
  ySpeed: number = 0;
  maxSpeed: number = 4;
  acceleration: number = 0.1;
  deceleration: number = 0.03;
  bounciness: number = 1;

  shootCoolDownTime: number = 3;
  currentShootWaitTime: number = 0;
  shouterLength: number = 30;
  shoutingSpeed: number = 7;

  enemySpawnRate: number = 500;
  currentEnemySpawnWaitTime: number = 0;

  mouseDown: boolean = false;
  ups: boolean = false
  downs: boolean = false
  rights: boolean = false
  lefts: boolean = false
  mouseX: number = 0;
  mouseY: number = 0;

  allProjectiles: Projectile[] = [];
  allEnemies: Enemy[] = [];

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.cw = this.canvas.width;
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;

    this.generalService.getHealth().subscribe((r: string): void => {
      //if (r === "OK") this.router.navigate(["/"]);
    });
    this.drawAll();

  }

  start(): void {
    if(this.started)return;
    this.started = true;
    this.playShootingSound();



    const mainLoop = ():void => {
      this.drawAll();
      this.calcNewSpeed();
      this.checkPlayerOutside();
      this.calcNewPos();
      this.shoot();
      this.calcNewProjectilePos();
      this.spawnEnemies();
      this.updateEnemies();
      this.checkShootCollisions();

      requestAnimationFrame(mainLoop);
    }
    mainLoop();
  }

  drawAll():void{
    this.ctx.clearRect(0, 0, this.cw, this.cw);
    this.drawCircle(this.cw/2, this.cw/2, this.cw/2, "black")

    this.drawCircle(this.x, this.y, this.radius, "blue")

    let a = this.normalizeVector(this.mouseX-this.x,this.mouseY-this.y,this.shouterLength);
    this.drawLine(this.x, this.y, this.x+a.x, this.y+a.y, "white",5)

    for (let i = 0; i < this.allProjectiles.length; i++) {
      this.drawCircle(this.allProjectiles[i].xPos, this.allProjectiles[i].yPos, this.allProjectiles[i].radius, "white")
    }

    for (let i = 0; i < this.allEnemies.length; i++) {
      let e: Enemy = this.allEnemies[i];
      this.drawCircle(e.xPos, e.yPos, e.radius, "red")
    }


    //this.drawSquareAroundCircle(this.cw/2,this.cw/2,this.cw/2)
  }

  drawCircle(x: number, y:number, rad:number, col: string):void{
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad, 0, Math.PI * 2, false);
    this.ctx.fillStyle = col;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawLine(x1: number, y1:number, x2:number, y2:number, col: string, width: number){
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = col;
    this.ctx.lineWidth = width;
    this.ctx.stroke();
  }

   drawSquareAroundCircle(x: number, y: number, radius: number) {
    const sideLength = radius * Math.sqrt(2);

    const startX = x - sideLength / 2;
    const startY = y - sideLength / 2;

    this.ctx.beginPath();
    this.ctx.rect(startX, startY, sideLength, sideLength);
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
  }


  normalizeVector(x: number, y: number, length: number): { x: number, y: number } {
    const currentLength = Math.sqrt(x * x + y * y);
    if (currentLength !== 0) {
      const normalizedX = (x / currentLength) * length;
      const normalizedY = (y / currentLength) * length;
      return { x: normalizedX, y: normalizedY };
    } else {
      return { x: 0, y: 0 };
    }
  }

  calcNewSpeed(): void{
    if(this.rights){
      this.xSpeed = Math.min(this.xSpeed + this.acceleration, this.maxSpeed);
    }
    if(this.lefts){
      this.xSpeed = Math.max(this.xSpeed - this.acceleration, -this.maxSpeed);
    }
    if(this.downs){
      this.ySpeed = Math.min(this.ySpeed + this.acceleration, this.maxSpeed);
    }
    if(this.ups){
      this.ySpeed = Math.max(this.ySpeed - this.acceleration, -this.maxSpeed);
    }

    if(!this.rights && !this.lefts){
      if(Math.abs(this.xSpeed)<=this.acceleration)this.xSpeed=0;
      else if(this.xSpeed>0) this.xSpeed -= this.deceleration;
      else if(this.xSpeed<0) this.xSpeed += this.deceleration;
    }

    if(!this.ups && !this.downs){
      if(Math.abs(this.ySpeed)<=this.acceleration)this.ySpeed=0;
      else if(this.ySpeed>0) this.ySpeed -= this.deceleration;
      else if(this.ySpeed<0) this.ySpeed += this.deceleration;
    }

    //console.log("xSpeed: "+this.xSpeed);
    //console.log("ySpeed: "+this.ySpeed);
    //console.log("x: "+this.x);
    //console.log("y: "+this.y);
  }

  checkPlayerOutside(): void{
    if(Math.pow(this.cw/2-this.x,2)+Math.pow(this.cw/2-this.y,2)>=Math.pow(this.cw/2-this.radius,2)){

      let vx = this.x-this.cw/2;
      let vy = this.y-this.cw/2;


      const dotProduct = vx * this.xSpeed + vy * this.ySpeed;

      const reflectedX = this.xSpeed - 2 * dotProduct * vx;
      const reflectedY = this.ySpeed - 2 * dotProduct * vy;

      const length = Math.sqrt(reflectedX * reflectedX + reflectedY * reflectedY);
      const normalizedX = reflectedX / length;
      const normalizedY = reflectedY / length;


      const lengthOfInputVector = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed)*this.bounciness;
      let reflectedLengthX = normalizedX * lengthOfInputVector;
      let reflectedLengthY = normalizedY * lengthOfInputVector;

      //TOTO add pos
      this.xSpeed = reflectedLengthX;
      this.ySpeed = reflectedLengthY;

    }
  }

  calcNewPos(): void{
    this.x += this.xSpeed/(Math.abs(this.ySpeed)*(0.41/this.maxSpeed)+1);
    this.y += this.ySpeed/(Math.abs(this.xSpeed)*(0.41/this.maxSpeed)+1);
  }

  shoot(): void{
    if(this.currentShootWaitTime > 0){
      this.currentShootWaitTime--;
      return;
    }
    if(!this.mouseDown){
      return;
    }

    this.currentShootWaitTime = this.shootCoolDownTime;
    let a = this.normalizeVector(this.mouseX-this.x,this.mouseY-this.y,this.shoutingSpeed);
    let b = this.normalizeVector(this.mouseX-this.x,this.mouseY-this.y,this.shouterLength);
    this.allProjectiles.push(new Projectile(this.x+b.x,this.y+b.y,a.x,a.y));

  }

  calcNewProjectilePos(): void{
    for (let i = 0; i < this.allProjectiles.length; i++) {
      let p: Projectile = this.allProjectiles[i];
      p.xPos+=p.xSpeed;
      p.yPos+=p.ySpeed;

      if(Math.pow(this.cw/2-p.xPos,2)+Math.pow(this.cw/2-p.yPos,2)>=Math.pow(this.cw/2+p.radius,2)){
        this.allProjectiles.splice(i,1);
      }
    }
  }

  spawnEnemies(): void{
    if(this.currentEnemySpawnWaitTime > 0){
      this.currentEnemySpawnWaitTime--;
      return;
    }
    this.currentEnemySpawnWaitTime = this.enemySpawnRate;

    let rad: number = Math.random()*20+5;
    let speed: number = (Math.random()*10+1)/rad;
    let hp: number = (Math.random()+1)*rad;

    let x: number, y: number;
    do {
      x = Math.random() * 1.5 * this.cw - 0.25 * this.cw;
      y = Math.random() * 1.5 * this.cw - 0.25 * this.cw;
    } while (Math.pow(x,2) + Math.pow(y,2) <= Math.pow(this.cw/2+rad,2));
    console.log(x+" "+y)


    this.allEnemies.push(new Enemy(x,y,0,0,speed,rad,hp));

  }

  updateEnemies(): void{
    for (let i = 0; i < this.allEnemies.length; i++) {
      let e: Enemy = this.allEnemies[i];
      if(e.remainingHitPoints <= 0){
        this.allEnemies.splice(i,1);
        return;
      }

      let xv:number = this.x - e.xPos;
      let yv:number = this.y - e.yPos;
      let a = this.normalizeVector(xv, yv, e.Speed);

      e.xVec = a.x;
      e.yVec = a.y;

      e.xPos += e.xVec;
      e.yPos += e.yVec;

    }
  }

  checkShootCollisions(){
    this.allEnemies.forEach((e) => {
      for (let i = 0; i < this.allProjectiles.length; i++) {
        let p = this.allProjectiles[i];
        if(Math.pow(e.xPos-p.xPos,2) + Math.pow(e.yPos-p.yPos,2) <= Math.pow(e.radius + p.radius,2)){
          e.remainingHitPoints--;
          this.allProjectiles.splice(i,1);
        }
      }
    });
  }





  async playShootingSound(){
    const audio = new Audio();
    audio.src = "../../assets/shooting3.wav"
    audio.volume = 0.2;

    const play = ():void => {
      if (this.ended) return;

      if(this.mouseDown && audio.paused) {
        audio.play();
        console.log("sound")
      } else if(!this.mouseDown){
        audio.pause();
        audio.currentTime = 0;
        console.log("no sound")
      }

      setTimeout(play, 10);
    }
    play();

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    let k :string = event.key;
    if(k==='a')this.lefts=true;
    if(k==='d')this.rights=true;
    if(k==='s')this.downs=true;
    if(k==='w')this.ups=true;
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    let k :string = event.key;
    if(k==='a')this.lefts=false;
    if(k==='d')this.rights=false;
    if(k==='s')this.downs=false;
    if(k==='w')this.ups=false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    this.mouseY = event.clientY - this.canvas.getBoundingClientRect().top;
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

}

class Projectile{
  xPos: number;
  yPos: number;
  xSpeed: number;
  ySpeed: number;
  radius: number = 3;

  constructor(xPos: number, yPos: number, xSpeed: number, ySpeed: number) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }

}

class Enemy{
  xPos: number;
  yPos: number;
  xVec: number;
  yVec: number;
  Speed: number;
  radius: number;
  hitPoints: number;
  remainingHitPoints: number;

  constructor(xPos: number, yPos: number, xVec: number, yVec: number, Speed: number, radius: number, hitPoints: number) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVec = xVec;
    this.yVec = yVec;
    this.Speed = Speed;
    this.radius = radius;
    this.hitPoints = hitPoints;
    this.remainingHitPoints = hitPoints;
  }
}
