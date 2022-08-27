import { IModel } from '../generic/IModel';
import Renderer from './Renderer';
import { IWebGPUPipeline } from './pipeline/IWebGPUPipeline';
import { reserveBuffer } from './utils/Utils';
import { IMesh } from "../generic/IMesh";

export class Model extends IModel {
    private readonly renderer: Renderer;

    private mesh: IMesh;
    private pipeline: IWebGPUPipeline;

    private readonly luModelMatrixBuffer: GPUBuffer;
    private readonly luTintBuffer: GPUBuffer;

    constructor(renderer: Renderer, pipeline: IWebGPUPipeline, mesh: IMesh) {
        super();

        this.renderer = renderer;

        this.pipeline = pipeline;
        this.mesh = mesh;

        this.luModelMatrixBuffer = reserveBuffer(this.renderer, 16 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        this.luTintBuffer = reserveBuffer(this.renderer, 4 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

        this.renderer.queue.writeBuffer(this.luTintBuffer, 0, new Float32Array([
            Math.random(), Math.random(), Math.random(), 1.0
        ]));
    }

    updateLocals() {
        this.renderer.queue.writeBuffer(this.luModelMatrixBuffer, 0, this.modelViewMatrixBytes);
    }

    draw(): void {
        const encoder = this.renderer.passEncoder;
        if (!encoder) throw 'Encoder currently undefined!';

        // activate/actualize pipeline
        this.pipeline.activate();
        this.pipeline.update();
        encoder.setBindGroup(0, this.pipeline.requestBindGroup([
            { binding: 2, resource: { buffer: this.luModelMatrixBuffer } },
            { binding: 3, resource: { buffer: this.luTintBuffer } },
        ]));

        this.updateLocals();

        // draw geometry
        this.mesh.draw();
    }
}
