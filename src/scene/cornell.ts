import { vec3 } from '../math/vec3';
import { Sphere, Plane, HittableList } from './hittable';
import { BVHNode } from './bvh';
import { lambertian, metal, emissive } from './material';
import { Camera } from './camera';
import type { Hittable } from './hittable';

export interface Scene {
  world: Hittable;
  camera: Camera;
  background: [number, number, number];
}

/** Classic Cornell-box inspired scene with spheres + emissive ceiling light. */
export function createCornellScene(aspect: number): Scene {
  const red = lambertian(vec3(0.65, 0.05, 0.05));
  const green = lambertian(vec3(0.12, 0.45, 0.15));
  const white = lambertian(vec3(0.73, 0.73, 0.73));
  const light = emissive(vec3(15, 15, 15));
  const chrome = metal(vec3(0.95, 0.93, 0.88), 0.05);
  const gold = metal(vec3(0.83, 0.69, 0.22), 0.15);
  const blue = lambertian(vec3(0.2, 0.3, 0.8));

  const objects: Hittable[] = [
    // Walls (planes forming a box)
    new Plane(vec3(0, 0, 0), vec3(0, 1, 0), white, 6), // floor
    new Plane(vec3(0, 5.5, 0), vec3(0, -1, 0), white, 6), // ceiling
    new Plane(vec3(0, 0, -5.5), vec3(0, 0, 1), white, 6), // back
    new Plane(vec3(-2.75, 0, 0), vec3(1, 0, 0), red, 6), // left
    new Plane(vec3(2.75, 0, 0), vec3(-1, 0, 0), green, 6), // right
    // Ceiling light (emissive sphere as area light proxy)
    new Sphere(vec3(0, 5.4, -1.5), 0.55, light),
    // Scene objects
    new Sphere(vec3(-1.1, 0.7, -2.2), 0.7, chrome),
    new Sphere(vec3(1.0, 0.5, -1.5), 0.5, gold),
    new Sphere(vec3(0.2, 0.35, -3.2), 0.35, blue),
    new Sphere(vec3(-0.3, 0.25, -1.0), 0.25, lambertian(vec3(0.9, 0.75, 0.55))),
  ];

  const list = new HittableList(objects);
  const world = objects.length > 4 ? new BVHNode([...objects]) : list;

  const camera = new Camera(
    vec3(0, 2.5, 6.5),
    vec3(0, 2.0, -1),
    vec3(0, 1, 0),
    40,
    aspect,
    0.0,
  );

  return {
    world,
    camera,
    background: [0.0, 0.0, 0.0],
  };
}
