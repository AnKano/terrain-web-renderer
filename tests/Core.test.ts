import {PerspectiveCamera} from "../src/renderer/generic/camera/PerspectiveCamera";
import {Core} from "../src/geo/Core";

test('Checking subdivide functionality with known result', async () => {
    const camera = new PerspectiveCamera([1.0, 5.0, 10.0], [0.0, 0.0, 0.0]);
    const core = new Core();

    camera.update(1, 1);
    core.update(camera);

    const layer = core.layers[0];
    // for perspective camera targeted in 0.0f lat. and 0.0f lon. with aspect
    // ratio eq. 1.0f should be 250 elements
    expect(layer.tiles.length).toBe(250);

    // ...and all of them is visible
    const visibleTiles = layer.tiles.map(tile => tile.isVisible);
    expect(visibleTiles.length).toBe(250);
});

test('Checking repeating result', async () => {
    const camera = new PerspectiveCamera([1.0, 5.0, 10.0], [0.0, 0.0, 0.0]);
    const core = new Core();

    camera.update(1, 1);
    core.update(camera);

    const firstIterationLayers = core.layers[0];
    // for perspective camera targeted in 0.0f lat. and 0.0f lon. with aspect
    // ratio eq. 1.0f should be 250 elements
    expect(firstIterationLayers.tiles.length).toBe(250);

    core.update(camera);

    // ...and all of them is visible
    const secondIterationLayers = core.layers[0];
    expect(secondIterationLayers.tiles.length).toBe(250);
});