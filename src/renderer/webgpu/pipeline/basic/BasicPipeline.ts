import * as vertShader from './sources/basic.vert.wgsl';
import * as fragShader from './sources/basic.frag.wgsl';

import WebGPURenderer from '../../WebGPURenderer';
import { IWebGPUPipeline } from '../IWebGPUPipeline';
import { reserveBuffer } from '../../utils/Utils';

export class BasicPipeline extends IWebGPUPipeline {
    private readonly guProjMatrixBuffer: GPUBuffer;
    private readonly guViewMatrixBuffer: GPUBuffer;

    constructor(renderer: WebGPURenderer) {
        super(renderer);

        // global pipeline buffers
        this.guProjMatrixBuffer = reserveBuffer(
            this.renderer,
            16 * 4,
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        );
        this.guViewMatrixBuffer = reserveBuffer(
            this.renderer,
            16 * 4,
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        );

        this.createBindGroupLayoutGlobals();
        this.createBindGroup();
    }

    private createBindGroupLayoutGlobals() {
        this.globalUniforms = [
            { binding: 0, resource: { buffer: this.guProjMatrixBuffer } },
            { binding: 1, resource: { buffer: this.guViewMatrixBuffer } }
        ];
    }

    private createBindGroup(): void {
        const positionBufferDesc: GPUVertexBufferLayout = {
            attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
            arrayStride: 4 * 3,
            stepMode: 'vertex'
        };
        const uvBufferDesc: GPUVertexBufferLayout = {
            attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x2' }],
            arrayStride: 4 * 2,
            stepMode: 'vertex'
        };

        // vertex stage description
        const vertex: GPUVertexState = {
            module: this.renderer.device.createShaderModule({ code: vertShader }),
            entryPoint: 'main',
            buffers: [positionBufferDesc, uvBufferDesc]
        };

        // fragment stage description
        const fragment: GPUFragmentState = {
            module: this.renderer.device.createShaderModule({ code: fragShader }),
            entryPoint: 'main',
            targets: [{ format: 'rgba8unorm' }]
        };

        // misc description
        const primitive: GPUPrimitiveState = { frontFace: 'cw', cullMode: 'none', topology: 'triangle-list' };
        const depthStencil: GPUDepthStencilState = {
            depthWriteEnabled: true,
            depthCompare: 'less-equal',
            format: 'depth24plus-stencil8'
        };

        this.uniformBindGroupLayout = this.renderer.device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                { binding: 2, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                // diffuse
                { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                { binding: 5, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }
            ]
        });

        const uniformLayout = this.renderer.device.createPipelineLayout({
            bindGroupLayouts: [this.uniformBindGroupLayout]
        });

        // bake pipeline
        this.pipeline = this.renderer.device.createRenderPipeline({
            vertex: vertex,
            fragment: fragment,
            primitive: primitive,
            depthStencil: depthStencil,
            layout: uniformLayout,
            multisample: { count: 4 }
        });
    }

    public update(): void {
        this.renderer.queue.writeBuffer(this.guProjMatrixBuffer, 0, this.renderer.camera.projectionMatrixBytes);
        this.renderer.queue.writeBuffer(this.guViewMatrixBuffer, 0, this.renderer.camera.viewMatrixBytes);
    }
}
