import { vec2 } from 'gl-matrix';

export class LatLon {
    private readonly point: vec2;

    constructor(lat: number, lon: number) {
        this.point = vec2.fromValues(lat, lon);
    }

    // aliases for lat-lon form

    get lat(): number {
        return this.point[0];
    }

    set lat(value: number) {
        this.point[0] = value;
    }

    get lon(): number {
        return this.point[1];
    }

    set lon(value: number) {
        this.point[1] = value;
    }

    get raw(): vec2 {
        return this.point;
    }
}
