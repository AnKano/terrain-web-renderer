import { mat4, vec3 } from 'gl-matrix';

export abstract class IModel {
    private _position: vec3;
    private _rotation: vec3;
    private _scale: vec3;

    protected constructor() {
        this._position = vec3.fromValues(0.0, 0.0, 0.0);
        this._rotation = vec3.fromValues(0.0, 0.0, 0.0);
        this._scale = vec3.fromValues(1.0, 1.0, 1.0);
    }

    public abstract draw(): void;

    get modelViewMatrix(): mat4 {
        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, mat4.create(), this._position);
        mat4.rotateX(modelViewMatrix, modelViewMatrix, this._rotation[0]);
        mat4.rotateY(modelViewMatrix, modelViewMatrix, this._rotation[1]);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, this._rotation[2]);
        mat4.scale(modelViewMatrix, modelViewMatrix, this._scale);

        return modelViewMatrix;
    }

    get modelViewMatrixBytes(): Float32Array {
        return new Float32Array(this.modelViewMatrix);
    }

    get position(): vec3 {
        return this._position;
    }

    set position(value: vec3) {
        this._position = value;
    }

    get scale(): vec3 {
        return this._scale;
    }

    set scale(value: vec3) {
        this._scale = value;
    }

    get rotation(): vec3 {
        return this._rotation;
    }

    set rotation(value: vec3) {
        this._rotation = value;
    }
}
