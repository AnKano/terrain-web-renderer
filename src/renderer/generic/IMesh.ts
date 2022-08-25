export abstract class IMesh {
    public abstract declareAttributeBuffer(index: number, data: TypedArray, elementsForEachVtx: number): void;

    public abstract declareIndexBuffer(data: Uint32Array): void;
    
    public abstract draw(): void;
}

export class WebGLMesh extends IMesh {
    private readonly ctx: WebGL2RenderingContext;

    private readonly vao: WebGLVertexArrayObject;
    private readonly attributeBuffers: { [idx: number]: WebGLBuffer };
    private indicesBuffer: WebGLBuffer;
    private indicesBufferLength: number;

    constructor(context: WebGL2RenderingContext) {
        super();

        this.attributeBuffers = {};

        this.ctx = context;
        this.vao = this.ctx.createVertexArray();
    }

    declareAttributeBuffer(index: number, data: TypedArray, elementsForEachVtx: number) {
        // bind VAO
        this.ctx.bindVertexArray(this.vao);

        // select VAO attribute by provided index
        this.ctx.enableVertexAttribArray(index);

        const buffer = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, data, this.ctx.STATIC_DRAW);
        this.ctx.vertexAttribPointer(index, elementsForEachVtx, this.ctx.FLOAT, false, 0, 0);

        this.attributeBuffers[index] = buffer;

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
    }

    draw() {
        // bind VAO
        this.ctx.bindVertexArray(this.vao);

        this.ctx.drawElements(this.ctx.TRIANGLES, this.indicesBufferLength, this.ctx.UNSIGNED_INT, 0);

        // unbind VAO
        this.ctx.bindVertexArray(null);
    }
}
