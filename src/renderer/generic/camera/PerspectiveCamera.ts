import { glMatrix, mat4 } from 'gl-matrix';
import { ICamera } from './ICamera';

export class PerspectiveCamera extends ICamera {
    update(viewportWidth: number, viewportHeight: number) {
        const aspectRatio = viewportWidth / viewportHeight;

        mat4.perspective(
            this.projectionMatrix,
            glMatrix.toRadian(45.0),
            aspectRatio,
            this.NEAR_DISTANCE,
            this.FAR_DISTANCE
        );

        mat4.lookAt(this.viewMatrix, this._position, this._target, this.up);
    }
}
