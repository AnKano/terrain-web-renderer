import { LatLon } from '../object/LatLon';
import { Point } from '../object/Points';

export class GeographyConverter {
    static readonly R: number = 6378137.0;
    static readonly MAX_LATITUDE: number = 85.0511287798;
    static readonly MULTIPLIER: number = 0.001;

    static project(latlon: LatLon): Point {
        const d = Math.PI / 180.0;
        const max = GeographyConverter.MAX_LATITUDE;
        const lat = Math.max(Math.min(max, latlon.lat), -max);
        const sin = Math.sin(lat * d);

        return new Point(
            GeographyConverter.R * latlon.lon * d,
            (GeographyConverter.R * Math.log((1.0 + sin) / (1.0 - sin))) / 2.0
        );
    }

    static unproject(point: Point): LatLon {
        const d = 180.0 / Math.PI;

        return new LatLon(
            (2.0 * Math.atan(Math.exp(point.y / GeographyConverter.R)) - Math.PI / 2.0) * d,
            (point.x * d) / GeographyConverter.R
        );
    }

    static latLonToWorldPoint(latlon: LatLon): Point {
        const projected = this.project(latlon);
        projected.y *= -1.0;

        projected.x *= GeographyConverter.MULTIPLIER;
        projected.y *= GeographyConverter.MULTIPLIER;

        return projected;
    }

    static worldPointToLatLon(point: Point): LatLon {
        const rawPoint = new Point(point.x, point.y * -1.0);

        rawPoint.x /= GeographyConverter.MULTIPLIER;
        rawPoint.y /= GeographyConverter.MULTIPLIER;

        return this.unproject(rawPoint);
    }

    static quadcodeToTilecode(quadcode: string): number[] {
        const z = quadcode.length;
        let x = 0,
            y = 0;

        for (let i = z; i > 0; i--) {
            const mask = 1 << (i - 1);
            const q = quadcode.at(z - i);
            if (q === '1') x |= mask;
            if (q === '2') y |= mask;
            if (q === '3') {
                x |= mask;
                y |= mask;
            }
        }

        return [x, y, z];
    }

    static tile2lon(x: number, z: number): number {
        return (x / Math.pow(2.0, z)) * 360 - 180;
    }

    static tile2lat(y: number, z: number): number {
        const n = Math.PI - (2.0 * Math.PI * y) / Math.pow(2.0, z);
        return (180.0 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    }

    static lonToTileX(lon: number, zoom: number): number {
        return Math.floor(((lon + 180.0) / 360.0) * (1 << zoom));
    }

    static latToTileY(lat: number, zoom: number): number {
        const latrad = (lat * Math.PI) / 180.0;
        return Math.floor(((1.0 - Math.asinh(Math.tan(latrad)) / Math.PI) / 2.0) * (1 << zoom));
    }
}
