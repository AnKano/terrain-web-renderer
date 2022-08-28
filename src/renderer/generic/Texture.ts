import {RenderType} from "../IRenderer";
import {ITextureAdapter} from "../abstract/ITextureAdapter";

export class Texture {
    private _data: ImageBitmap;
    public loadPromise: Promise<void>;

    private readonly _specifics: Map<RenderType, ITextureAdapter>;

    constructor(url: string) {
        this._specifics = new Map<RenderType, ITextureAdapter>();

        this.loadPromise = new Promise<void>((resolve) => {
            this.loadAsync(url).then(() => {
                resolve();
            });
        });
    }

    async loadAsync(url: string): Promise<void> {
        const response = await fetch(url);
        const blob = await response.blob();

        this._data = await createImageBitmap(blob);
    }

    get specifics(): Map<RenderType, ITextureAdapter> {
        return this._specifics;
    }

    get data(): ImageBitmap {
        return this._data;
    }
}