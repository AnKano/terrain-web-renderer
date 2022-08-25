import IRenderer from './renderer/IRenderer';
import WebGLRenderer from './renderer/webgl/Renderer';
import WebGPURenderer from './renderer/webgpu/Renderer';

export enum RendererMode {
    WebGL,
    WebGPU
}

export default class GeoScene {
    renderer: IRenderer | null;

    constructor() {
        this.renderer = null;
    }

    setRenderer(type: RendererMode, canvas: HTMLCanvasElement) {
        switch (type) {
            case RendererMode.WebGL:
                this.renderer = new WebGLRenderer(canvas);
                break;
            case RendererMode.WebGPU:
                this.renderer = new WebGPURenderer(canvas);
                break;
            default:
                throw 'Undefined renderer type!';
        }
        return this;
    }

    async start() {
        if (this.renderer) {
            // initialize rendering context
            await this.renderer.init();
        } else throw 'Renderer not defined!';

        this.performLoopStep();
    }

    private performLoopStep() {
        // update logic

        // update render state
        this.renderer.render();

        // request next animation frame
        window.requestAnimationFrame(this.performLoopStep.bind(this));
    }
}
