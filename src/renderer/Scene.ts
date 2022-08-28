import {Model} from "./generic/Model";

export class Scene {
    private readonly _models: Model[];

    constructor() {
        this._models = [];
    }

    public update(): void {

    }

    public destroy(): void {

    }

    add(model: Model): void {
        this._models.push(model);
    }

    get models(): Model[] {
        return this._models;
    }
}