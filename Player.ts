import * as THREE from "three";
import { Input } from "../controls/Input";
import { MobileControls } from "../controls/MobileControls";

export class Player {
  readonly position = new THREE.Vector3(0, 0, 5);
  private readonly visual = new THREE.Group();
  private yaw = 0;
  private pitch = -0.12;
  private readonly cameraOffset = new THREE.Vector3(0, 2.25, 5.5);

  constructor(private readonly scene: THREE.Scene, private readonly camera: THREE.PerspectiveCamera) {}

  initialize(): void {
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x252b2d, roughness: 0.92 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.95, 5, 10), bodyMaterial);
    body.position.y = 1.05;
    body.castShadow = true;
    this.visual.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.27, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x927d6b, roughness: 0.9 })
    );
    head.position.y = 1.83;
    head.castShadow = true;
    this.visual.add(head);

    this.visual.position.copy(this.position);
    this.scene.add(this.visual);
    this.updateCamera();
  }

  update(delta: number, input: Input, mobile: MobileControls): void {
    const look = input.consumeLook();
    this.yaw -= look.x * 0.0025;
    this.pitch = THREE.MathUtils.clamp(this.pitch - look.y * 0.0018, -0.55, 0.35);

    const moveX = input.movementX + mobile.x;
    const moveZ = input.movementZ + mobile.y;
    const direction = new THREE.Vector3(moveX, 0, moveZ);
    if (direction.lengthSq() > 1) direction.normalize();

    const speed = (input.running || mobile.running) ? 6.2 : 3.5;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const movement = forward.multiplyScalar(-direction.z).add(right.multiplyScalar(direction.x));

    this.position.addScaledVector(movement, speed * delta);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -42, 42);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -42, 42);
    if (movement.lengthSq() > 0.001) this.visual.rotation.y = Math.atan2(movement.x, movement.z);
    this.visual.position.copy(this.position);
    this.updateCamera();
  }

  private updateCamera(): void {
    const offset = this.cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    this.camera.position.copy(this.position).add(offset);
    this.camera.position.y += this.pitch * 2;
    this.camera.lookAt(this.position.x, this.position.y + 1.35, this.position.z);
  }
}