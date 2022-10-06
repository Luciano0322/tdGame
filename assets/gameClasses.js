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
    c.fillStyle = 'red';
    // 方形
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    // 圓型
    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fill();

    // 血條
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y - 15, this.width, 10);
    c.fillStyle = 'green';
    c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / 100, 10);
  }

  update() {
    this.draw();

    const wp = waypoints[this.waypointIndex];
    const yDistance = wp.y - this.center.y;
    const xDistance = wp.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    // 設定速度
    const speed = 10

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

// 射程範圍
export class Projectile {
  constructor({position = {x: 0, y: 0}, enemy}) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy
    this.radius = 10
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'orange';
    c.fill();
  }

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

// 塔本身
export class Building {
  constructor({ position = {x: 0, y: 0} }) {
    this.position = position;
    this.width = 64 * 2;
    this.height = 64;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height /2
    };
    this.projectiles = [
      
    ];
    // 塔攻擊範圍
    this.radius = 250;
    // 塔攻擊對象
    this.target
    this.frames = 0;
  }

  draw() {
    c.fillStyle = 'blue';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'rgba(0, 0, 255, 0.2)'
    c.fill();
  }

  update() {
    this.draw()
    if (this.frames % 100 === 0 && this.target) {
      this.projectiles.push(
          new Projectile({
          position: {
            x: this.center.x,
            y: this.center.y,
          },
          enemy: this.target
        })
      )
    }
    this.frames++
  }
}
