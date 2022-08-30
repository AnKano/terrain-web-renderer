import WebGPURenderer from './renderer/webgpu/WebGPURenderer';
import WebGLRenderer from './renderer/webgl/WebGLRenderer';
import { Scene } from './renderer/Scene';
import { PerspectiveCamera } from './renderer/generic/camera/PerspectiveCamera';
import { Model } from './renderer/generic/Model';
import { Mesh } from './renderer/generic/Mesh';
import { Texture } from './renderer/generic/Texture';
import { BasicMaterial } from './renderer/generic/materials/BasicMaterial';
import { Core } from './geo/Core';

const canvas = document.getElementById('gfx') as HTMLCanvasElement;

const renderer = new WebGLRenderer(canvas);
// const renderer = new WebGPURenderer(canvas);

const camera = new PerspectiveCamera([1.0, 5.0, 10.0], [0.0, 0.0, 0.0]);
const scene = new Scene();

const positions = new Float32Array([-1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, -1.0]);
const uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
const indices = new Uint32Array([0, 1, 2, 0, 2, 3, 2, 1, 0, 3, 2, 0]);

const mesh = new Mesh();
mesh.declareAttributeBuffer(0, positions, 3);
mesh.declareAttributeBuffer(1, uvs, 2);
mesh.declareIndexBuffer(indices);

const core = new Core();
core.setWorldPosition(46.9641, 142.7285);

let created = false;

const render = (): void => {
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);
    core.update(camera);

    if (!created) {
        core.layers.forEach((layer) => {
            layer.tiles.forEach((tile) => {
                // if (!tile.isVisible) return;

                const model = new Model();
                model.mesh = mesh;
                model.position = [tile.center[0], 0.0, tile.center[1]];
                model.scale = [tile.side / 2, 1.0, tile.side /2];

                const material = new BasicMaterial();
                material.diffuse = new Texture(`https://tile.openstreetmap.org/${tile.tilecode[2]}/${tile.tilecode[0]}/${tile.tilecode[1]}.png`);
                material.tint = new Float32Array([Math.random(), Math.random(), Math.random(), 1.0]);
                material.tintCoefficient = 0.5;
                model.material = material;

                scene.add(model);
            });
        });
        created = true;
    }
};

renderer.init().then(render);
