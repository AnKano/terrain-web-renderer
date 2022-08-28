import * as vertShader from './sources/basic.vert.glsl';
import * as fragShader from './sources/basic.frag.glsl';

import WebGLRenderer from '../../WebGLRenderer';
import { IWebGLPipeline } from '../IWebGLPipeline';
import { PipelineProgramBuilder } from '../helpers/PipelineProgramBuilder';

export class BasicPipeline extends IWebGLPipeline {
    private readonly luViewMatrixLoc: WebGLUniformLocation;
    private readonly luPrjMatrixLoc: WebGLUniformLocation;

    constructor(renderer: WebGLRenderer) {
        super(renderer);

        const builder = new PipelineProgramBuilder(this.ctx);
        builder.addVertexShader(vertShader);
        builder.addFragmentShader(fragShader);

        this.program = builder.build();

        this.luPrjMatrixLoc = this.ctx.getUniformLocation(this.program, 'prjMatrix');
        this.luViewMatrixLoc = this.ctx.getUniformLocation(this.program, 'viewMatrix');
    }

    public update(): void {
        // update globals like camera matrices
        this.ctx.uniformMatrix4fv(this.luPrjMatrixLoc, false, this.renderer.camera.projectionMatrixBytes);
        this.ctx.uniformMatrix4fv(this.luViewMatrixLoc, false, this.renderer.camera.viewMatrixBytes);
    }
}