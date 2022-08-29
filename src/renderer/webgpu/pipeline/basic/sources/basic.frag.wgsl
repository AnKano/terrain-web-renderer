struct UBO {
    tintCoefficient: f32,
}

// globals
// !none

// local
@group(0) @binding(3) var<uniform> tint: vec4<f32>;
@group(0) @binding(4) var<uniform> ubo_in: UBO;

// local: diffuse
@group(0) @binding(5) var diffuseSampler: sampler;
@group(0) @binding(6) var diffuseTexture: texture_2d<f32>;

@fragment
fn main(@location(0) inUvs: vec2<f32>) -> @location(0) vec4<f32> {
    var diffuseColor = textureSample(diffuseTexture, diffuseSampler, inUvs);
    return mix(diffuseColor, tint, ubo_in.tintCoefficient);
}
