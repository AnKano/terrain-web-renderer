import { IPipeline } from '../../generic/IPipeline';
import Renderer from '../Renderer';

export abstract class IWebGPUPipeline extends IPipeline {
    protected renderer: Renderer;

    private _pipeline: GPURenderPipeline;
    protected uniformBindGroupLayout: GPUBindGroupLayout;
    protected globalUniforms: GPUBindGroupEntry[];

    protected constructor(renderer: Renderer) {
        super();

        this.renderer = renderer;
    }

    activate(): void {
        this.renderer.passEncoder.setPipeline(this.pipeline);
    }

    destroy(): void {
        //!TODO: todo
    }

    private combineBindUniforms(locals: GPUBindGroupEntry[]) {
        if (!this.globalUniforms) throw 'Global uniforms stands undefined!';

        return this.globalUniforms.concat(locals);
    }

    requestBindGroup(locals: GPUBindGroupEntry[]): GPUBindGroup {
        return this.renderer.device.createBindGroup({
            layout: this.uniformBindGroupLayout,
            entries: this.combineBindUniforms(locals)
        });
    }

    set pipeline(value: GPURenderPipeline) {
        this._pipeline = value;
    }

    get pipeline(): GPURenderPipeline {
        return this._pipeline;
    }
}
