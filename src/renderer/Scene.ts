import {Model} from "./generic/Model";

export class Scene {
    private readonly _models: Model[];

    constructor() {
        this._models = [];
    }

    public update(): void {
        //!TODO: i dunno what can be updated
    }

    public destroy(): void {
        //!TODO: implement
    }

    add(model: Model): void {
        this._models.push(model);
    }

    get models(): Model[] {
        return this._models;
    }
}