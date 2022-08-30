import { IMaterial } from './IMaterial';
import { Texture } from '../Texture';
import { RenderType } from '../../IRenderer';
import { BasicPipeline as WGLBasic } from '../../webgl/pipeline/basic/BasicPipeline';
import { BasicPipeline as WGPUBasic } from '../../webgpu/pipeline/basic/BasicPipeline';
import { IPipeline } from '../../abstract/IPipeline';

export class BasicMaterial extends IMaterial {
    private _diffuse: Texture | null;
    private _tint: Float32Array | null;
    private _tintCoefficient: number | null;

    constructor() {
        super();

        this._shaders = new Map<RenderType, () => IPipeline>();
        this._shaders.set(RenderType.WebGL, WGLBasic.activate);
        this._shaders.set(RenderType.WebGPU, WGPUBasic.activate);

        this._tint = new Float32Array([0.0, 0.0, 0.0, 1.0]);
        this._tintCoefficient = 0.5;
    }

    get diffuse(): Texture | null {
        return this._diffuse;
    }

    set diffuse(value: Texture) {
        value.material = this;
        this._diffuse = value;
    }

    get tint(): Float32Array | null {
        return this._tint;
    }

    set tint(value: Float32Array | null) {
        this._tint = value;
    }

    get tintCoefficient(): number | null {
        return this._tintCoefficient;
    }

    set tintCoefficient(value: number | null) {
        this._tintCoefficient = value;
    }
}
