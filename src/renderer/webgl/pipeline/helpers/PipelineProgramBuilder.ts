export class PipelineProgramBuilder {
    private readonly ctx: WebGL2RenderingContext;

    private vertexShader: WebGLShader;
    private fragmentShader: WebGLShader;

    constructor(context: WebGL2RenderingContext) {
        this.ctx = context;
    }

    public produceShader(code: string, type: GLenum): WebGLShader {
        const shader = this.ctx.createShader(type);

        this.ctx.shaderSource(shader, code);
        this.ctx.compileShader(shader);
        if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS))
            throw new Error(this.ctx.getShaderInfoLog(shader));

        return shader;
    }

    public addVertexShader(code: string): void {
        this.vertexShader = this.produceShader(code, this.ctx.VERTEX_SHADER);
    }

    public addFragmentShader(code: string): void {
        this.fragmentShader =this.produceShader(code, this.ctx.FRAGMENT_SHADER);
    }

    public build(): WebGLProgram {
        const program = this.ctx.createProgram();

        this.ctx.attachShader(program, this.vertexShader);
        this.ctx.attachShader(program, this.fragmentShader);
        this.ctx.linkProgram(program);
        if (!this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS))
            throw new Error(this.ctx.getProgramInfoLog(program));

        this.ctx.detachShader(program, this.vertexShader);
        this.ctx.detachShader(program, this.fragmentShader);
        this.ctx.deleteShader(this.vertexShader);
        this.ctx.deleteShader(this.fragmentShader);

        return program;
    }
}
