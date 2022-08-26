export abstract class IMesh {
    public abstract declareAttributeBuffer(
        index: number,
        data: Float32Array | Uint32Array,
        elementsForEachVtx: number
    ): void;

    public abstract declareIndexBuffer(data: Uint32Array): void;

    public abstract draw(): void;
}
