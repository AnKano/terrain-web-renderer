import IRenderer, { RenderType } from '../IRenderer';
import { WebGLModelAdapter } from './WebGLModelAdapter';
import { Scene } from '../Scene';
import { ICamera } from '../generic/camera/ICamera';

export default class WebGLRenderer extends IRenderer {
    readonly TYPE: RenderType = RenderType.WebGL;

    ctx: WebGL2RenderingContext;

    camera: ICamera;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    async init() {
        console.info('Instantiate WebGL renderer');

        this.ctx = this.canvas.getContext('webgl2');

        // additional webgl2 setup
        // in webgl we should configure it globally not in pipeline
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.enable(this.ctx.CULL_FACE);
        this.ctx.cullFace(this.ctx.FRONT);
    }

    protected startRender() {
        this.ctx.viewport(0, 0, this.canvasDimension[0], this.canvasDimension[1]);
        this.ctx.scissor(0, 0, this.canvasDimension[0], this.canvasDimension[1]);

        this.ctx.clearColor(Math.sin(new Date().getTime() / 500.0), 0.5, 1.0, 1.0);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    protected endRender(): void {
        // do nothing, because WebGL is nice and cute UwU
    }

    render(scene: Scene, camera: ICamera) {
        this.updateCanvas();

        this.startRender();

        // update camera
        this.camera = camera;
        camera.update(this.canvasDimension[0], this.canvasDimension[1]);

        // draw scene
        scene.models.forEach((model) => {
            if (!model.specifics.has(this.TYPE)) model.specifics.set(this.TYPE, new WebGLModelAdapter(this, model));
            model.specifics.get(this.TYPE).draw();
        });

        this.endRender();
        this.camera = null;
    }
}
