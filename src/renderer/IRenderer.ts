import { Scene } from './Scene';
import { ICamera } from './generic/camera/ICamera';

export enum RenderType {
    WebGL,
    WebGPU
}

export default abstract class IRenderer {
    protected canvas: HTMLCanvasElement;
    protected canvasDimension: [number, number, number];
    protected canvasSamples: number;

    protected constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasDimension = [0, 0, 1];
        this.canvasSamples = 4;
    }

    protected abstract startRender(): void;

    protected abstract endRender(): void;

    public abstract init(): Promise<void>;

    public abstract render(scene: Scene, camera: ICamera): void;

    public updateCanvas(): boolean {
        const clWidth = this.canvas.clientWidth;
        const clHeight = this.canvas.clientHeight;

        if (clWidth !== this.canvasDimension[0] || clHeight !== this.canvasDimension[1]) {
            this.canvasDimension = [clWidth, clHeight, 1];
            this.canvas.width = this.canvasDimension[0];
            this.canvas.height = this.canvasDimension[1];

            return true;
        }

        return false;
    }
}
