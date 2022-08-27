import { IWebGLPipeline } from './pipeline/IWebGLPipeline';
import { IMesh } from '../generic/IMesh';
import { IModel } from '../generic/IModel';
import Renderer from "./Renderer";

export class Model extends IModel {
    private readonly renderer: Renderer;
    private readonly ctx: WebGL2RenderingContext;

    private readonly mesh: IMesh;
    private readonly pipeline: IWebGLPipeline;

    private readonly localUniformModelMatrixLoc: WebGLUniformLocation;
    private readonly localUniformTintArrayLoc: WebGLUniformLocation;

    constructor(renderer: Renderer, pipeline: IWebGLPipeline, mesh: IMesh) {
        super();

        this.renderer = renderer;
        this.ctx = this.renderer.ctx;

        this.pipeline = pipeline;
        this.mesh = mesh;

        this.localUniformModelMatrixLoc = this.ctx.getUniformLocation(this.pipeline.program, 'modelMatrix');
        this.localUniformTintArrayLoc = this.ctx.getUniformLocation(this.pipeline.program, 'tintArray');
    }

    updateLocals() {
        this.ctx.uniformMatrix4fv(this.localUniformModelMatrixLoc, false, this.modelViewMatrixBytes);
        const val = Math.random();
        this.ctx.uniform4fv(this.localUniformTintArrayLoc, new Float32Array([val, val, val, 1.0]));
    }

    draw(): void {
        // activate related pipeline
        this.pipeline.activate();
        this.pipeline.update();

        // set local pipeline variables
        this.updateLocals();

        // draw mesh geometry
        this.mesh.draw();
    }
}
