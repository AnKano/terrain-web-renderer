import WebGPURenderer from './renderer/webgpu/WebGPURenderer';
import WebGLRenderer from './renderer/webgl/WebGLRenderer';
import { Scene } from './renderer/Scene';
import { PerspectiveCamera } from './renderer/generic/camera/PerspectiveCamera';
import { Model } from './renderer/abstract/Model';
import { Mesh } from './renderer/abstract/Mesh';

const canvas = document.getElementById('gfx') as HTMLCanvasElement;

const renderer = new WebGPURenderer(canvas);
// const renderer = new WebGLRenderer(canvas);

const camera = new PerspectiveCamera([10.0, 10.0, 10.0], [0.0, 0.0, 0.0]);
const scene = new Scene();

const positions = new Float32Array([-1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, -1.0]);
const uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
const indices = new Uint32Array([0, 1, 2, 0, 2, 3, 2, 1, 0, 3, 2, 0]);

const mesh = new Mesh();
mesh.declareAttributeBuffer(0, positions, 3);
mesh.declareAttributeBuffer(1, uvs, 2);
mesh.declareIndexBuffer(indices);

const model = new Model();
model.mesh = mesh;

scene.add(model);

const render = (): void => {
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);
};

renderer.init().then(render);
