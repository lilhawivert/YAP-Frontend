import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { GeneralService } from "../general.service";
import { Router } from "@angular/router";
import {BgColors} from "../bgColors";

@Component({
  selector: 'app-down',
  templateUrl: './down.component.html',
  styleUrls: ['./down.component.css']
})


export class DownComponent implements OnInit {

  started: boolean = false;
  ended: boolean = false;
  newStart: boolean = false;
  online: boolean = false;


  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  cw!: number;

  radius: number = 20;
  x: number = 0;
  y: number = 0;
  xSpeed: number = 0;
  ySpeed: number = 0;
  maxSpeed: number = 2.5;
  acceleration: number = 0.07;
  deceleration: number = 0.03;
  lives: number = 3;
  score: number = 0;

  maxAmmunition = 100;
  ammunition: number =this.maxAmmunition;
  toLowAmmo: boolean = false;

  shootCoolDownTime: number = 3;
  currentShootWaitTime: number = 0;
  shouterLength: number = 30;
  shoutingSpeed: number = 7;

  ultiCooldown: number = 10000;
  currentUltiWaitTime = 0;

  enemySpawnRate: number = 200;
  currentEnemySpawnWaitTime: number = 0;

  breakingAudio: HTMLAudioElement;

  mouseDown: boolean = false;
  ups: boolean = false
  downs: boolean = false
  rights: boolean = false
  lefts: boolean = false
  mouseX: number = 0;
  mouseY: number = 0;

  allProjectiles: Projectile[] = [];
  allEnemies: Enemy[] = [];

  constructor(private bgColors: BgColors, private elementRef: ElementRef, private generalService: GeneralService, private router: Router) {}

  ngOnInit(): void {

    const bgCol = localStorage.getItem('bgColorValue');
    if(bgCol){
      this.bgColors.setBgColorToCss(Number(bgCol), this.elementRef);
    }

    this.statusChecker();
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.cw = this.canvas.width;
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;


    this.drawAll();

    this.breakingAudio = new Audio();
    this.breakingAudio.src = "../../assets/breaking.wav"
    this.breakingAudio.volume = 0.23;

  }

  async statusChecker(){
    this.generalService.getHealth().subscribe((r: string): void => {
      this.online = r === "OK";
    },(error: any) =>{
      this.online = false;
    });
    console.log(this.online)
    setTimeout(() => this.statusChecker(), 5000);
  }


