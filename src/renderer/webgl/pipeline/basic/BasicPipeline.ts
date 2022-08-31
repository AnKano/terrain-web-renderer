import * as vertShader from './sources/basic.vert.glsl';
import * as fragShader from './sources/basic.frag.glsl';

import WebGLRenderer from '../../WebGLRenderer';
import { IWebGLPipeline } from '../IWebGLPipeline';
import { PipelineProgramBuilder } from '../helpers/PipelineProgramBuilder';
import { WebGLTex } from '../../WebGLTexture';
import { WebGLModelAdapter } from '../../WebGLModelAdapter';
import { BasicMaterial } from '../../../generic/materials/BasicMaterial';
import { IPipelineMaterialLogic } from '../../../abstract/IPipelineMaterialLogic';

export class BasicPipeline extends IWebGLPipeline {
    static instance: BasicPipeline | null = null;

    private readonly luViewMatrixLoc: WebGLUniformLocation;
    private readonly luPrjMatrixLoc: WebGLUniformLocation;

    private constructor(renderer: WebGLRenderer) {
        super(renderer);

        const builder = new PipelineProgramBuilder(this.ctx);
        builder.addVertexShader(vertShader);
        builder.addFragmentShader(fragShader);

        this.program = builder.build();

        this.luPrjMatrixLoc = this.ctx.getUniformLocation(this.program, 'prjMatrix');
        this.luViewMatrixLoc = this.ctx.getUniformLocation(this.program, 'viewMatrix');
    }

    static activate(renderer: WebGLRenderer): BasicPipeline {
        if (this.instance == null) this.instance = new BasicPipeline(renderer);
        return this.instance;
    }

    public update(): void {
        // update globals like camera matrices
        this.ctx.uniformMatrix4fv(this.luPrjMatrixLoc, false, this.renderer.camera.projectionMatrixBytes);
        this.ctx.uniformMatrix4fv(this.luViewMatrixLoc, false, this.renderer.camera.viewMatrixBytes);
    }

    producePipelineMaterialLogic(renderer: WebGLRenderer, model: WebGLModelAdapter): IPipelineMaterialLogic {
        return new BasicPipelineMaterialLogic(renderer, model);
    }
}

export class BasicPipelineMaterialLogic extends IPipelineMaterialLogic {
    private diffuseTexture: WebGLTex;
    private tint: Float32Array | null;
    private tintCoefficient: number;

    private readonly ctx: WebGL2RenderingContext;
    private readonly renderer: WebGLRenderer;
    private readonly model: WebGLModelAdapter;
    private readonly material: BasicMaterial;

    private readonly luTintArrayLoc: WebGLUniformLocation;
    private readonly luTintCoefficientLoc: WebGLUniformLocation;
    private readonly luDiffuseLoc: WebGLUniformLocation;

    constructor(renderer: WebGLRenderer, model: WebGLModelAdapter) {
        super();

        this.ctx = renderer.ctx;
        this.renderer = renderer;
        this.model = model;
        this.material = this.model.material as BasicMaterial;

        this.tint = this.material.tint;
        this.tintCoefficient = this.material.tintCoefficient;
        this.diffuseTexture = new WebGLTex(renderer, this.material.diffuse);

        const pipeline = this.model.activePipeline;
        this.luTintArrayLoc = this.renderer.ctx.getUniformLocation(pipeline.program, 'tintArray');
        this.luTintCoefficientLoc = this.renderer.ctx.getUniformLocation(pipeline.program, 'tintCoefficient');
        this.luDiffuseLoc = this.renderer.ctx.getUniformLocation(pipeline.program, 'diffuse');
    }

    updateLocals(): void {
        if (this.tint != this.material.tint) this.tint = this.material.tint;

        if (this.tintCoefficient != this.material.tintCoefficient) this.tintCoefficient = this.material.tintCoefficient;

        if (this.diffuseTexture.general != this.material.diffuse)
            this.diffuseTexture = new WebGLTex(this.renderer, this.material.diffuse);

        // set tint color
        this.ctx.uniform4fv(this.luTintArrayLoc, this.tint);
        // set and update tint intensive
        this.ctx.uniform1f(this.luTintCoefficientLoc, this.tintCoefficient);

        // set diffuse
        this.ctx.activeTexture(this.ctx.TEXTURE0 + 0);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.diffuseTexture.texture);
        this.ctx.uniform1i(this.luDiffuseLoc, 0);
    }
}
