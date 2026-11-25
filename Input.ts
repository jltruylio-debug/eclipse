export class Input {
  private readonly keys = new Set<string>();
  private pointerDeltaX = 0;
  private pointerDeltaY = 0;

  constructor() {
    window.addEventListener("keydown", (event) => this.keys.add(event.code));
    window.addEventListener("keyup", (event) => this.keys.delete(event.code));
    window.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement) {
        this.pointerDeltaX += event.movementX;
        this.pointerDeltaY += event.movementY;
      }
    });
  }

  get movementX(): number {
    return Number(this.keys.has("KeyD") || this.keys.has("ArrowRight")) -
      Number(this.keys.has("KeyA") || this.keys.has("ArrowLeft"));
  }

  get movementZ(): number {
    return Number(this.keys.has("KeyS") || this.keys.has("ArrowDown")) -
      Number(this.keys.has("KeyW") || this.keys.has("ArrowUp"));
  }

  get running(): boolean {
    return this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");
  }

  consumeLook(): { x: number; y: number } {
    const result = { x: this.pointerDeltaX, y: this.pointerDeltaY };
    this.pointerDeltaX = 0;
    this.pointerDeltaY = 0;
    return result;
  }
}