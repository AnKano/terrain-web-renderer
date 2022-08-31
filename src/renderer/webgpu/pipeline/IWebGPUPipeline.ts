import { IPipeline } from '../../abstract/IPipeline';
import WebGPURenderer from '../WebGPURenderer';
import WebGLRenderer from '../../webgl/WebGLRenderer';
import { WebGLModelAdapter } from '../../webgl/WebGLModelAdapter';
import { IPipelineMaterialLogic } from '../../abstract/IPipelineMaterialLogic';
import { WebGPUModelAdapter } from '../WebGPUModelAdapter';

export abstract class IWebGPUPipeline extends IPipeline {
    protected renderer: WebGPURenderer;

    private _pipeline: GPURenderPipeline;
    protected uniformBindGroupLayout: GPUBindGroupLayout;
    protected globalUniforms: GPUBindGroupEntry[];

    protected constructor(renderer: WebGPURenderer) {
        super();

        this.renderer = renderer;
    }

    public abstract producePipelineMaterialLogic(
        renderer: WebGPURenderer,
        model: WebGPUModelAdapter
    ): IPipelineMaterialLogic;

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
