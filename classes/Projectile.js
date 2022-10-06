import { c } from "../main";
import { Sprite } from "./Sprite";

// 射程範圍
export class Projectile extends Sprite {
  constructor({position = {x: 0, y: 0}, enemy}) {
    super({ position, imageSrc: 'assets/imgs/projectile.png' })
    // 因為 extends 的關係，可以打回去原本的 Sprite 裏面
    // this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy;
    this.radius = 10;
    // 換圖檔 -> 轉移到 Sprite 裏面處理
    // this.image = new Image();
    // this.image.src = 'assets/imgs/projectile.png';
  }
  // 轉移到 Sprite 處理
  // draw() {
  //   c.drawImage(this.image, this.position.x, this.position.y);
  //   // c.beginPath();
  //   // c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  //   // c.fillStyle = 'orange';
  //   // c.fill();
  // }

  update() {
    this.draw();
    // 這裡處理塔所射出的攻擊，會去追蹤怪物的物件
    const angle = Math.atan2(
      this.enemy.center.y - this.position.y,
      this.enemy.center.x - this.position.x,
    );

    const power = 5
    this.velocity.x = Math.cos(angle) * power;
    this.velocity.y = Math.sin(angle) * power;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}