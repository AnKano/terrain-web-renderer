import { IPipeline } from '../../abstract/IPipeline';
import WebGLRenderer from '../WebGLRenderer';
import {WebGLModelAdapter} from "../WebGLModelAdapter";
import {IPipelineMaterialLogic} from "../../abstract/IPipelineMaterialLogic";

export abstract class IWebGLPipeline extends IPipeline {
    protected ctx: WebGL2RenderingContext;
    protected renderer: WebGLRenderer;

    private _program: WebGLProgram;

    protected constructor(renderer: WebGLRenderer) {
        super();

        this.ctx = renderer.ctx;
        this.renderer = renderer;
    }

    public abstract producePipelineMaterialLogic(renderer: WebGLRenderer, model: WebGLModelAdapter): IPipelineMaterialLogic;

    activate(): void {
        this.ctx.useProgram(this._program);
    }

    destroy(): void {
        this.ctx.deleteShader(this._program);
    }

    set program(value: WebGLProgram) {
        this._program = value;
    }

    get program(): WebGLProgram {
        return this._program;
    }
}