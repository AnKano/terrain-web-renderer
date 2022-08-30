import IRenderer, { RenderType } from '../IRenderer';
import { WebGPUModelAdapter } from './WebGPUModelAdapter';
import { Scene } from '../Scene';
import { ICamera } from '../generic/camera/ICamera';

export default class WebGPURenderer extends IRenderer {
    readonly TYPE: RenderType = RenderType.WebGPU;

    context: GPUCanvasContext;

    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    // store target textures in class variables
    renderTargetView: GPUTextureView;
    depthTextureView: GPUTextureView;

    cmdEncoder: GPUCommandEncoder;
    passEncoder: GPURenderPassEncoder;

    camera: ICamera;

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

    protected startRender() {
        const renderPassDesc = this.buildRenderPassDescriptor();

        this.cmdEncoder = this.device.createCommandEncoder();
        this.passEncoder = this.cmdEncoder.beginRenderPass(renderPassDesc);

        this.passEncoder.setViewport(0, 0, this.canvasDimension[0], this.canvasDimension[1], 0, 1);
        this.passEncoder.setScissorRect(0, 0, this.canvasDimension[0], this.canvasDimension[1]);
    }

    protected endRender(): void {
        this.passEncoder.end();
        this.queue.submit([this.cmdEncoder.finish()]);

        // unset encoder
        this.cmdEncoder = null;
    }

    render(scene: Scene, camera: ICamera): void {
        this.updateSwapchain();

        this.startRender();

        // update camera
        this.camera = camera;
        camera.update(this.canvasDimension[0], this.canvasDimension[1]);

        // draw scene
        scene.models.forEach((model) => {
            if (!model.specifics.has(this.TYPE))
                model.specifics.set(this.TYPE, new WebGPUModelAdapter(this, model));

            model.specifics.get(this.TYPE).draw();
        });

        // end frame rendering
        this.endRender();
        this.camera = null;
    }
}
