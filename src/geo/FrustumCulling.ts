import { mat4, vec4 } from 'gl-matrix';

export class FrustumCulling {
    private readonly nX: vec4;
    private readonly pX: vec4;
    private readonly nY: vec4;
    private readonly pY: vec4;
    private readonly nZ: vec4;
    private readonly pZ: vec4;

    private readonly prjViewMat: mat4;

    constructor() {
        this.prjViewMat = mat4.create();

        this.nX = vec4.create();
        this.pX = vec4.create();

        this.nY = vec4.create();
        this.pY = vec4.create();

        this.nZ = vec4.create();
        this.pZ = vec4.create();
    }

    update(prjMatrix: mat4, viewMatrix: mat4) {
        mat4.mul(this.prjViewMat, prjMatrix, viewMatrix);

        this.nX[0] = this.prjViewMat[0 * 4 + 3] + this.prjViewMat[0 * 4 + 0];
        this.nX[1] = this.prjViewMat[1 * 4 + 3] + this.prjViewMat[1 * 4 + 0];
        this.nX[2] = this.prjViewMat[2 * 4 + 3] + this.prjViewMat[2 * 4 + 0];
        this.nX[3] = this.prjViewMat[3 * 4 + 3] + this.prjViewMat[3 * 4 + 0];

        this.pX[0] = this.prjViewMat[0 * 4 + 3] - this.prjViewMat[0 * 4 + 0];
        this.pX[1] = this.prjViewMat[1 * 4 + 3] - this.prjViewMat[1 * 4 + 0];
        this.pX[2] = this.prjViewMat[2 * 4 + 3] - this.prjViewMat[2 * 4 + 0];
        this.pX[3] = this.prjViewMat[3 * 4 + 3] - this.prjViewMat[3 * 4 + 0];

        this.nY[0] = this.prjViewMat[0 * 4 + 3] + this.prjViewMat[0 * 4 + 1];
        this.nY[1] = this.prjViewMat[1 * 4 + 3] + this.prjViewMat[1 * 4 + 1];
        this.nY[2] = this.prjViewMat[2 * 4 + 3] + this.prjViewMat[2 * 4 + 1];
        this.nY[3] = this.prjViewMat[3 * 4 + 3] + this.prjViewMat[3 * 4 + 1];

        this.pY[0] = this.prjViewMat[0 * 4 + 3] - this.prjViewMat[0 * 4 + 1];
        this.pY[1] = this.prjViewMat[1 * 4 + 3] - this.prjViewMat[1 * 4 + 1];
        this.pY[2] = this.prjViewMat[2 * 4 + 3] - this.prjViewMat[2 * 4 + 1];
        this.pY[3] = this.prjViewMat[3 * 4 + 3] - this.prjViewMat[3 * 4 + 1];

        this.nZ[0] = this.prjViewMat[0 * 4 + 3] + this.prjViewMat[0 * 4 + 2];
        this.nZ[1] = this.prjViewMat[1 * 4 + 3] + this.prjViewMat[1 * 4 + 2];
        this.nZ[2] = this.prjViewMat[2 * 4 + 3] + this.prjViewMat[2 * 4 + 2];
        this.nZ[3] = this.prjViewMat[3 * 4 + 3] + this.prjViewMat[3 * 4 + 2];

        this.pZ[0] = this.prjViewMat[0 * 4 + 3] - this.prjViewMat[0 * 4 + 2];
        this.pZ[1] = this.prjViewMat[1 * 4 + 3] - this.prjViewMat[1 * 4 + 2];
        this.pZ[2] = this.prjViewMat[2 * 4 + 3] - this.prjViewMat[2 * 4 + 2];
        this.pZ[3] = this.prjViewMat[3 * 4 + 3] - this.prjViewMat[3 * 4 + 2];
    }

    testAABB(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): boolean {
        return (
            this.nX[0] * (this.nX[0] < 0 ? minX : maxX) +
            this.nX[1] * (this.nX[1] < 0 ? minY : maxY) +
            this.nX[2] * (this.nX[2] < 0 ? minZ : maxZ) >= -this.nX[3] &&
            this.pX[0] * (this.pX[0] < 0 ? minX : maxX) +
            this.pX[1] * (this.pX[1] < 0 ? minY : maxY) +
            this.pX[2] * (this.pX[2] < 0 ? minZ : maxZ) >= -this.pX[3] &&
            this.nY[0] * (this.nY[0] < 0 ? minX : maxX) +
            this.nY[1] * (this.nY[1] < 0 ? minY : maxY) +
            this.nY[2] * (this.nY[2] < 0 ? minZ : maxZ) >= -this.nY[3] &&
            this.pY[0] * (this.pY[0] < 0 ? minX : maxX) +
            this.pY[1] * (this.pY[1] < 0 ? minY : maxY) +
            this.pY[2] * (this.pY[2] < 0 ? minZ : maxZ) >= -this.pY[3] &&
            this.nZ[0] * (this.nZ[0] < 0 ? minX : maxX) +
            this.nZ[1] * (this.nZ[1] < 0 ? minY : maxY) +
            this.nZ[2] * (this.nZ[2] < 0 ? minZ : maxZ) >= -this.nZ[3] &&
            this.pZ[0] * (this.pZ[0] < 0 ? minX : maxX) +
            this.pZ[1] * (this.pZ[1] < 0 ? minY : maxY) +
            this.pZ[2] * (this.pZ[2] < 0 ? minZ : maxZ) >= -this.pZ[3]
        );
    }
}