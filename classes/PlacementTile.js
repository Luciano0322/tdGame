import { c } from "../main";

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