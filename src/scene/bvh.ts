import type { Ray } from '../math/ray';
import type { AABB, HitRecord, Hittable } from './hittable';
import { hitAABB, surround } from './hittable';

/** Simple binary BVH over AABBs for multi-object scenes. */
export class BVHNode implements Hittable {
  left: Hittable;
  right: Hittable;
  box: AABB;

  constructor(objects: Hittable[], start = 0, end = objects.length) {
    const span = end - start;
    const axis = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const comparator = (a: Hittable, b: Hittable) =>
      a.bounds().min[axis] - b.bounds().min[axis];

    if (span === 1) {
      this.left = this.right = objects[start];
    } else if (span === 2) {
      if (comparator(objects[start], objects[start + 1]) < 0) {
        this.left = objects[start];
        this.right = objects[start + 1];
      } else {
        this.left = objects[start + 1];
        this.right = objects[start];
      }
    } else {
      const slice = objects.slice(start, end).sort(comparator);
      for (let i = 0; i < span; i++) objects[start + i] = slice[i];
      const mid = start + Math.floor(span / 2);
      this.left = new BVHNode(objects, start, mid);
      this.right = new BVHNode(objects, mid, end);
    }
    this.box = surround(this.left.bounds(), this.right.bounds());
  }

  hit(r: Ray, tMin: number, tMax: number): HitRecord | null {
    if (!hitAABB(this.box, r, tMin, tMax)) return null;
    const hitLeft = this.left.hit(r, tMin, tMax);
    const hitRight = this.right.hit(r, tMin, hitLeft ? hitLeft.t : tMax);
    return hitRight ?? hitLeft;
  }

  bounds(): AABB {
    return this.box;
  }
}
