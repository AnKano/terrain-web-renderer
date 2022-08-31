import { Model } from './generic/Model';

export class Scene {
    private _models: Model[];

    constructor() {
        this._models = [];
    }

    public update(): void {
        //!TODO: i dunno what can be updated
    }

    public destroy(): void {
        //!TODO: implement
    }

    public wipe(): void {
        this._models = [];
    }

    public add(model: Model): void {
        this._models.push(model);
    }

    get models(): Model[] {
        return this._models;
    }
}
