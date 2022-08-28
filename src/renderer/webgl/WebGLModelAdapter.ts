import { IMeshAdapter } from '../abstract/IMeshAdapter';
import { IModelAdapter } from '../abstract/IModelAdapter';
import WebGLRenderer from './WebGLRenderer';
import { Model } from '../generic/Model';
import { WebGLMesh } from './WebGLMesh';
import { WebGLTex } from './WebGLTexture';

export class WebGLModelAdapter extends IModelAdapter {
    private readonly renderer: WebGLRenderer;
    private readonly ctx: WebGL2RenderingContext;

    private readonly mesh: IMeshAdapter;

    private readonly tintValue: number[];

    private readonly luModelMatrixLoc: WebGLUniformLocation;
    private readonly luTintArrayLoc: WebGLUniformLocation;
    private readonly luDiffuseLoc: WebGLUniformLocation;

    constructor(renderer: WebGLRenderer, modelDescription: Model) {
        super(modelDescription);

        this.renderer = renderer;
        this.ctx = this.renderer.ctx;

        this.mesh = new WebGLMesh(renderer, modelDescription.mesh);

        this.luModelMatrixLoc = this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'modelMatrix');
        this.luTintArrayLoc = this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'tintArray');
        this.tintValue = [Math.random(), Math.random(), Math.random(), 1.0];

        this.luDiffuseLoc = this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'diffuse');
    }

    updateLocals() {
        this.ctx.uniformMatrix4fv(this.luModelMatrixLoc, false, this.general.modelViewMatrixBytes);
        this.ctx.uniform4fv(this.luTintArrayLoc, new Float32Array(this.tintValue));

        this.ctx.activeTexture(this.ctx.TEXTURE0 + 0);

        const specifics = this.general.texture.specifics;
        if (!specifics.has(this.renderer.TYPE))
            specifics.set(this.renderer.TYPE, new WebGLTex(this.renderer, this.general.texture));
        const tex = specifics.get(this.renderer.TYPE) as WebGLTex;

        this.ctx.bindTexture(this.ctx.TEXTURE_2D, tex.texture);

        this.ctx.uniform1i(this.luDiffuseLoc, 0);
    }

    draw(): void {
        // activate related pipeline
        this.renderer.activePipeline.activate();
        this.renderer.activePipeline.update();

        // set local pipeline variables
        this.updateLocals();

        // draw mesh geometry
        this.mesh.draw();
    }
}
