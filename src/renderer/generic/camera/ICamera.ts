import { mat4, vec3 } from 'gl-matrix';

export abstract class ICamera {
    protected NEAR_DISTANCE = 0.1;
    protected FAR_DISTANCE = 100.0;

    _position: vec3;
    _target: vec3;
    up: vec3;

    _projectionMatrix: mat4;
    _viewMatrix: mat4;

    constructor(position: vec3, target: vec3) {
        this._position = position;
        this._target = target;
        this.up = [0.0, 1.0, 0.0];

        this._projectionMatrix = mat4.create();
        this._viewMatrix = mat4.create();

        window.addEventListener('keypress', (event) => {
            event.preventDefault();
            if (event.code === 'KeyW') {
                position[2] -= 2000.0;
                target[2] -= 2000.0;
            }
            if (event.code === 'KeyS') {
                position[2] += 2000.0;
                target[2] += 2000.0;
            }

            if (event.code === 'KeyA') {
                position[0] -= 2000.0;
                target[0] -= 2000.0;
            }
            if (event.code === 'KeyD') {
                position[0] += 2000.0;
                target[0] += 2000.0;
            }

            if (event.code === 'KeyZ') {
                position[1] += 2000.0;
            }
            if (event.code === 'KeyX') {
                position[1] -= 2000.0;
            }
        });
    }

    public abstract update(viewportWidth: number, viewportHeight: number): void;

    get position(): vec3 {
        return this._position;
    }

    set position(position: vec3) {
        this._position = position;
    }

    set target(eye: vec3) {
        this._target = eye;
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

    get viewMatrix() {
        return this._viewMatrix;
    }

    get combinedMatrix() {
        const combinedMatrix = mat4.create();
        mat4.mul(combinedMatrix, this.projectionMatrix, this.viewMatrix);
        return combinedMatrix;
    }

    get projectionMatrixBytes() {
        return new Float32Array(this._projectionMatrix);
    }

    get viewMatrixBytes() {
        return new Float32Array(this._viewMatrix);
    }

    get combinedMatrixBytes() {
        return new Float32Array(this.combinedMatrix);
    }
}