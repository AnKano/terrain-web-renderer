interface SRTMMeta {
    currentPosition: number;
    signs: number[];
    values: number[];
}

export class SRTMSourcePart {
    private _xOrigin: number;
    private _yOrigin: number;

    private _xOpposite: number;
    private _yOpposite: number;

    private _pixelWidth: number;
    private _pixelHeight: number;

    private _data: Uint8Array;
    private _url: string;

    constructor(url: string) {
        this._url = url;
        this.parseMetaFromUrl(url);
    }

    loadData(): Promise<void> {
        return fetch(this._url)
            .then((res: Response) => res.arrayBuffer())
            .then((buffer: Buffer) => {
                this._data = new Uint8Array(buffer);
            })
            .then(() => {
                return;
            });
    }

    parseMetaFromUrl(url: string): void {
        const fileName = url.split('/').at(-1);

        const regex = new RegExp('([NS])(\\d+)([EW])(\\d+)');
        const result = regex.exec(fileName);

        const mYSign = (result[1] == 'N') ? 1 : -1;
        const mYVal = Number.parseInt(result[2]);
        const mY = mYSign * mYVal;

        const mXSign = (result[3] == 'E') ? 1 : -1;
        const mXVal = Number.parseInt(result[4]);
        const mX = mXSign * mXVal;

        this._yOrigin = mY + 1.0;
        this._yOpposite = mY;

        this._xOrigin = mX;
        this._xOpposite = mX + 1.0;

        this._pixelWidth = 1.0 / 3601.0;
        this._pixelHeight =  1.0 / 3601.0;
    }

    get data(): Uint8Array {
        return this._data;
    }

    get pixelWidth(): number {
        return this._pixelWidth;
    }

    get pixelHeight(): number {
        return this._pixelHeight;
    }

    get xOrigin(): number {
        return this._xOrigin;
    }

    get yOrigin(): number {
        return this._yOrigin;
    }

    get xOpposite(): number {
        return this._xOpposite;
    }

    get yOpposite(): number {
        return this._yOpposite;
    }
}
