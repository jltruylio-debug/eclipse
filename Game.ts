import * as THREE from "three";
import { World } from "../world/World";
import { Player } from "../player/Player";
import { Input } from "../controls/Input";
import { MobileControls } from "../controls/MobileControls";

export class Game {
  readonly isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  started = false;
  paused = false;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(68, 1, 0.1, 500);
  private readonly clock = new THREE.Clock();
  private readonly input = new Input();
  private readonly mobile = new MobileControls();
  private readonly world = new World(this.scene);
  private readonly player = new Player(this.scene, this.camera);
  private animationFrame = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.isTouchDevice,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isTouchDevice ? 1.5 : 2));
    this.renderer.shadowMap.enabled = !this.isTouchDevice;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.scene.background = new THREE.Color(0x080d12);
    this.scene.fog = new THREE.FogExp2(0x101820, 0.018);
    this.resize();
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.started) this.pause();
    });
  }

  initialize(): void {
    this.world.build();
    this.player.initialize();
    this.renderer.render(this.scene, this.camera);
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    this.paused = false;
    this.clock.start();
    this.canvas.requestPointerLock?.();
    this.animate();
  }

  pause(): void {
    this.paused = true;
    document.exitPointerLock?.();
  }

  resume(): void {
    this.paused = false;
    this.clock.getDelta();
    if (!this.isTouchDevice) this.canvas.requestPointerLock?.();
  }

  private animate = (): void => {
    this.animationFrame = requestAnimationFrame(this.animate);
    if (this.paused) return;
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.world.update(delta);
    this.player.update(delta, this.input, this.mobile);
    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }
}