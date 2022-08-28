export abstract class ITextureAdapter {
    abstract destroy(): void;

    abstract reserveTexture(width: number, height: number): void;

    protected abstract createFromBitmap(source: ImageBitmap): void;

    protected abstract createFromArrayBuffer(buffer: ArrayBufferView, width: number, height: number): void;
}
