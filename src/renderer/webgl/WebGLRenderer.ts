import IRenderer, { RenderType } from '../IRenderer';
import { BasicPipeline } from './pipeline/basic/BasicPipeline';
import { WebGLModelAdapter } from './WebGLModelAdapter';
import { Scene } from '../Scene';
import { ICamera } from '../generic/camera/ICamera';

export default class WebGLRenderer extends IRenderer {
    readonly TYPE: RenderType = RenderType.WebGL;

    ctx: WebGL2RenderingContext;

    activePipeline: BasicPipeline;
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

        // !TODO: delete after
        this.activePipeline = new BasicPipeline(this);
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
            if (!model.specificModels.has(this.TYPE))
                model.specificModels.set(this.TYPE, new WebGLModelAdapter(this, model));

            model.rotation[1] += 0.05;
            model.rotation[2] += 0.05;

            model.specificModels.get(this.TYPE).draw();
        });

        this.endRender();
        this.camera = null;
    }
}
