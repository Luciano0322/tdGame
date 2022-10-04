import './style.css'

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
  c.drawImage(bg, 0, 0);
}
bg.src = 'assets/gameMap.png';