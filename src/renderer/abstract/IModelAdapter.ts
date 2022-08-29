import { Model } from '../generic/Model';

export abstract class IModelAdapter {
    protected _general: Model;

    protected constructor(general: Model) {
        this._general = general;
    }

    protected abstract invokePipeline(): void;

    protected abstract updateLocals(): void;

    public abstract draw(): void;

    get general(): Model {
        return this._general;
    }
}
