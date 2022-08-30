import {vec2} from "gl-matrix";

import {LatLon} from "./object/LatLon";
import {Point} from "./object/Points";
import {GeographyConverter} from "./math/Converter";
import {NonRegularTileLayer} from "./layer/NonRegulatTileLayer";
import {ICamera} from "../renderer/generic/camera/ICamera";

export class Core {
    private originLatLon: LatLon;
    private origin: Point;

    private _layers: NonRegularTileLayer[];

    constructor() {
        this._layers = [];
        this._layers.push(new NonRegularTileLayer(this));

        this.setWorldPosition(0.0, 0.0);
    }

    update(camera: ICamera) {
        this._layers.forEach(layer => layer.update(camera));
    }

    public setWorldPosition(lat: number, lon: number): Core {
        this.originLatLon = new LatLon(lat, lon);
        this.origin = this.project(this.originLatLon);
        return this;
    }

    public latLonToWorldPoint(coords: LatLon): Point {
        const projectedPoint = this.project(coords);
        vec2.sub(projectedPoint.raw, projectedPoint.raw, this.origin.raw);
        return projectedPoint;
    }

    private project(coords: LatLon): Point {
        return GeographyConverter.latLonToWorldPoint(coords);
    }

    private unproject(point: Point): LatLon {
        return GeographyConverter.worldPointToLatLon(point);
    }

    public worldPointToLatLon(point: Point) {
        const projectedPoint = point.clone();
        vec2.add(projectedPoint.raw, projectedPoint.raw, this.origin.raw);
        return this.unproject(projectedPoint);
    }

    get layers(): NonRegularTileLayer[] {
        return this._layers;
    }
}