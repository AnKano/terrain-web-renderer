import { IMeshAdapter } from '../generic/IMeshAdapter';
import { IModelAdapter } from '../generic/IModelAdapter';
import WebGLRenderer from './WebGLRenderer';
import { Model } from '../abstract/Model';
import { WebGLMesh } from './WebGLMesh';

export class WebGLModelAdapter extends IModelAdapter {
    private readonly renderer: WebGLRenderer;
    private readonly ctx: WebGL2RenderingContext;

    private readonly mesh: IMeshAdapter;

    private readonly localUniformModelMatrixLoc: WebGLUniformLocation;
    private readonly localUniformTintArrayLoc: WebGLUniformLocation;

    constructor(renderer: WebGLRenderer, modelDescription: Model) {
        super(modelDescription);

        this.renderer = renderer;
        this.ctx = this.renderer.ctx;

        this.mesh = new WebGLMesh(renderer, modelDescription.mesh);

        this.localUniformModelMatrixLoc =
            this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'modelMatrix');
        this.localUniformTintArrayLoc = this.ctx.getUniformLocation(this.renderer.activePipeline.program, 'tintArray');
    }

    updateLocals() {
        this.ctx.uniformMatrix4fv(this.localUniformModelMatrixLoc, false, this.general.modelViewMatrixBytes);
        const val = Math.random();
        this.ctx.uniform4fv(this.localUniformTintArrayLoc, new Float32Array([val, val, val, 1.0]));
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
