type AttributeBufferDescription = {
    index: number;
    data: Float32Array | Uint32Array;
    elementsForVtx: number;
};

export class Mesh {
    private readonly _attributeBuffers: AttributeBufferDescription[];

    private _indexesBuffer: Uint32Array;
    private _indexesBufferLength: number;

    constructor() {
        this._attributeBuffers = [];
    }

    public declareAttributeBuffer(index: number, data: Float32Array | Uint32Array, elementsForVtx: number) {
        this._attributeBuffers.push({
            index: index,
            data: data,
            elementsForVtx: elementsForVtx
        });
    }

    public declareIndexBuffer(data: Uint32Array) {
        this._indexesBuffer = data;
        this._indexesBufferLength = data.length;
    }

    get attributeBuffers(): AttributeBufferDescription[] {
        return this._attributeBuffers;
    }

    get indexesBuffer(): Uint32Array {
        return this._indexesBuffer;
    }

    get indexesBufferLength(): number {
        return this._indexesBufferLength;
    }
}