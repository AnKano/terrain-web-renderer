export abstract class IPipelineMaterialLogic {
    // update locals related to material representation
    abstract updateLocals(): void;
}

export abstract class IWebGPUPipelineMaterialLogic extends IPipelineMaterialLogic {
    public abstract requestBindGroup(): GPUBindGroupEntry[];
}