import { IModelAdapter } from '../abstract/IModelAdapter';
import WebGPURenderer from './WebGPURenderer';
import { reserveBuffer } from './utils/Utils';
import { WebGPUMesh } from './WebGPUMesh';
import { Model } from '../generic/Model';
import { IWebGPUPipeline } from './pipeline/IWebGPUPipeline';
import {IMaterial} from "../generic/materials/IMaterial";
import {IWebGPUPipelineMaterialLogic} from "../abstract/IPipelineMaterialLogic";

export class WebGPUModelAdapter extends IModelAdapter {
    private readonly renderer: WebGPURenderer;

    private _mesh: WebGPUMesh;
    private _material: IMaterial;
    private _activePipeline: IWebGPUPipeline;
    private logic: IWebGPUPipelineMaterialLogic;

    private readonly luModelMatrixBuffer: GPUBuffer;

    constructor(renderer: WebGPURenderer, description: Model) {
        super(description);

        this.renderer = renderer;

        this._mesh = new WebGPUMesh(renderer, description.mesh);
        this._material = description.material;

        this.luModelMatrixBuffer = reserveBuffer(
            this.renderer,
            16 * 4,
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        );

        this.invokePipeline();
        this.logic = this._activePipeline.producePipelineMaterialLogic(this.renderer, this) as IWebGPUPipelineMaterialLogic;
    }

    protected invokePipeline(): void {
        const pipelineFunction = this._material.shaders.get(this.renderer.TYPE).bind(this);
        this._activePipeline = pipelineFunction(this.renderer) as IWebGPUPipeline;
    }

    updateLocals() {
        this.renderer.queue.writeBuffer(this.luModelMatrixBuffer, 0, this.general.modelViewMatrixBytes);
    }

    draw(): void {
        const encoder = this.renderer.passEncoder;
        if (!encoder) throw 'Encoder currently undefined!';

        // activate/actualize pipeline
        // activate related pipeline
        this.invokePipeline();
        this._activePipeline.activate();
        this._activePipeline.update();

        this.logic.updateLocals();
        this.updateLocals();

        let bindGroup: GPUBindGroupEntry[] = [
            { binding: 2, resource: { buffer: this.luModelMatrixBuffer } },
            ...this.logic.requestBindGroup()
        ];

        encoder.setBindGroup(0, this._activePipeline.requestBindGroup(bindGroup));

        // draw geometry
        this._mesh.draw();
    }

    get mesh(): WebGPUMesh {
        return this._mesh;
    }

    get material(): IMaterial {
        return this._material;
    }

    get activePipeline(): IWebGPUPipeline {
        return this._activePipeline;
    }
}
