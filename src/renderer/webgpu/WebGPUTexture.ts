import { ITextureAdapter } from '../abstract/ITextureAdapter';
import WebGPURenderer from './WebGPURenderer';
import {Texture} from "../generic/Texture";

export class WebGPUTex extends ITextureAdapter {
    private renderer: WebGPURenderer;

    private general: Texture;

    private _texture: GPUTexture;
    private readonly _sampler: GPUSampler;

    constructor(renderer: WebGPURenderer, texture: Texture) {
        super();

        this.renderer = renderer;

        this.general = texture;

        this._sampler = this.renderer.device.createSampler({magFilter: 'linear', minFilter: 'linear'});
        this.createFromArrayBuffer(new Uint8Array([0, 0, 0, 255]));

        texture.loadPromise.then(() => {
            this.createFromBitmap(this.general.data);
        });
    }

    protected createFromArrayBuffer(buffer: ArrayBufferView, width: number = 1, height: number = 1): void {
        // destroy placeholder or old texture
        if (this._texture !== undefined) this._texture.destroy();

        this._texture = this.renderer.device.createTexture({
            size: { width: width, height: height },
            dimension: '2d',
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        this.renderer.queue.writeTexture(
            { texture: this._texture }, buffer, { offset: 0 }, [width, height]
        );
    }

    protected createFromBitmap(source: ImageBitmap): void {
        // destroy placeholder or old texture
        if (this._texture !== undefined) this.texture.destroy();

        this._texture = this.renderer.device.createTexture({
            size: { width: source.width, height: source.height },
            dimension: '2d',
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        this.renderer.queue.copyExternalImageToTexture(
            { source: source }, { texture: this._texture }, [source.width, source.height]
        );
    }

    destroy(): void {
        //!TODO: what to do with sampler?!
        this._texture.destroy();
    }

    reserveTexture(width: number, height: number): void {
        this._texture.destroy();
        this._texture = this.renderer.device.createTexture({
            size: [width, height],
            sampleCount: 1,
            dimension: '2d',
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });
    }

    get texture(): GPUTexture {
        return this._texture;
    }

    get sampler(): GPUSampler {
        return this._sampler;
    }
}
