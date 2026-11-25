export class MobileControls {
  x = 0;
  y = 0;
  running = false;

  private activePointer: number | null = null;
  private readonly zone = document.querySelector<HTMLElement>("#joystick-zone");
  private readonly knob = document.querySelector<HTMLElement>("#joystick-knob");
  private readonly runButton = document.querySelector<HTMLButtonElement>("#run-button");

  constructor() {
    this.zone?.addEventListener("pointerdown", (event) => {
      this.activePointer = event.pointerId;
      this.zone?.setPointerCapture(event.pointerId);
      this.updateStick(event);
    });
    this.zone?.addEventListener("pointermove", (event) => {
      if (event.pointerId === this.activePointer) this.updateStick(event);
    });
    const release = (event: PointerEvent) => {
      if (event.pointerId !== this.activePointer) return;
      this.activePointer = null;
      this.x = 0;
      this.y = 0;
      if (this.knob) this.knob.style.transform = "translate(0px, 0px)";
    };
    this.zone?.addEventListener("pointerup", release);
    this.zone?.addEventListener("pointercancel", release);
    this.runButton?.addEventListener("pointerdown", () => this.running = true);
    this.runButton?.addEventListener("pointerup", () => this.running = false);
    this.runButton?.addEventListener("pointercancel", () => this.running = false);
    this.runButton?.addEventListener("pointerleave", () => this.running = false);
  }

  private updateStick(event: PointerEvent): void {
    if (!this.zone || !this.knob) return;
    const rect = this.zone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;
    const max = rect.width * 0.31;
    const length = Math.hypot(dx, dy);
    if (length > max) {
      dx = dx / length * max;
      dy = dy / length * max;
    }
    this.x = dx / max;
    this.y = dy / max;
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
  }
}