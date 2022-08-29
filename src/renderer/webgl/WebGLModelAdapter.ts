import { IModelAdapter } from '../abstract/IModelAdapter';
import WebGLRenderer from './WebGLRenderer';
import { Model } from '../generic/Model';
import { WebGLMesh } from './WebGLMesh';
import { WebGLTex } from './WebGLTexture';
import { BasicMaterial } from '../generic/materials/BasicMaterial';

export class WebGLModelAdapter extends IModelAdapter {
    private readonly renderer: WebGLRenderer;
    private readonly ctx: WebGL2RenderingContext;

    private readonly mesh: WebGLMesh;
    private readonly material: BasicMaterial;
    private readonly texture: WebGLTex;

    private readonly luModelMatrixLoc: WebGLUniformLocation;
    private readonly luTintArrayLoc: WebGLUniformLocation;
    private readonly luDiffuseLoc: WebGLUniformLocation;

    constructor(renderer: WebGLRenderer, description: Model) {
        super(description);

        this.renderer = renderer;
        this.ctx = this.renderer.ctx;

        this.mesh = new WebGLMesh(renderer, description.mesh);
        this.material = description.material as BasicMaterial;
        this.texture = new WebGLTex(renderer, this.material.texture);

        this.luModelMatrixLoc = this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'modelMatrix');
        this.luTintArrayLoc = this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'tintArray');
        this.luDiffuseLoc = this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'diffuse');
    }

    updateLocals() {
        this.ctx.uniformMatrix4fv(this.luModelMatrixLoc, false, this.general.modelViewMatrixBytes);
        this.ctx.uniform4fv(this.luTintArrayLoc, this.material.tint);

        this.ctx.activeTexture(this.ctx.TEXTURE0 + 0);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture.texture);

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
