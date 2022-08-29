import {Model} from "../Model";
import IRenderer, {RenderType} from "../../IRenderer";
import {IPipeline} from "../../abstract/IPipeline";

export class IMaterial {
    protected _shaders: Map<RenderType, (arg: IRenderer) => IPipeline>;

    model: Model;

    get shaders(): Map<RenderType, (arg: IRenderer) => IPipeline> {
        return this._shaders;
    }
}