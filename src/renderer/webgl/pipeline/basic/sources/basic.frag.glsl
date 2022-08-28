#version 300 es

precision highp float;

in vec2 pUvs;

uniform mat4 prjMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform vec4 tintArray;
uniform sampler2D diffuse;

out vec4 outColor;

void main() {
    vec4 vColor = texture(diffuse, vec2(pUvs.x, pUvs.y));
    vColor = mix(vColor, tintArray, 0.5);
    outColor = vColor;
}