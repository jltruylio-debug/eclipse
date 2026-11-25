import * as THREE from "three";

export class World {
  private readonly objects: THREE.Object3D[] = [];
  private time = 0;

  constructor(private readonly scene: THREE.Scene) {}

  build(): void {
    const hemisphere = new THREE.HemisphereLight(0x8298ad, 0x172019, 1.35);
    this.scene.add(hemisphere);

    const moon = new THREE.DirectionalLight(0xb7c9dc, 2.1);
    moon.position.set(-18, 28, 12);
    moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    moon.shadow.camera.left = -35;
    moon.shadow.camera.right = 35;
    moon.shadow.camera.top = 35;
    moon.shadow.camera.bottom = -35;
    this.scene.add(moon);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x202a22, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x30271e, roughness: 1 });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x17251e, roughness: 1 });
    for (let i = 0; i < 85; i++) {
      const x = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      if (Math.abs(x) < 5 && z > -4 && z < 14) continue;
      const height = 4 + Math.random() * 5;
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, height, 7), trunkMaterial);
      trunk.position.y = height / 2;
      trunk.castShadow = true;
      tree.add(trunk);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(1.8 + Math.random(), height * 0.55, 7), leafMaterial);
      crown.position.y = height * 0.88;
      crown.castShadow = true;
      tree.add(crown);
      tree.position.set(x, 0, z);
      this.scene.add(tree);
      this.objects.push(tree);
    }

    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x343a38, roughness: 1 });
    for (let i = 0; i < 24; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.8, 0), rockMaterial);
      rock.position.set((Math.random() - 0.5) * 80, 0.25, (Math.random() - 0.5) * 80);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      this.scene.add(rock);
    }

    const moonGlow = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 20, 16),
      new THREE.MeshBasicMaterial({ color: 0xd5e2ef })
    );
    moonGlow.position.set(-28, 34, -70);
    this.scene.add(moonGlow);
  }

  update(delta: number): void {
    this.time += delta;
  }
}