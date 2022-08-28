import { IModelAdapter } from '../abstract/IModelAdapter';
import WebGPURenderer from './WebGPURenderer';
import { reserveBuffer } from './utils/Utils';
import { IMeshAdapter } from '../abstract/IMeshAdapter';
import { WebGPUMesh } from './WebGPUMesh';
import { Model } from '../generic/Model';
import { WebGPUTex } from './WebGPUTexture';

export class WebGPUModelAdapter extends IModelAdapter {
    private readonly renderer: WebGPURenderer;

    private mesh: IMeshAdapter;

    private readonly luModelMatrixBuffer: GPUBuffer;
    private readonly luTintBuffer: GPUBuffer;

    constructor(renderer: WebGPURenderer, modelDescription: Model) {
        super(modelDescription);

        this.renderer = renderer;

        this.mesh = new WebGPUMesh(renderer, modelDescription.mesh);

        this.luModelMatrixBuffer = reserveBuffer(
            this.renderer,
            16 * 4,
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        );
        this.luTintBuffer = reserveBuffer(this.renderer, 4 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

        this.renderer.queue.writeBuffer(
            this.luTintBuffer,
            0,
            new Float32Array([Math.random(), Math.random(), Math.random(), 1.0])
        );
    }

    updateLocals() {
        this.renderer.queue.writeBuffer(this.luModelMatrixBuffer, 0, this.general.modelViewMatrixBytes);
    }

    draw(): void {
        const encoder = this.renderer.passEncoder;
        if (!encoder) throw 'Encoder currently undefined!';

        // activate/actualize pipeline
        this.renderer.activePipeline.activate();
        this.renderer.activePipeline.update();

        const specifics = this.general.texture.specifics;
        if (!specifics.has(this.renderer.TYPE))
            specifics.set(this.renderer.TYPE, new WebGPUTex(this.renderer, this.general.texture));
        const tex = specifics.get(this.renderer.TYPE) as WebGPUTex;

        encoder.setBindGroup(
            0,
            this.renderer.activePipeline.requestBindGroup([
                { binding: 2, resource: { buffer: this.luModelMatrixBuffer } },
                { binding: 3, resource: { buffer: this.luTintBuffer } },
                // diffuse
                { binding: 4, resource: tex.sampler },
                { binding: 5, resource: tex.texture.createView() }
            ])
        );

        this.updateLocals();

        // draw geometry
        this.mesh.draw();
    }
}
