import { Mesh } from './Mesh';
import { mat4, vec3 } from 'gl-matrix';
import { RenderType } from '../IRenderer';
import { IModelAdapter } from '../abstract/IModelAdapter';
import { IMaterial } from './materials/IMaterial';

export class Model {
    private readonly _specifics: Map<RenderType, IModelAdapter>;

    private _mesh: Mesh | null;
    private _material: IMaterial | null;

    private _position: vec3;
    private _rotation: vec3;
    private _scale: vec3;

    public constructor() {
        this._mesh = new Mesh();
        this._specifics = new Map<RenderType, IModelAdapter>();

        this._position = vec3.fromValues(0.0, 0.0, 0.0);
        this._rotation = vec3.fromValues(0.0, 0.0, 0.0);
        this._scale = vec3.fromValues(1.0, 1.0, 1.0);
    }

    get modelViewMatrix(): mat4 {
        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, mat4.create(), this._position);
        mat4.rotateX(modelViewMatrix, modelViewMatrix, this._rotation[0]);
        mat4.rotateY(modelViewMatrix, modelViewMatrix, this._rotation[1]);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, this._rotation[2]);
        mat4.scale(modelViewMatrix, modelViewMatrix, this._scale);

        return modelViewMatrix;
    }

    get material(): IMaterial | null {
        return this._material;
    }

    set material(value: IMaterial) {
        value.model = this;
        this._material = value;
    }

    get mesh(): Mesh | null {
        return this._mesh;
    }

    set mesh(value: Mesh) {
        value.model = this;
        this._mesh = value;
    }

    get specifics(): Map<RenderType, IModelAdapter> {
        return this._specifics;
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
