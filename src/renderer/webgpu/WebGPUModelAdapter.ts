import { IModelAdapter } from '../abstract/IModelAdapter';
import WebGPURenderer from './WebGPURenderer';
import { reserveBuffer } from './utils/Utils';
import { WebGPUMesh } from './WebGPUMesh';
import { Model } from '../generic/Model';
import { WebGPUTex } from './WebGPUTexture';
import { BasicMaterial } from '../generic/materials/BasicMaterial';

export class WebGPUModelAdapter extends IModelAdapter {
    private readonly renderer: WebGPURenderer;

    private mesh: WebGPUMesh;
    private material: BasicMaterial;
    private texture: WebGPUTex;

    private readonly luModelMatrixBuffer: GPUBuffer;
    private readonly luTintBuffer: GPUBuffer;

    constructor(renderer: WebGPURenderer, description: Model) {
        super(description);

        this.renderer = renderer;

        this.mesh = new WebGPUMesh(renderer, description.mesh);
        this.material = description.material as BasicMaterial;
        this.texture = new WebGPUTex(renderer, this.material.texture);

        this.luModelMatrixBuffer = reserveBuffer(this.renderer, 16 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        this.luTintBuffer = reserveBuffer(this.renderer, 4 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    }

    updateLocals() {
        this.renderer.queue.writeBuffer(this.luModelMatrixBuffer, 0, this.general.modelViewMatrixBytes);
        this.renderer.queue.writeBuffer(this.luTintBuffer, 0, this.material.tint);
    }

    draw(): void {
        const encoder = this.renderer.passEncoder;
        if (!encoder) throw 'Encoder currently undefined!';

        // activate/actualize pipeline
        this.renderer.activePipeline.activate();
        this.renderer.activePipeline.update();

        encoder.setBindGroup(
            0,
            this.renderer.activePipeline.requestBindGroup([
                { binding: 2, resource: { buffer: this.luModelMatrixBuffer } },
                { binding: 3, resource: { buffer: this.luTintBuffer } },
                // diffuse
                { binding: 4, resource: this.texture.sampler },
                { binding: 5, resource: this.texture.texture.createView() }
            ])
        );

        this.updateLocals();

        // draw geometry
        this.mesh.draw();
    }
}
