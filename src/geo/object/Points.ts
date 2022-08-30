import { vec2 } from 'gl-matrix';

export class Point {
    private readonly point: vec2;

    constructor(x: number, y: number) {
        this.point = vec2.fromValues(x, y);
    }

    // aliases for lat-lon form

    get x(): number {
        return this.point[0];
    }

    set x(value: number) {
        this.point[0] = value;
    }

    get y(): number {
        return this.point[1];
    }

    set y(value: number) {
        this.point[1] = value;
    }

    get raw(): vec2 {
        return this.point;
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }
}