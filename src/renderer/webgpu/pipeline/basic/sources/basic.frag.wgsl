// globals
// !none

// local
@group(0) @binding(3) var<uniform> tint: vec4<f32>;

// local: diffuse
@group(0) @binding(4) var diffuseSampler: sampler;
@group(0) @binding(5) var diffuseTexture: texture_2d<f32>;

@fragment
fn main(@location(0) inUvs: vec2<f32>) -> @location(0) vec4<f32> {
    var diffuseColor = textureSample(diffuseTexture, diffuseSampler, inUvs);
    return mix(diffuseColor, tint, 0.5f);
}
