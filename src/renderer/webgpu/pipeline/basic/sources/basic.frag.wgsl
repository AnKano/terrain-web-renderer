// globals
// !none

// local
@group(0) @binding(3) var<uniform> tint: vec4<f32>;

@fragment
fn main(@location(0) inUvs: vec2<f32>) -> @location(0) vec4<f32> {
    return vec4(1.0);
}
