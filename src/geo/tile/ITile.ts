import { LatLon } from '../object/LatLon';
import { GeographyConverter } from '../math/Converter';
import { Point } from '../object/Points';
import { NonRegularTileLayer } from '../layer/NonRegularTileLayer';

export class ITile {
    isVisible: boolean;
    protected layer: NonRegularTileLayer;

    private readonly _quadcode: string;
    private centerLatLon: LatLon;

    private readonly _tilecode: number[];
    private readonly boundsLatLon: number[];
    private readonly _bounds: number[];
    private readonly _center: number[];

    constructor(quadcode: string, layer: NonRegularTileLayer) {
        this._quadcode = quadcode;
        this.layer = layer;

        // create shortcut to converter placed in 'World' class
        this._tilecode = GeographyConverter.quadcodeToTilecode(quadcode);

        this.boundsLatLon = ITile.tileBoundsWGS84(this._tilecode);
        this._bounds = this.tileBoundsFromWGS84(this.boundsLatLon);
        this._center = ITile.boundsToCenter(this._bounds);
        this.centerLatLon = this.layer.core.worldPointToLatLon(new Point(this._center[0], this._center[1]));

        this.isVisible = true;
    }

    private static tileBoundsWGS84(tilecode: number[]): number[] {
        if (tilecode.length != 3) throw RangeError("Tilecode array can't contain more or less three elements");

        const w = GeographyConverter.tile2lon(tilecode[0], tilecode[2]);
        const s = GeographyConverter.tile2lat(tilecode[1] + 1, tilecode[2]);
        const e = GeographyConverter.tile2lon(tilecode[0] + 1, tilecode[2]);
        const n = GeographyConverter.tile2lat(tilecode[1], tilecode[2]);

        return [w, s, e, n];
    }

    private tileBoundsFromWGS84(boundsWGS84: number[]): number[] {
        if (boundsWGS84.length != 4) throw RangeError("boundsWGS84 array can't contain more or less four elements");

        const sw = this.layer.core.latLonToWorldPoint(new LatLon(boundsWGS84[1], boundsWGS84[0]));
        const ne = this.layer.core.latLonToWorldPoint(new LatLon(boundsWGS84[3], boundsWGS84[2]));

        return [sw.x, sw.y, ne.x, ne.y];
    }

    private static boundsToCenter(bounds: number[]): number[] {
        if (bounds.length != 4) throw RangeError("bounds array can't contain more or less four elements");

        const x = bounds[0] + (bounds[2] - bounds[0]) / 2;
        const y = bounds[1] + (bounds[3] - bounds[1]) / 2;

        return [x, y];
    }

    get quadcode(): string {
        return this._quadcode;
    }

    get tilecode(): number[] {
        return this._tilecode;
    }

    get bounds(): number[] {
        return this._bounds;
    }

    get center(): number[] {
        return this._center;
    }

    get side(): number {
        return this.bounds[1] - this.bounds[3];
    }
}