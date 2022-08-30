import WebGPURenderer from './renderer/webgpu/WebGPURenderer';
import WebGLRenderer from './renderer/webgl/WebGLRenderer';
import { Scene } from './renderer/Scene';
import { PerspectiveCamera } from './renderer/generic/camera/PerspectiveCamera';
import { Model } from './renderer/generic/Model';
import { Mesh } from './renderer/generic/Mesh';
import { Texture } from './renderer/generic/Texture';
import { BasicMaterial } from './renderer/generic/materials/BasicMaterial';
import { Core } from './geo/Core';
import * as LRU from 'lru-cache';
import {SRTMSource} from "./elevation/SRTMSource";

const source = new SRTMSource();
{
    source
        .addPart('https://192.168.0.100:8081/N45E140.hgt')
        .addPart('https://192.168.0.100:8081/N45E141.hgt')
        .addPart('https://192.168.0.100:8081/N45E142.hgt')
        .addPart('https://192.168.0.100:8081/N46E141.hgt')
        .addPart('https://192.168.0.100:8081/N46E142.hgt')
        .addPart('https://192.168.0.100:8081/N46E143.hgt')
        .addPart('https://192.168.0.100:8081/N47E141.hgt')
        .addPart('https://192.168.0.100:8081/N47E142.hgt')
        .addPart('https://192.168.0.100:8081/N47E143.hgt')
        .addPart('https://192.168.0.100:8081/N48E140.hgt')
        .addPart('https://192.168.0.100:8081/N48E141.hgt')
        .addPart('https://192.168.0.100:8081/N48E142.hgt')
        .addPart('https://192.168.0.100:8081/N48E144.hgt')
        .addPart('https://192.168.0.100:8081/N49E140.hgt')
        .addPart('https://192.168.0.100:8081/N49E142.hgt')
        .addPart('https://192.168.0.100:8081/N49E143.hgt')
        .addPart('https://192.168.0.100:8081/N49E144.hgt')
        .addPart('https://192.168.0.100:8081/N50E140.hgt')
        .addPart('https://192.168.0.100:8081/N50E142.hgt')
        .addPart('https://192.168.0.100:8081/N50E143.hgt')
        .addPart('https://192.168.0.100:8081/N51E140.hgt')
        .addPart('https://192.168.0.100:8081/N51E141.hgt')
        .addPart('https://192.168.0.100:8081/N51E142.hgt')
        .addPart('https://192.168.0.100:8081/N51E143.hgt')
        .addPart('https://192.168.0.100:8081/N52E140.hgt')
        .addPart('https://192.168.0.100:8081/N52E141.hgt')
        .addPart('https://192.168.0.100:8081/N52E142.hgt')
        .addPart('https://192.168.0.100:8081/N52E143.hgt')
        .addPart('https://192.168.0.100:8081/N53E140.hgt')
        .addPart('https://192.168.0.100:8081/N53E141.hgt')
        .addPart('https://192.168.0.100:8081/N53E142.hgt')
        .addPart('https://192.168.0.100:8081/N53E143.hgt')
        .addPart('https://192.168.0.100:8081/N54E140.hgt')
        .addPart('https://192.168.0.100:8081/N54E142.hgt');
}


const canvas = document.getElementById('gfx') as HTMLCanvasElement;

const renderer = new WebGLRenderer(canvas);
// const renderer = new WebGPURenderer(canvas);

const camera = new PerspectiveCamera([1.0, 5.0, 10.0], [0.0, 0.0, 0.0]);
const scene = new Scene();

const positions = new Float32Array([-1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, -1.0]);
const uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
const indices = new Uint32Array([2, 1, 0, 3, 2, 0]); //[0, 1, 2, 0, 2, 3]

const mesh = new Mesh();
mesh.declareAttributeBuffer(0, positions, 3);
mesh.declareAttributeBuffer(1, uvs, 2);
mesh.declareIndexBuffer(indices);

const core = new Core();
core.setWorldPosition(46.9641, 142.7285);

const modelsCache = new LRU<string, Model>({ max: 250 });

const render = (): void => {
    window.requestAnimationFrame(render);

    // draw scene
    renderer.render(scene, camera);
    // update map core
    core.update(camera);

    // erase everything from scene
    scene.wipe();
    // add or restore viable tiles
    core.layers.forEach((layer) => {
        layer.tiles.forEach((tile) => {
            if (!tile.isVisible) return;

            if (!modelsCache.has(tile.quadcode)) {
                const model = new Model();
                model.mesh = mesh;
                model.position = [tile.center[0], 0.0, tile.center[1]];
                model.scale = [tile.side / 2, 1.0, tile.side / 2];

                const material = new BasicMaterial();
                material.diffuse = new Texture(
                    `https://tile.openstreetmap.org/${tile.tilecode[2]}/${tile.tilecode[0]}/${tile.tilecode[1]}.png`
                );
                material.tint = new Float32Array([Math.random(), Math.random(), Math.random(), 1.0]);
                material.tintCoefficient = 0.25;
                model.material = material;

                modelsCache.set(tile.quadcode, model);
            }

            scene.add(modelsCache.get(tile.quadcode));
        });
    });

    // console.info('draw', scene.models.length, 'elements');
};

Promise.all([source.loadEverything()]).then(() => {
    renderer.init().then(render);
});
