#version 300 es

precision highp float;

in vec2 pUvs;

uniform mat4 prjMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform vec4 tintArray;

out vec4 outColor;

void main() {
    outColor = vec4(1.0);
}