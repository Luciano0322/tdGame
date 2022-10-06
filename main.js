import './style.css'
import { placementTilesData, waypoints } from './assets/waypoints'
import { Building, Enemy, PlacementTile } from './assets/gameClasses';

const app = document.getElementById('app');
app.style.position = 'relative';
app.style.display = 'inline-block';
const gameOverTxt = document.createElement("div");
gameOverTxt.appendChild(document.createTextNode("GAME OVER"));
gameOverTxt.id = 'gameOverTxt';
gameOverTxt.style.position = 'absolute';
gameOverTxt.style.top = 0;
gameOverTxt.style.bottom = 0;
gameOverTxt.style.left = 0;
gameOverTxt.style.right = 0;
gameOverTxt.style.display = 'none';
gameOverTxt.style.justifyContent = 'center';
gameOverTxt.style.alignItems = 'center';
gameOverTxt.style.fontSize = '72px';
gameOverTxt.style.fontWeight = 'bold';
gameOverTxt.style.color = 'white';
gameOverTxt.style.textShadow = '2px 2px 5px #888';

app.appendChild(gameOverTxt)

const canvas = document.querySelector('canvas');
export const c = canvas.getContext('2d');

canvas.width = 1280;
canvas.height = 768;
c.fillStyle = 'white';
// fillRect 有四個參數對應為 x 軸與 y 軸，寬與高
c.fillRect(0, 0, canvas.width, canvas.height);

// 設定可以設置塔的格子，將其陣列資料按照地圖邊界的20格作切分
const placementTilesData2D = [];
for (let i = 0; i< placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20))
} 

// 這裡與處理怪物的方法相似
const placementTiles = [];
// now placementTilesData2D shold like this [[0, 14, ...],[0, 0, ...], ....]
placementTilesData2D.forEach((row, yIdx) => {
  // 這裡的 index 用來計算為 y 的格數
  row.forEach((symbol, xIdx) => {
    // 這裡的 index 為內層的 array，可以用來計算 x 的格數
    if (symbol === 14) {
      // 加入建塔的格子
      placementTiles.push(
        new PlacementTile({
          position: {
            x: xIdx * 64,
            y: yIdx * 64,
          }
        })
      )
    }
  })
})

// console.log(placementTiles);
// 不能以以下方式引入
// c.drawImage('assets/gameMap.png', 0, 0 )
// 需改由 js 生成 image 如以下：
const bg = new Image();
bg.onload = () => {
  animate();
}
bg.src = 'assets/gameMap.png';

// 固定式寫法
// const enemy = new Enemy({ position: { x: waypoints[0].x, y: waypoints[0].y }});
// const enemy2 = new Enemy({ position: { x: waypoints[0].x - 150, y: waypoints[0].y }});

// 一波攻擊的概念
const enemies = [];

function spawnEnemies(spawnCount) {
  for (let i = 1; i < spawnCount + 1; i++) {
    // 間距
    const xOffset = i * 150
    enemies.push(new Enemy({
      position: {
        x: waypoints[0].x - xOffset,
        y: waypoints[0].y
      }
    }))
  }
}

const buildings = [];
let activeTile = undefined;
let enemyCount = 3;
let hearts = 10;
spawnEnemies(enemyCount);
// make a infinite loop
function animate() {
  const animationId = requestAnimationFrame(animate);
  c.drawImage(bg, 0, 0);
  // enemies.forEach((enemy) => {
  //   enemy.update()
  // });
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update()

    if (enemy.position.x > canvas.width) {
      hearts -= 1;
      enemies.splice(i, 1);
      console.log(hearts);

      if (hearts === 0) {
        console.log('game over');
        cancelAnimationFrame(animationId)
        document.querySelector('#gameOverTxt').style.display = 'flex';
      }
    }
  }

  // 追蹤總怪物的數量
  if (enemies.length === 0) {
    enemyCount += 2
    spawnEnemies(enemyCount)
  }

  placementTiles.map((tile) => {
    tile.update(mouse)
  })

  buildings.map((building) => {
    building.update();
    building.target = null;
    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x
      const yDifference = enemy.center.y - building.center.y
      const distance = Math.hypot(xDifference, yDifference)
      return distance < enemy.radius + building.radius
    })
    building.target = validEnemies[0]
    // console.log(validEnemies);

    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];
      projectile.update(enemies)
  
      const xDifference = projectile.enemy.center.x - projectile.position.x
      const yDifference = projectile.enemy.center.y - projectile.position.y
      const distance = Math.hypot(xDifference, yDifference)
      // 計算是否碰撞到物件
      if (distance < projectile.enemy.radius + projectile.radius) {
        // 怪物血條與消失
        projectile.enemy.health -= 20;
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy
          })
          if (enemyIndex > -1) enemies.splice(enemyIndex, 1)
        }
        
        // console.log(projectile.enemy.health);
        building.projectiles.splice(i, 1)
      }
      // console.log(distance);
    }
  })
  // enemy.update();
  // enemy2.update();
  // orc
  // c.fillStyle = 'red';
  // c.fillRect(x, 400, 100, 100);
  // x++
};

// mousemove eventListener
const mouse = {
  x: undefined,
  y: undefined
};

canvas.addEventListener('click', (evt) => {
  if (activeTile && !activeTile.isOccupied) {
    buildings.push(new Building({
      position: {
        x: activeTile.position.x,
        y: activeTile.position.y,
      },
    }))
    activeTile.isOccupied = true;
  }
})

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY

  // 先reset
  activeTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i]
    if (
      mouse.x > tile.position.x && 
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile
      break;
    }
  }
})
