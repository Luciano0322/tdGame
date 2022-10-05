import { c } from "../main";
import { waypoints } from "./waypoints";

// 建立塔的地
export class PlacementTile {
  constructor({position = {x: 0, y: 0}}) {
    this.position = position;
    // 記住我們尋找素材時候所選的參數，如果你選擇為 32*32 那這裡你就要改成 32
    this.size = 64;
    this.color = 'rgba(255, 255, 255, 0.15)';
    // 避免重複占格的bug
    this.occupied = false
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  update(mouse) {
    this.draw();

    if (
      mouse.x > this.position.x && 
      mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.size
    ) {
      console.log('colliding');
      this.color = 'white';
    } else {
      this.color = 'rgba(255, 255, 255, 0.15)';
    }
  }
}

// 怪物物件
export class Enemy {
  constructor({ position = { x: 0, y: 0 }}) {
    this.position = position;
    this.width = 100;
    this.height = 100;
    this.waypointIndex = 0;
    // 調整路線的偏移
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    }
  }

  // 和原本draw orc 相同
  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    const wp = waypoints[this.waypointIndex];
    const yDistance = wp.y - this.center.y;
    const xDistance = wp.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);
    this.position.x += Math.cos(angle);
    this.position.y += Math.sin(angle);
    // 位移修正
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    }
    // console.log(Math.round(this.position.x))

    // 判斷抵達點位
    if (
      Math.round(this.center.x) === Math.round(wp.x) && 
      Math.round(this.center.y) === Math.round(wp.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++
    }
  }
}

// 塔本身
export class Building {
  constructor({ position = {x: 0, y: 0} }) {
    this.position = position;
    this.width = 64 * 2;
    this.height = 64;
  }

  draw() {
    c.fillStyle = 'blue';
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