  start(): void {
    if(this.started)return;
    if(this.newStart){
      this.newStart = false;
      return;
    }

    this.started = true;
    this.resetAllVariables();
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
      this.checkPlayerCollisions();
      this.reloadAmmoAndUlti();
      this.adjustSpawnRate();
      if(!this.ended)
        requestAnimationFrame(mainLoop);
    }
    mainLoop();
  }

  drawAll():void{
    this.ctx.clearRect(0, 0, this.cw, this.cw);
    this.drawCircle(this.cw/2, this.cw/2, this.cw/2, "white")
    this.drawCircle(this.cw/2, this.cw/2, this.cw/2-2, "black")

    for (let i = 0; i < this.lives; i++) {
      this.drawHeart(i*40 ,10,35);
    }

    this.drawText("score: "+this.score,450,30,"black",20);
    this.drawText("move: w,a,s,d",500,70,"black",10);
    this.drawText("shoot: leftClick",515,80,"black",10);
    this.drawText("ulti: rightClick",530,90,"black",10);

    for (let i = 0; i < 20; i++) {
      this.drawRectWithBorder(3,450 + i * 5, 20, 4, "black", 1 )
    }

    for (let i = 0; i < 20; i++) {
      if(this.ammunition >= (20-i)*(this.maxAmmunition/20)){
        this.drawRectWithBorder(4,451 + i * 5, 28, 2, "grey", 2 )
      }
    }

    this.drawRectWithBorder(560, 455, 38, 100, "black", 1)
    if(this.currentUltiWaitTime < this.ultiCooldown) {
      this.drawFilledRectangle(561, 456 + 98 - this.currentUltiWaitTime / this.ultiCooldown * 98, 36, this.currentUltiWaitTime / this.ultiCooldown * 98, "green");
    }else{
      this.drawFilledRectangle(561, 456, 36, 98, "lightgreen");

    }

    this.drawCircle(this.x, this.y, this.radius, "blue")

    let a = this.normalizeVector(this.mouseX-this.x,this.mouseY-this.y,this.shouterLength);
    this.drawLine(this.x, this.y, this.x+a.x, this.y+a.y, "white",5)

    for (let i = 0; i < this.allProjectiles.length; i++) {
      this.drawCircle(this.allProjectiles[i].xPos, this.allProjectiles[i].yPos, this.allProjectiles[i].radius, "white")
    }

    for (let i = 0; i < this.allEnemies.length; i++) {
      let e: Enemy = this.allEnemies[i];
      if(Math.pow(this.cw/2+e.radius,2)>=Math.pow(this.cw/2-e.xPos,2)+Math.pow(this.cw/2-e.yPos,2)) {
        this.drawCircle(e.xPos, e.yPos, e.radius, "red")
      }
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

  drawHeart(x: number, y: number, size: number, color: string = "red"): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + size / 4);
    this.ctx.quadraticCurveTo(x, y, x + size / 4, y);
    this.ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
    this.ctx.quadraticCurveTo(x + size / 2, y, x + size * 3 / 4, y);
    this.ctx.quadraticCurveTo(x + size, y, x + size, y + size / 4);
    this.ctx.quadraticCurveTo(x + size, y + size / 2, x + size * 3 / 4, y + size * 3 / 4);
    this.ctx.lineTo(x + size / 2, y + size);
    this.ctx.lineTo(x + size / 4, y + size * 3 / 4);
    this.ctx.quadraticCurveTo(x, y + size / 2, x, y + size / 4);
    this.ctx.fill();
  }

  drawText(text: string, x: number, y: number, color: string, fontSize: number): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillText(text, x, y);
  }

  drawRectWithBorder(x: number, y: number, width: number, height: number, borderColor: string, borderWidth: number): void {
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  drawFilledRectangle(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
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

  }

  checkPlayerOutside(): void{
    if(Math.pow(this.cw/2-this.x,2)+Math.pow(this.cw/2-this.y,2)>=Math.pow(this.cw/2-this.radius,2)){

      let xv = this.cw/2 - this.x;
      let yv = this.cw/2 - this.y;

      let k1,k2: number;
      if(this.y > 0.75*this.cw || this.y < 0.25 * this.cw) {
        k1 = ((this.cw / 2 - Math.sqrt(Math.pow(this.cw / 2 - this.radius, 2) - Math.pow(this.cw / 2 - this.x, 2))) - this.y) / yv;
        k2 = ((this.cw / 2 + Math.sqrt(Math.pow(this.cw / 2 - this.radius, 2) - Math.pow(this.cw / 2 - this.x, 2))) - this.y) / yv;
      }else{
        k1 = ((this.cw / 2 - Math.sqrt(Math.pow(this.cw / 2 - this.radius, 2) - Math.pow(this.cw / 2 - this.y, 2))) - this.x) / xv;
        k2 = ((this.cw / 2 + Math.sqrt(Math.pow(this.cw / 2 - this.radius, 2) - Math.pow(this.cw / 2 - this.y, 2))) - this.x) / xv;
      }

      let k = Math.min(k1,k2)

      this.x += k * xv;
      this.y += k * yv;


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
    if(!this.mouseDown || this.toLowAmmo){
      return;
    }

    this.ammunition--;

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
    let hp: number = (Math.random()+1)/3*rad;

    let x: number, y: number;
    do {
      x = Math.random() * 1.5 * this.cw - 0.25 * this.cw;
      y = Math.random() * 1.5 * this.cw - 0.25 * this.cw;
    } while (Math.pow(x-this.cw/2,2) + Math.pow(y-this.cw/2,2) <= Math.pow(this.cw/2+rad,2));

    this.allEnemies.push(new Enemy(x,y,0,0,speed,rad,hp));

  }

  updateEnemies(): void{
    for (let i = 0; i < this.allEnemies.length; i++) {
      let e: Enemy = this.allEnemies[i];
      if(e.remainingHitPoints <= 0){
        this.allEnemies.splice(i,1);
        this.score += Math.floor(e.hitPoints * e.Speed);
        this.breakingAudio.currentTime=0;
        this.breakingAudio.play();
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

  checkPlayerCollisions(){
    for (let i = 0; i < this.allEnemies.length; i++) {
      let e = this.allEnemies[i];
      if(Math.pow(e.xPos-this.x,2) + Math.pow(e.yPos-this.y,2) <= Math.pow(e.radius + this.radius,2)){
        this.lives--;
        this.allEnemies.splice(i,1);
        if(this.lives <= 0){
          this.gameOver();
        }
      }
    }
  }

  reloadAmmoAndUlti(){
    if(this.ammunition <= 0) {
      this.toLowAmmo = true;
    }
    if(this.ammunition >= this.maxAmmunition/10){
      this.toLowAmmo = false;
    }

    this.ammunition = Math.min(this.ammunition + 0.5 / this.shootCoolDownTime, this.maxAmmunition);

    this.currentUltiWaitTime = Math.min(this.currentUltiWaitTime + 1, this.ultiCooldown);

  }

  async fireUlti(){
    if(this.currentUltiWaitTime >= this.ultiCooldown){
      this.currentUltiWaitTime = 0;
      this.allEnemies.splice(0,this.allEnemies.length);
      this.drawCircle(this.cw/2,this.cw/2,this.cw/2,"green");
    }

  }


  gameOver(){
    this.newStart = true;
    this.started = false;
    this.ended = true;
  }


  resetAllVariables(){
    this.allProjectiles = [];
    this.allEnemies = [];
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.lives = 3;
    this.score= 0;
    this.ammunition= this.maxAmmunition;
    this.toLowAmmo = false;
    this.currentShootWaitTime = 0;
    this.currentUltiWaitTime = 0;
    this.currentEnemySpawnWaitTime = 0;

    this.ended = false;
    this.started = true;

  }





  async playShootingSound(){
    const audio = new Audio();
    audio.src = "../../assets/shooting3.wav"
    audio.volume = 0.2;

    const play = ():void => {
      if (this.ended) {
        audio.pause();
        return;
      }
      if(audio.currentTime >= 9.5){
        audio.currentTime=0;
      }
      if(this.mouseDown && audio.paused) {
        audio.play();
      } else if(!this.mouseDown || this.toLowAmmo){
        audio.pause();
        audio.currentTime = 0;
      }

      setTimeout(play, 10);
    }
    play();

  }

  adjustSpawnRate(){
    this.enemySpawnRate = Math.max(10,this.enemySpawnRate-0.001);
    console.log(this.enemySpawnRate);
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
    if (event.button === 0) {
      this.mouseDown = true;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.mouseDown = false;
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.fireUlti();
  }

  goToYap(){
    this.router.navigate(["/"])
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
