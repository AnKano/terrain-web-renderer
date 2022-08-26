// globals
@group(0) @binding(0) var<uniform> projMatrix: mat4x4<f32>;
@group(0) @binding(1) var<uniform> viewMatrix: mat4x4<f32>;

// locals
@group(0) @binding(2) var<uniform> modelMatrix: mat4x4<f32>;

struct VSOut {
    @builtin(position) Position: vec4<f32>,
    @location(0) uvs: vec2<f32>
};

@vertex
fn main(@location(0) inPos: vec3<f32>, @location(1) inUvs: vec2<f32>) -> VSOut {
    var vsOut: VSOut;

    vsOut.Position = projMatrix * viewMatrix * modelMatrix * vec4<f32>(inPos, 1.0);
    vsOut.uvs = inUvs;

    return vsOut;
}
