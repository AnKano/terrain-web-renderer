import IRenderer from '../IRenderer';

export default class Renderer extends IRenderer {
    // 🎞️ Frame Backings
    context: GPUCanvasContext;

    // ⚙️ WebGPU Data Structures
    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    // store target textures in class variables
    renderTargetView: GPUTextureView;
    depthTextureView: GPUTextureView;

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
            clearValue: [Math.sin(new Date().getTime() / 500.0), 0.5, 1.0, 1.0]
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

        const commandEncoder = this.device.createCommandEncoder();
        const pass = commandEncoder.beginRenderPass(renderPassDesc);

        pass.setViewport(0, 0, this.canvasDimension[0], this.canvasDimension[1], 0, 1);
        pass.setScissorRect(0, 0, this.canvasDimension[0], this.canvasDimension[1]);

        pass.end();
        this.queue.submit([commandEncoder.finish()]);
    }
}
