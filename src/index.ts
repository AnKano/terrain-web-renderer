import WebGPURenderer from './renderer/webgpu/WebGPURenderer';
import WebGLRenderer from './renderer/webgl/WebGLRenderer';
import { Scene } from './renderer/Scene';
import { PerspectiveCamera } from './renderer/generic/camera/PerspectiveCamera';
import { Model } from './renderer/generic/Model';
import { Mesh } from './renderer/generic/Mesh';
import { Texture } from './renderer/generic/Texture';
import { BasicMaterial } from './renderer/generic/materials/BasicMaterial';

const canvas = document.getElementById('gfx') as HTMLCanvasElement;

const renderer = new WebGLRenderer(canvas);
// const renderer = new WebGPURenderer(canvas);

const camera = new PerspectiveCamera([10.0, 10.0, 10.0], [0.0, 0.0, 0.0]);
const scene = new Scene();

const positions = new Float32Array([-1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, -1.0]);
const uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
const indices = new Uint32Array([0, 1, 2, 0, 2, 3, 2, 1, 0, 3, 2, 0]);

const mesh = new Mesh();
mesh.declareAttributeBuffer(0, positions, 3);
mesh.declareAttributeBuffer(1, uvs, 2);
mesh.declareIndexBuffer(indices);

const basicMaterial = new BasicMaterial();
const texture = new Texture('https://tile.openstreetmap.org/0/0/0.png');
basicMaterial.diffuse = texture;
const model = new Model();
model.mesh = mesh;
model.material = basicMaterial;
scene.add(model);

const basicMaterial2 = new BasicMaterial();
const texture2 = new Texture('https://tile.openstreetmap.org/7/113/41.png');
basicMaterial2.diffuse = texture2;
const model2 = new Model();
model2.position[1] = 3;
model2.mesh = mesh;
model2.material = basicMaterial2;
scene.add(model2);

const tint = new Float32Array([Math.random(), Math.random(), Math.random(), 1.0]);

const render = (): void => {
    window.requestAnimationFrame(render);

    basicMaterial2.tint = tint;
    // basicMaterial2.tintCoefficient =  Math.abs(Math.sin(new Date().getTime() / 500.0));
    basicMaterial2.tintCoefficient =  0.0;

    renderer.render(scene, camera);
};

setTimeout(() => {
    const texture3 = new Texture('https://tile.openstreetmap.org/16/58746/23073.png');
    basicMaterial2.diffuse = texture3;
}, 5000)


renderer.init().then(render);
