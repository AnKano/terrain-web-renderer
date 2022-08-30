import {Core} from "../Core";
import {vec3} from "gl-matrix";
import {ITile} from "../tile/ITile";
import {FrustumCulling} from "../FrustumCulling";
import {ICamera} from "../../renderer/generic/camera/ICamera";

export abstract class ITileLayer {
    protected readonly minLOD: number;
    protected readonly maxLOD: number;

    protected frustumCulling: FrustumCulling;

    protected camera: ICamera;

    tiles: ITile[];
    core: Core;

    protected constructor(core: Core) {
        this.core = core;

        this.tiles = [];
        this.frustumCulling = new FrustumCulling();

        this.minLOD = 3;
        this.maxLOD = 20;
    }

    abstract update(camera: ICamera): void;

    protected divide(checkList: ITile[], depth: number | null = this.maxLOD, target: number = 1.0): void {
        let count = 0;
        let currentItem;
        let quadcode: string;
        let currentDepth;

        while (count != checkList.length) {
            currentItem = checkList[count];
            quadcode = currentItem.quadcode;
            currentDepth = quadcode.length;

            if (currentItem.tilecode[2] === this.maxLOD) {
                count++;
                continue;
            }

            if (this.screenSpaceError(currentItem, target) && currentDepth <= depth) {
                checkList.splice(count, 1);
                ['0', '1', '2', '3'].forEach(postfix => checkList.push(new ITile(quadcode + postfix, this)));
            } else
                count++;
        }
    }

    protected screenSpaceError(tile: ITile, target: number): boolean {
        const quality = 3.0;
        const camera = this.camera;
        const quadcode = tile.quadcode;

        if (quadcode.length === this.maxLOD) return false;
        if (quadcode.length < this.minLOD) return true;
        if (!this.tileInFrustum(tile)) {
            tile.isVisible = false;
            return false;
        }

        const center = tile.center;

        const distVec = vec3.create();
        vec3.sub(distVec, [center[0], 0.0, center[1]], camera.position);
        const dist = vec3.length(distVec);

        const error = (quality * tile.side) / dist;
        return error > target;
    }

    protected tileInFrustum(tile: ITile): boolean {
        const pos = tile.center;
        const scale = tile.side;

        const minX = pos[0] - scale / 2;
        const maxX = pos[0] + scale / 2;
        const minZ = pos[1] - scale / 2;
        const maxZ = pos[1] + scale / 2;
        const minY = -1.0;
        const maxY = 1.0;

        return this.frustumCulling.testAABB(
            minX, minY, minZ, maxX, maxY, maxZ
        );
    }
}