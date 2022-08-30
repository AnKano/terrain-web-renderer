import { Core } from '../Core';
import { ITileLayer } from './ITileLayer';
import {ITile} from "../tile/ITile";
import {ICamera} from "../../renderer/generic/camera/ICamera";

export class NonRegularTileLayer extends ITileLayer{
    constructor(core: Core) {
        super(core);
    }

    update(camera: ICamera) {
        this.camera = camera;
        this.frustumCulling.update(camera.projectionMatrix, camera.viewMatrix);

        this.tiles = [];
        ['0', '1', '2', '3'].forEach(postfix => this.tiles.push(new ITile(postfix, this)));

        this.divide(this.tiles);

        this.tiles = this.tiles.sort((a: ITile, b: ITile) => a.quadcode.length - b.quadcode.length);
    }
}