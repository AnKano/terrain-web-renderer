import {IWebGLPipeline} from "./pipeline/IWebGLPipeline";
import {IMesh} from "../generic/IMesh";
import {IModel} from "../generic/IModel";

export class WebGLModel extends IModel {
    private readonly ctx: WebGL2RenderingContext;

    private readonly pipeline: IWebGLPipeline;
    private readonly mesh: IMesh;

    private readonly localUniformModelMatrixLoc: WebGLUniformLocation;
    private readonly localUniformtintArrayLoc: WebGLUniformLocation;

    constructor(context: WebGL2RenderingContext, pipeline: IWebGLPipeline, mesh: IMesh) {
        super();

        this.ctx = context;

        this.pipeline = pipeline;
        this.mesh = mesh;

        this.localUniformModelMatrixLoc = this.ctx.getUniformLocation(this.pipeline.program, 'modelMatrix');
        this.localUniformtintArrayLoc = this.ctx.getUniformLocation(this.pipeline.program, 'tintArray');
    }

    draw(): void {
        // activate related pipeline
        this.pipeline.activate();

        // set local pipeline variables
        this.ctx.uniformMatrix4fv(this.localUniformModelMatrixLoc, false, this.modelViewMatrixBytes);
        const val = Math.random();
        this.ctx.uniform4fv(this.localUniformtintArrayLoc, new Float32Array([val, val, val, 1.0]));

        // draw mesh geometry
        this.mesh.draw();
    }
}
