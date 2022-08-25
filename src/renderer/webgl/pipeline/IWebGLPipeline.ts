import {IPipeline} from "../../generic/IPipeline";
import Renderer from "../Renderer";

export abstract class IWebGLPipeline extends IPipeline {
    protected ctx: WebGL2RenderingContext;
    protected renderer: Renderer;

    private _program: WebGLProgram;

    protected constructor(renderer: Renderer) {
        super();

        this.ctx = renderer.ctx;
        this.renderer = renderer;
    }

    activate(): void {
        this.ctx.useProgram(this._program);
        this.update();
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