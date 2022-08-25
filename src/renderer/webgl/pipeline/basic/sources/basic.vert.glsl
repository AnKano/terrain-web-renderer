#version 300 es

layout(location = 0) in vec3 inPos;
layout(location = 1) in vec2 inUvs;

uniform mat4 prjMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform vec4 tintArray;

out vec2 pUvs;

void main() {
    gl_Position = prjMatrix * viewMatrix * modelMatrix * vec4(inPos, 1.0f);
    pUvs = inUvs;
}