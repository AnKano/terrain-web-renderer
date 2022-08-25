export abstract class IPipeline {
    // Bind pipeline for further rendering
    public abstract activate(): void;

    // Update pipeline global uniforms
    protected abstract update(): void;

    // Destroy all pipeline resources
    public abstract destroy(): void;
}