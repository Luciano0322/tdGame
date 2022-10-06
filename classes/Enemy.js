import { c } from "../main";
import { Sprite } from "./Sprite";
import { waypoints } from "./waypoints";

// 怪物物件
export class Enemy extends Sprite {
  constructor({ position = { x: 0, y: 0 } }) {
    super({ 
      position, 
      imageSrc: 'imgs/orc.png',
      frames: {
        max: 7
      } 
    })
    // this.position = position;
    this.width = 100;
    this.height = 100;
    this.waypointIndex = 0;
    // 調整路線的偏移
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    }
    this.radius = 50;
    // 血條
    this.health = 100;
    // 行徑速度
    this.velocity = {
      x: 0,
      y: 0
    }
  }

  // 和原本draw orc 相同
  draw() {
    super.draw()
    // c.fillStyle = 'red';
    // // 方形
    // // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    // // 圓型
    // c.beginPath();
    // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    // c.fill();

    // 血條
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y - 15, this.width, 10);
    c.fillStyle = 'green';
    c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / 100, 10);
  }

  update() {
    this.draw();
    super.update();

    const wp = waypoints[this.waypointIndex];
    const yDistance = wp.y - this.center.y;
    const xDistance = wp.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    // 設定速度
    const speed = 3

    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // 位移修正
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    }
    // console.log(Math.round(this.position.x))

    // 判斷抵達點位
    if (
      Math.abs(Math.round(this.center.x) - Math.round(wp.x)) < Math.abs(this.velocity.x) && 
      Math.abs(Math.round(this.center.y) - Math.round(wp.y)) < Math.abs(this.velocity.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++
    }
  }
}
