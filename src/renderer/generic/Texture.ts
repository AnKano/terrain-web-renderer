import {IMaterial} from "./materials/IMaterial";

export class Texture {
    material: IMaterial;

    private _data: ImageBitmap;
    public loadPromise: Promise<void>;

    constructor(url: string) {

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

    get data(): ImageBitmap {
        return this._data;
    }
}