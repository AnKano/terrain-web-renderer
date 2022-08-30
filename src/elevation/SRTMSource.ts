import { SRTMSourcePart } from './SRTMSourcePart';
import { GeographyConverter } from '../geo/math/Converter';

export interface HeightData {
    kernel: number[];

    north: number[];
    south: number[];
    west: number[];
    east: number[];
}

export class SRTMSource {
    private readonly parts: SRTMSourcePart[];

    constructor() {
        this.parts = [];
    }

    public loadEverything(): Promise<void[]> {
        const loadedParts = this.parts.map((part) => part.loadData());
        return Promise.all(loadedParts);
    }

    public addPart(url: string): SRTMSource {
        this.parts.push(new SRTMSourcePart(url));
        return this;
    }

    public getElevationLatLon(lat: number, lon: number, zoom: number): number {
        return this.parsePoint(lat, lon);
    }

    public getDataForTile(zoom: number, x: number, y: number, slicesX: number, slicesY: number): HeightData {
        return this.getDataFromXYZ(zoom, x, y, slicesX, slicesY);
    }

    private getDataFromXYZ(zoom: number, x: number, y: number, slicesX: number, slicesY: number): HeightData {
        const minimalX = GeographyConverter.tile2lon(x, zoom);
        const maximalY = GeographyConverter.tile2lat(y, zoom);
        const maximalX = GeographyConverter.tile2lon(x + 1, zoom);
        const minimalY = GeographyConverter.tile2lat(y + 1, zoom);

        const offsetX = Math.abs(minimalX - maximalX) / (slicesX - 1);
        const offsetY = Math.abs(maximalY - minimalY) / (slicesY - 1);

        return this.collectTileKernel(minimalX, minimalY, offsetX, offsetY, slicesX, slicesY);
    }

    private collectTileKernel(
        minimalX: number,
        minimalY: number,
        offsetX: number,
        offsetY: number,
        slicesX: number,
        slicesY: number
    ): HeightData {
        const kernel = new Array(slicesX * slicesY).fill(0);

        const north = [];
        const south = [];
        const west = [];
        const east = [];

        for (let j = 0; j < slicesY; j++)
            for (let i = 0; i < slicesX; i++) {
                const pX = minimalX + offsetX * i;
                const pY = minimalY + offsetY * j;

                const height = this.parsePoint(pX, pY);

                kernel[j * slicesX + i] = height;

                if (j == 0) south.push(height);
                if (j == slicesY - 1) north.push(height);

                if (i == 0) west.push(height);
                if (i == slicesX - 1) east.push(height);
            }

        return {
            kernel: kernel,
            north: north,
            south: south,
            west: west,
            east: east
        };
    }

    private parsePoint(pX: number, pY: number): number {
        const related = this.parts;
        for (const part of related) {
            const minimalRasterX = part.xOrigin;
            const maximalRasterY = part.yOrigin;
            const maximalRasterX = part.xOpposite;
            const minimalRasterY = part.yOpposite;

            if (!(minimalRasterX <= pX && pX <= maximalRasterX)) continue;
            if (!(minimalRasterY <= pY && pY <= maximalRasterY)) continue;

            const imx = pX - part.xOrigin;
            const imy = part.yOrigin - pY;

            const row = Math.floor(imx / part.pixelWidth);
            const col = Math.floor(imy / part.pixelHeight);

            const offset = 2 * (col * 3601 + row);
            return (part.data[offset] << 8) | part.data[offset + 1];
        }

        return 0;
    }
}
