import { IModelAdapter } from '../abstract/IModelAdapter';
import WebGLRenderer from './WebGLRenderer';
import { Model } from '../generic/Model';
import { WebGLMesh } from './WebGLMesh';
import { IWebGLPipeline } from './pipeline/IWebGLPipeline';
import { IMaterial } from '../generic/materials/IMaterial';
import { IPipelineMaterialLogic } from '../abstract/IPipelineMaterialLogic';

export class WebGLModelAdapter extends IModelAdapter {
    private readonly renderer: WebGLRenderer;
    private readonly ctx: WebGL2RenderingContext;

    private readonly _mesh: WebGLMesh;
    private readonly logic: IPipelineMaterialLogic;
    private readonly _material: IMaterial;
    private _activePipeline: IWebGLPipeline;

    private luModelMatrixLoc: WebGLUniformLocation;

    constructor(renderer: WebGLRenderer, description: Model) {
        super(description);

        this.renderer = renderer;
        this.ctx = this.renderer.ctx;

        this._mesh = new WebGLMesh(renderer, description.mesh);
        this._material = description.material;

        this.invokePipeline();
        this.logic = this._activePipeline.producePipelineMaterialLogic(this.renderer, this);
    }

    protected invokePipeline(): void {
        const pipelineFunction = this._material.shaders.get(this.renderer.TYPE).bind(this);
        this._activePipeline = pipelineFunction(this.renderer) as IWebGLPipeline;
    }

    updateLocals() {
        this.luModelMatrixLoc = this.ctx.getUniformLocation(this._activePipeline.program, 'modelMatrix');
        this.ctx.uniformMatrix4fv(this.luModelMatrixLoc, false, this.general.modelViewMatrixBytes);
    }

    draw(): void {
        // activate related pipeline
        this.invokePipeline();
        this._activePipeline.activate();
        this._activePipeline.update();

        // set local pipeline variables related to material
        this.logic.updateLocals();
        // set local pipeline variables related to model
        this.updateLocals();

        // draw mesh geometry
        this._mesh.draw();
    }

    get mesh(): WebGLMesh {
        return this._mesh;
    }

    get material(): IMaterial {
        return this._material;
    }

    get activePipeline(): IWebGLPipeline {
        return this._activePipeline;
    }
}
