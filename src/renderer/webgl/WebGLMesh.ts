import { IMeshAdapter } from '../abstract/IMeshAdapter';
import { Mesh } from '../generic/Mesh';
import WebGLRenderer from './WebGLRenderer';

export class WebGLMesh extends IMeshAdapter {
    private readonly renderer: WebGLRenderer;
    private readonly ctx: WebGL2RenderingContext;

    private readonly vao: WebGLVertexArrayObject;
    private readonly attributeBuffers: Map<number, WebGLBuffer>;
    private indicesBuffer: WebGLBuffer;
    private indicesBufferLength: number;

    constructor(renderer: WebGLRenderer, meshDescription: Mesh) {
        super();

        this.renderer = renderer;
        this.ctx = renderer.ctx;

        this.attributeBuffers = new Map<number, GPUBuffer>();
        this.vao = renderer.ctx.createVertexArray();

        this.restoreMeshFromDescription(meshDescription);
    }

    private restoreMeshFromDescription(meshDescription: Mesh) {
        meshDescription.attributeBuffers.forEach((desc) => {
            this.declareAttributeBuffer(desc.index, desc.data, desc.elementsForVtx);
        });

        this.declareIndexBuffer(meshDescription.indexesBuffer);
    }

    declareAttributeBuffer(index: number, data: Float32Array | Uint32Array, elementsForEachVtx: number) {
        // bind VAO
        this.ctx.bindVertexArray(this.vao);

        // select VAO attribute by provided index
        this.ctx.enableVertexAttribArray(index);

        const buffer = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, data, this.ctx.STATIC_DRAW);
        this.ctx.vertexAttribPointer(index, elementsForEachVtx, this.ctx.FLOAT, false, 0, 0);

        this.attributeBuffers.set(index, buffer);

        // unbind VAO
        this.ctx.bindVertexArray(null);
    }

    declareIndexBuffer(data: Uint32Array) {
        // bind VAO
        this.ctx.bindVertexArray(this.vao);

        const buffer = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buffer);
        this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, data, this.ctx.STATIC_DRAW);

        // store buffer in class and calculate indices length
        this.indicesBuffer = buffer;
        this.indicesBufferLength = data.length;

        // unbind VAO
        this.ctx.bindVertexArray(null);
        console.log(this, this.vao)
    }

    draw() {

        // bind VAO
        this.ctx.bindVertexArray(this.vao);

        this.ctx.drawElements(this.ctx.TRIANGLES, this.indicesBufferLength, this.ctx.UNSIGNED_INT, 0);

        // unbind VAO
        this.ctx.bindVertexArray(null);
    }
}
