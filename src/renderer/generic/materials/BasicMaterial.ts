import { IMaterial } from './IMaterial';
import { Texture } from '../Texture';

export class BasicMaterial extends IMaterial {
    private _texture: Texture | null;
    private readonly _tint: Float32Array | null;

    constructor() {
        super();

        this._tint = new Float32Array([Math.random(), Math.random(), Math.random(), 1.0]);
    }

    get tint(): Float32Array | null {
        return this._tint;
    }

    get texture(): Texture | null {
        return this._texture;
    }

    set texture(value: Texture) {
        value.material = this;
        this._texture = value;
    }
}