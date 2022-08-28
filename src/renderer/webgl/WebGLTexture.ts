import { ITextureAdapter } from '../abstract/ITextureAdapter';
import WebGLRenderer from './WebGLRenderer';
import { Texture } from '../generic/Texture';

export class WebGLTex extends ITextureAdapter {
    private ctx: WebGL2RenderingContext;
    private renderer: WebGLRenderer;

    private general: Texture;

    private _texture: WebGLTexture;

    constructor(renderer: WebGLRenderer, texture: Texture) {
        super();

        this.renderer = renderer;
        this.ctx = renderer.ctx;

        this.general = texture;

        this.createFromArrayBuffer(new Uint8Array([0, 0, 0, 255]));

        texture.loadPromise.then(() => {
            this.createFromBitmap(this.general.data);
        });
    }

    protected createFromArrayBuffer(buffer: ArrayBufferView, width: number = 1, height: number = 1): void {
        const texture = this.createDefaultTexture();

        this.ctx.activeTexture(this.ctx.TEXTURE0 + 0);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);

        this.ctx.texImage2D(
            this.ctx.TEXTURE_2D,
            0,
            this.ctx.RGBA,
            width,
            height,
            0,
            this.ctx.RGBA,
            this.ctx.UNSIGNED_BYTE,
            buffer
        );

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);

        this._texture = texture;
    }

    protected createFromBitmap(source: ImageBitmap): void {
        const texture = this.ctx.createTexture();

        this.ctx.activeTexture(this.ctx.TEXTURE0 + 0);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);

        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);

        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, source);

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);

        this._texture = texture;
    }

    destroy(): void {
        this.ctx.deleteTexture(this._texture);
    }

    reserveTexture(width: number, height: number): void {
        const texture = this.createDefaultTexture();

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this._texture);
        this.ctx.texImage2D(
            this.ctx.TEXTURE_2D,
            0,
            this.ctx.RGBA,
            width,
            height,
            0,
            this.ctx.RGBA,
            this.ctx.UNSIGNED_BYTE,
            null
        );
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);

        this._texture = texture;
    }

    private createDefaultTexture(): WebGLTexture {
        const texture = this.ctx.createTexture();

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);

        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
        this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);

        return texture;
    }

    get texture(): WebGLTexture {
        return this._texture;
    }
}
