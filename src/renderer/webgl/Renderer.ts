import IRenderer from '../IRenderer';
import { BasicPipeline } from './pipeline/basic/BasicPipeline';
import { Camera } from '../generic/Camera';
import { Mesh } from './Mesh';
import { Model } from './Model';

export default class Renderer extends IRenderer {
    ctx: WebGL2RenderingContext;

    model: Model;
    basicPipeline: BasicPipeline;
    camera: Camera;

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

        this.camera = new Camera([10.0, 10.0, 10.0], [0.0, 0.0, 0.0]);

        // !TODO: delete after
        this.basicPipeline = new BasicPipeline(this);

        const vtxs = new Float32Array([-1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, -1.0]);
        // const normals = new Float32Array([0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
        const uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
        const indices = new Uint32Array([0, 1, 2, 0, 2, 3, 2, 1, 0, 3, 2, 0]);

        const mesh = new Mesh(this.ctx);
        mesh.declareAttributeBuffer(0, vtxs, 3);
        // mesh.declareAttributeBuffer(1, normals, 3);
        mesh.declareAttributeBuffer(1, uvs, 2);
        mesh.declareIndexBuffer(indices);

        this.model = new Model(this, this.basicPipeline, mesh);
    }

    protected prepareTarget() {
        this.ctx.viewport(0, 0, this.canvasDimension[0], this.canvasDimension[1]);
        this.ctx.scissor(0, 0, this.canvasDimension[0], this.canvasDimension[1]);

        this.ctx.clearColor(Math.sin(new Date().getTime() / 500.0), 0.5, 1.0, 1.0);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    render() {
        this.updateCanvas();
        this.prepareTarget();

        this.model.rotation[1] += 0.05;
        this.model.rotation[2] += 0.05;

        // update camera
        this.camera.update(this.canvasDimension[0], this.canvasDimension[1]);

        // draw
        this.model.draw();
    }
}
