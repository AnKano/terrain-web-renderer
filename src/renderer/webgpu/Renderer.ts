import IRenderer from '../IRenderer';
import {WebGPUMesh} from "./Mesh";
import {WebGPUModel} from "./Model";
import {Camera} from "../generic/Camera";
import {BasicPipeline} from "./pipeline/basic/BasicPipeline";

export default class Renderer extends IRenderer {
    context: GPUCanvasContext;

    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    // store target textures in class variables
    renderTargetView: GPUTextureView;
    depthTextureView: GPUTextureView;

    cmdEncoder: GPUCommandEncoder;
    passEncoder: GPURenderPassEncoder;

    model: WebGPUModel;
    basicPipeline: BasicPipeline;
    camera: Camera;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    async init() {
        console.info('Instantiate WebGPU renderer');

        const entry = navigator.gpu;
        if (!entry) throw 'This browser not support WebGPU!';

        this.adapter = await entry.requestAdapter();
        if (!this.adapter) throw "This browser support WebGPU but it's disabled!";

        this.device = await this.adapter.requestDevice();
        this.queue = this.device.queue;

        this.context = this.canvas.getContext('webgpu');

        this.camera = new Camera([10.0, 10.0, 10.0], [0.0, 0.0, 0.0]);

        // !TODO: delete after
        const vtxs = new Float32Array([-1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, -1.0]);
        const uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
        const indices = new Uint32Array([0, 1, 2, 0, 2, 3, 2, 1, 0, 3, 2, 0]);

        this.basicPipeline = new BasicPipeline(this);

        const mesh = new WebGPUMesh(this);
        mesh.declareAttributeBuffer(0, vtxs, 3);
        mesh.declareAttributeBuffer(1, uvs, 2);
        mesh.declareIndexBuffer(indices);

        this.model = new WebGPUModel(this, this.basicPipeline, mesh);
    }

    private updateSwapchain(): void {
        if (!this.updateCanvas()) return;

        // if width and height was changed
        // recreate depth and color targets

        this.context.configure({
            device: this.device,
            format: 'rgba8unorm',
            alphaMode: 'opaque',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        const renderTargetTexture = this.device.createTexture({
            size: this.canvasDimension,
            sampleCount: this.canvasSamples,
            dimension: '2d',
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.renderTargetView = renderTargetTexture.createView();

        const depthTargetTexture = this.device.createTexture({
            size: this.canvasDimension,
            sampleCount: this.canvasSamples,
            dimension: '2d',
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
        this.depthTextureView = depthTargetTexture.createView();
    }

    private buildRenderPassDescriptor(): GPURenderPassDescriptor {
        const colorAttachment: GPURenderPassColorAttachment = {
            resolveTarget: this.context.getCurrentTexture().createView(),
            view: this.renderTargetView,
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: [1.0, 0.5, Math.sin(new Date().getTime() / 500.0), 1.0]
        };
        const depthAttachment: GPURenderPassDepthStencilAttachment = {
            view: this.depthTextureView,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
            stencilLoadOp: 'clear',
            stencilStoreOp: 'store'
        };

        return {
            colorAttachments: [colorAttachment],
            depthStencilAttachment: depthAttachment
        };
    }

    render(): void {
        this.updateSwapchain();

        const renderPassDesc = this.buildRenderPassDescriptor();

        this.cmdEncoder = this.device.createCommandEncoder();
        this.passEncoder = this.cmdEncoder.beginRenderPass(renderPassDesc);

        this.passEncoder.setViewport(0, 0, this.canvasDimension[0], this.canvasDimension[1], 0, 1);
        this.passEncoder.setScissorRect(0, 0, this.canvasDimension[0], this.canvasDimension[1]);

        // draw
        this.model.rotation[1] += 0.05;
        this.model.rotation[2] += 0.05;

        // update camera
        this.camera.update(this.canvasDimension[0], this.canvasDimension[1]);

        // draw
        this.model.draw();

        this.passEncoder.end();
        this.queue.submit([this.cmdEncoder.finish()]);

        // unset encoder
        this.cmdEncoder = null;
    }
}
