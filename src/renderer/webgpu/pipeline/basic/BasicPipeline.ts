import * as vertShader from './sources/basic.vert.wgsl';
import * as fragShader from './sources/basic.frag.wgsl';

import WebGPURenderer from '../../WebGPURenderer';
import {IWebGPUPipeline} from '../IWebGPUPipeline';
import {reserveBuffer} from '../../utils/Utils';
import {IPipelineMaterialLogic, IWebGPUPipelineMaterialLogic} from '../../../abstract/IPipelineMaterialLogic';
import {WebGPUModelAdapter} from '../../WebGPUModelAdapter';
import {WebGPUTex} from '../../WebGPUTexture';
import {BasicMaterial} from '../../../generic/materials/BasicMaterial';

export class BasicPipeline extends IWebGPUPipeline {
    static instance: BasicPipeline | null = null;

    private readonly guProjMatrixBuffer: GPUBuffer;
    private readonly guViewMatrixBuffer: GPUBuffer;

    private constructor(renderer: WebGPURenderer) {
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

    static activate(renderer: WebGPURenderer): BasicPipeline {
        if (this.instance == null) this.instance = new BasicPipeline(renderer);
        return this.instance;
    }

    private createBindGroupLayoutGlobals() {
        this.globalUniforms = [
            {binding: 0, resource: {buffer: this.guProjMatrixBuffer}},
            {binding: 1, resource: {buffer: this.guViewMatrixBuffer}}
        ];
    }

    private createBindGroup(): void {
        const positionBufferDesc: GPUVertexBufferLayout = {
            attributes: [{shaderLocation: 0, offset: 0, format: 'float32x3'}],
            arrayStride: 4 * 3,
            stepMode: 'vertex'
        };
        const uvBufferDesc: GPUVertexBufferLayout = {
            attributes: [{shaderLocation: 1, offset: 0, format: 'float32x2'}],
            arrayStride: 4 * 2,
            stepMode: 'vertex'
        };

        // vertex stage description
        const vertex: GPUVertexState = {
            module: this.renderer.device.createShaderModule({code: vertShader}),
            entryPoint: 'main',
            buffers: [positionBufferDesc, uvBufferDesc]
        };

        // fragment stage description
        const fragment: GPUFragmentState = {
            module: this.renderer.device.createShaderModule({code: fragShader}),
            entryPoint: 'main',
            targets: [{format: 'rgba8unorm'}]
        };

        // misc description
        const primitive: GPUPrimitiveState = {frontFace: 'cw', cullMode: 'none', topology: 'triangle-list'};
        const depthStencil: GPUDepthStencilState = {
            depthWriteEnabled: true,
            depthCompare: 'less-equal',
            format: 'depth24plus-stencil8'
        };

        this.uniformBindGroupLayout = this.renderer.device.createBindGroupLayout({
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                {binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
                {binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
                // diffuse
                {binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 6, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}}
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
            multisample: {count: 4}
        });
    }

    public update(): void {
        this.renderer.queue.writeBuffer(this.guProjMatrixBuffer, 0, this.renderer.camera.projectionMatrixBytes);
        this.renderer.queue.writeBuffer(this.guViewMatrixBuffer, 0, this.renderer.camera.viewMatrixBytes);
    }

    public producePipelineMaterialLogic(renderer: WebGPURenderer, model: WebGPUModelAdapter): IPipelineMaterialLogic {
        return new BasicPipelineMaterialLogic(renderer, model);
    }
}

export class BasicPipelineMaterialLogic extends IWebGPUPipelineMaterialLogic {
    private diffuseTexture: WebGPUTex;
    private tint: Float32Array | null;
    private tintCoefficient: number;

    private renderer: WebGPURenderer;
    private model: WebGPUModelAdapter;
    private readonly material: BasicMaterial;

    private readonly luTintBuffer: GPUBuffer;
    private readonly luTintCoefficientLoc: GPUBuffer;

    constructor(renderer: WebGPURenderer, model: WebGPUModelAdapter) {
        super();

        this.renderer = renderer;

        this.luTintBuffer = reserveBuffer(this.renderer, 4 * 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        this.luTintCoefficientLoc = reserveBuffer(this.renderer, 4  *4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

        this.model = model;
        this.material = this.model.material as BasicMaterial;

        this.diffuseTexture = new WebGPUTex(renderer, this.material.diffuse);
    }

    updateLocals(): void {
        if (this.tint != this.material.tint)
            this.tint = this.material.tint;

        if (this.tintCoefficient != this.material.tintCoefficient)
            this.tintCoefficient = this.material.tintCoefficient;

        if (this.diffuseTexture.general != this.material.diffuse)
            this.diffuseTexture = new WebGPUTex(this.renderer, this.material.diffuse);

        this.renderer.queue.writeBuffer(this.luTintBuffer, 0, this.tint);

        // write f32 value with padding (everything should be padded to 16 bytes)
        this.renderer.queue.writeBuffer(this.luTintCoefficientLoc, 0,
            new Float32Array([this.tintCoefficient, 0, 0, 0]));
    }

    requestBindGroup(): GPUBindGroupEntry[] {
        return [
            {binding: 3, resource: {buffer: this.luTintBuffer}},
            {binding: 4, resource: {buffer: this.luTintCoefficientLoc}},
            {binding: 5, resource: this.diffuseTexture.sampler},
            {binding: 6, resource: this.diffuseTexture.texture.createView()}
        ];
    }
}
