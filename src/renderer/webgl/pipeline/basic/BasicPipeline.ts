import * as vertShader from './sources/basic.vert.glsl';
import * as fragShader from './sources/basic.frag.glsl';

import {IWebGLPipeline} from "../IWebGLPipeline";
import {PipelineProgramBuilder} from "../helpers/PipelineProgramBuilder";
import Renderer from "../../Renderer";

export class BasicPipeline extends IWebGLPipeline {
    private readonly localUniformViewMatrixLoc: WebGLUniformLocation;
    private readonly localUniformPrjMatrixLoc: WebGLUniformLocation;

    constructor(renderer: Renderer) {
        super(renderer);

        const builder = new PipelineProgramBuilder(this.ctx);
        builder.addVertexShader(vertShader);
        builder.addFragmentShader(fragShader);

        this.program = builder.build();

        this.localUniformPrjMatrixLoc = this.ctx.getUniformLocation(this.program, 'prjMatrix');
        this.localUniformViewMatrixLoc = this.ctx.getUniformLocation(this.program, 'viewMatrix');
    }

    protected update(): void {
        // update globals like camera matrices
        this.ctx.uniformMatrix4fv(this.localUniformPrjMatrixLoc, false, this.renderer.camera.projectionMatrixBytes);
        this.ctx.uniformMatrix4fv(this.localUniformViewMatrixLoc, false, this.renderer.camera.viewMatrixBytes);
    }
}