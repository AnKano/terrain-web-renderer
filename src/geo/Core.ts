import { vec2 } from 'gl-matrix';

import { LatLon } from './object/LatLon';
import { Point } from './object/Points';
import { GeographyConverter } from './math/Converter';
import { NonRegularTileLayer } from './layer/NonRegularTileLayer';
import { ICamera } from '../renderer/generic/camera/ICamera';

export class Core {
    private originLatLon: LatLon;
    private originPoint: Point;

    private readonly _layers: NonRegularTileLayer[];

    constructor() {
        this._layers = [];
        this._layers.push(new NonRegularTileLayer(this));

        // by default use global zero
        this.setWorldPosition(0.0, 0.0);
    }

    update(camera: ICamera) {
        this._layers.forEach((layer) => layer.update(camera));
    }

    public setWorldPosition(lat: number, lon: number): Core {
        this.originLatLon = new LatLon(lat, lon);
        this.originPoint = GeographyConverter.latLonToWorldPoint(this.originLatLon);
        return this;
    }

    public latLonToWorldPoint(coords: LatLon): Point {
        const projectedPoint = GeographyConverter.latLonToWorldPoint(coords);
        vec2.sub(projectedPoint.raw, projectedPoint.raw, this.originPoint.raw);
        return projectedPoint;
    }

    public worldPointToLatLon(point: Point) {
        const projectedPoint = point.clone();
        vec2.add(projectedPoint.raw, projectedPoint.raw, this.originPoint.raw);
        return GeographyConverter.worldPointToLatLon(projectedPoint);
    }

    get layers(): NonRegularTileLayer[] {
        return this._layers;
    }
}
