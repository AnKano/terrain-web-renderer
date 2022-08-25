import GeoScene, { RendererMode } from './GeoScene';

const canvas = document.getElementById('gfx') as HTMLCanvasElement;

const scene = new GeoScene();
scene.setRenderer(RendererMode.WebGL, canvas);
scene.start();