import GeoScene from '../src/GeoScene';

test('Try to instantiate and run not configured scene', async () => {
    const scene = new GeoScene();
    try {
        await scene.start();
    } catch (err) {
        expect(err).toEqual('Renderer not defined!');
    }
});

test('Try to setup undefined renderer mode', async () => {
    const scene = new GeoScene();
    try {
        scene.setRenderer(100, undefined);
    } catch (err) {
        expect(err).toEqual('Undefined renderer type!');
    }
});
