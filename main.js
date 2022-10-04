import './style.css'
import { waypoints } from './waypoints'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;
c.fillStyle = 'white';
// fillRect 有四個參數對應為 x 軸與 y 軸，寬與高
c.fillRect(0, 0, canvas.width, canvas.height);

// 不能以以下方式引入
// c.drawImage('assets/gameMap.png', 0, 0 )
// 需改由 js 生成 image 如以下：
const bg = new Image();
bg.onload = () => {
  animate();
}
bg.src = 'assets/gameMap.png';

// 怪物物件
class Enemy {
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

// 固定式寫法
// const enemy = new Enemy({ position: { x: waypoints[0].x, y: waypoints[0].y }});
// const enemy2 = new Enemy({ position: { x: waypoints[0].x - 150, y: waypoints[0].y }});

// 一波攻擊的概念
const enemies = [];
for (let i = 1; i < 10; i++) {
  // 間距
  const xOffset = i * 150
  enemies.push(new Enemy({
    position: {
      x: waypoints[0].x - xOffset,
      y: waypoints[0].y
    }
  }))
}
// let x = 200;
// make a infinite loop
function animate() {
  requestAnimationFrame(animate)
  c.drawImage(bg, 0, 0);
  enemies.forEach((enemy) => {
    enemy.update()
  });
  // enemy.update();
  // enemy2.update();
  // orc
  // c.fillStyle = 'red';
  // c.fillRect(x, 400, 100, 100);
  // x++
};


