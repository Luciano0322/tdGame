import './style.css'
import { placementTilesData, waypoints } from './assets/waypoints'
import { Building, Enemy, PlacementTile } from './assets/gameClasses';

// app wrapper
const app = document.getElementById('app');
app.style.position = 'relative';
app.style.display = 'inline-block';
// game over text
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

const lifeTxt = document.createElement("div");
lifeTxt.style.position = 'absolute';
lifeTxt.style.top = '4px';
lifeTxt.style.right = '8px';
lifeTxt.style.padding = '4px';
lifeTxt.style.fontSize = '36px';
lifeTxt.style.fontWeight = 'bold';
lifeTxt.style.color = 'white';
lifeTxt.style.webkitTextStroke = '2px black';
lifeTxt.style.display = 'flex';
lifeTxt.style.alignItems = 'center';
lifeTxt.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
lifeTxt.innerHTML = `
  <div style="display: flex; align-items: center; margin-right: 16px;">
    <svg
      style="width: 25px; color: gold; margin-right: 4px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path
        d="M512 80C512 98.01 497.7 114.6 473.6 128C444.5 144.1 401.2 155.5 351.3 158.9C347.7 157.2 343.9 155.5 340.1 153.9C300.6 137.4 248.2 128 192 128C183.7 128 175.6 128.2 167.5 128.6L166.4 128C142.3 114.6 128 98.01 128 80C128 35.82 213.1 0 320 0C426 0 512 35.82 512 80V80zM160.7 161.1C170.9 160.4 181.3 160 192 160C254.2 160 309.4 172.3 344.5 191.4C369.3 204.9 384 221.7 384 240C384 243.1 383.3 247.9 381.9 251.7C377.3 264.9 364.1 277 346.9 287.3C346.9 287.3 346.9 287.3 346.9 287.3C346.8 287.3 346.6 287.4 346.5 287.5L346.5 287.5C346.2 287.7 345.9 287.8 345.6 288C310.6 307.4 254.8 320 192 320C132.4 320 79.06 308.7 43.84 290.9C41.97 289.9 40.15 288.1 38.39 288C14.28 274.6 0 258 0 240C0 205.2 53.43 175.5 128 164.6C138.5 163 149.4 161.8 160.7 161.1L160.7 161.1zM391.9 186.6C420.2 182.2 446.1 175.2 468.1 166.1C484.4 159.3 499.5 150.9 512 140.6V176C512 195.3 495.5 213.1 468.2 226.9C453.5 234.3 435.8 240.5 415.8 245.3C415.9 243.6 416 241.8 416 240C416 218.1 405.4 200.1 391.9 186.6V186.6zM384 336C384 354 369.7 370.6 345.6 384C343.8 384.1 342 385.9 340.2 386.9C304.9 404.7 251.6 416 192 416C129.2 416 73.42 403.4 38.39 384C14.28 370.6 .0003 354 .0003 336V300.6C12.45 310.9 27.62 319.3 43.93 326.1C83.44 342.6 135.8 352 192 352C248.2 352 300.6 342.6 340.1 326.1C347.9 322.9 355.4 319.2 362.5 315.2C368.6 311.8 374.3 308 379.7 304C381.2 302.9 382.6 301.7 384 300.6L384 336zM416 278.1C434.1 273.1 452.5 268.6 468.1 262.1C484.4 255.3 499.5 246.9 512 236.6V272C512 282.5 507 293 497.1 302.9C480.8 319.2 452.1 332.6 415.8 341.3C415.9 339.6 416 337.8 416 336V278.1zM192 448C248.2 448 300.6 438.6 340.1 422.1C356.4 415.3 371.5 406.9 384 396.6V432C384 476.2 298 512 192 512C85.96 512 .0003 476.2 .0003 432V396.6C12.45 406.9 27.62 415.3 43.93 422.1C83.44 438.6 135.8 448 192 448z"
      />
    </svg>
    <div id="coins">100</div>
  </div>
  <div style="display: flex; align-items: center;">
    <svg
      style="width: 36px; color: red; margin-right: 4px;"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clip-rule="evenodd"
      />
    </svg>
    <div id="hearts">10</div>
  </div>
`;

app.appendChild(gameOverTxt)
app.appendChild(lifeTxt)

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
bg.src = 'assets/imgs/gameMap.png';

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
let coins = 100;
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
      document.querySelector('#hearts').innerHTML = hearts;

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
          if (enemyIndex > -1) {
            enemies.splice(enemyIndex, 1)
            coins += 25;
            document.querySelector('#coins').innerHTML = coins;
          }
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
  if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
    coins -= 50;
    document.querySelector("#coins").innerHTML = coins;
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
