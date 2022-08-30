import { HeightData } from '../elevation/SRTMSource';

export class GridMesh {
    heightSegments: number;
    widthSegments: number;

    vertices: number[];
    uvs: number[];
    indices: number[];

    constructor(width = 1, height = 1, heights: HeightData) {
        const vtxNum = Math.sqrt(heights.kernel.length);

        this.indices = [];
        this.vertices = [];
        this.uvs = [];

        this.makeSurface(width, height, vtxNum, vtxNum, heights.kernel);

        this.makeHorizontalBorder(width, vtxNum - 1, width / 2, heights.north, false);
        this.makeHorizontalBorder(width, vtxNum - 1, -width / 2, heights.south, true);

        this.makeVerticalBorder(height, vtxNum - 1, -height / 2, heights.east, true);
        this.makeVerticalBorder(height, vtxNum - 1, height / 2, heights.west, false);
    }

    private makeSurface(width = 1, height = 1, segmentsX: number, segmentsY: number, heights: number[]) {
        this.widthSegments = segmentsX - 1;
        this.heightSegments = segmentsY - 1;

        const width_half = width / 2;
        const height_half = height / 2;

        const gridX = Math.floor(this.widthSegments);
        const gridY = Math.floor(this.heightSegments);

        const gridX1 = gridX + 1;
        const gridY1 = gridY + 1;

        const segment_width = width / gridX;
        const segment_height = height / gridY;

        for (let iy = 0; iy < gridY1; iy++) {
            const y = iy * segment_height - height_half;
            for (let ix = 0; ix < gridX1; ix++) {
                const x = ix * segment_width - width_half;
                const height = heights[iy * segmentsX + ix] < 5000.0 ? -heights[iy * segmentsX + ix] : 0.0;

                this.vertices.push(x, -y, height);
                this.uvs.push(ix / gridX, 1 - iy / gridY);
            }
        }

        for (let iy = 0; iy < gridY; iy++) {
            for (let ix = 0; ix < gridX; ix++) {
                const a = ix + gridX1 * iy;
                const b = ix + gridX1 * (iy + 1);
                const c = ix + 1 + gridX1 * (iy + 1);
                const d = ix + 1 + gridX1 * iy;

                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
            }
        }
    }

    private makeHorizontalBorder(
        width: number,
        segments: number,
        constraint: number,
        heights: number[],
        downBorder: boolean
    ) {
        const vtxCount = this.vertices.length / 3;

        const widthHalf = width / 2.0;
        const gridX = segments;
        const segmentWidth = width / segments;

        const uvs = 1.0 / gridX;

        for (let ix = 0; ix < gridX; ix++) {
            const x = ix * segmentWidth - widthHalf;
            const height = heights[ix] < 5000.0 ? -heights[ix] : 0.0;

            this.vertices.push(x, -constraint, height);

            if (downBorder) this.uvs.push(uvs * ix, 1.0);
            if (!downBorder) this.uvs.push(uvs * ix, 0.0);
        }

        for (let ix = 0; ix < gridX; ix++) {
            const x = ix * segmentWidth - widthHalf;
            this.vertices.push(x, -constraint, 1000.0);

            if (downBorder) this.uvs.push(uvs * ix, 1.1);
            if (!downBorder) this.uvs.push(uvs * ix, -0.1);
        }

        for (let ix = 0; ix < gridX - 1; ix++) {
            let a = ix;
            let b = ix + 1;
            let d = ix + 1 + gridX;
            let c = ix + gridX;

            a += vtxCount;
            b += vtxCount;
            c += vtxCount;
            d += vtxCount;

            if (downBorder) {
                this.indices.push(a, b, d);
                this.indices.push(a, d, c);
            } else {
                this.indices.push(d, b, a);
                this.indices.push(c, d, a);
            }
        }
    }

    private makeVerticalBorder(
        height: number,
        segments: number,
        constraint: number,
        heights: number[],
        rightBorder: boolean
    ) {
        const vtxCount = this.vertices.length / 3;

        const heightHalf = height / 2.0;
        const gridX = segments;
        const segmentHeight = height / segments;

        const uvs = 1.0 / gridX;

        for (let ix = 0; ix < gridX; ix++) {
            const x = ix * segmentHeight - heightHalf;
            const height = heights[heights.length - ix - 1] < 5000.0 ? -heights[heights.length - ix - 1] : 0.0;

            this.vertices.push(-constraint, x, height);

            if (!rightBorder) this.uvs.push(0.0, uvs * ix);
            if (rightBorder) this.uvs.push(1.0, uvs * ix);
        }

        for (let ix = 0; ix < gridX; ix++) {
            const x = ix * segmentHeight - heightHalf;

            this.vertices.push(-constraint, x, 1000.0);

            if (!rightBorder) this.uvs.push(-0.1, uvs * ix);
            if (rightBorder) this.uvs.push(1.1, uvs * ix);
        }

        for (let i = 0; i < gridX - 1; i++) {
            let a = i;
            let b = i + 1;
            let d = i + 1 + gridX;
            let c = i + gridX;

            a += vtxCount;
            b += vtxCount;
            c += vtxCount;
            d += vtxCount;

            if (!rightBorder) {
                this.indices.push(a, b, d);
                this.indices.push(a, d, c);
            } else {
                this.indices.push(d, b, a);
                this.indices.push(c, d, a);
            }
        }
    }
}