import TRender from '../src/TRender';

test('Try to instantiate and run not configured scene', async () => {
    const scene = new TRender();
    try {
        await scene.start();
    } catch (err) {
        expect(err).toEqual('Renderer not defined!');
    }
});

test('Try to setup undefined renderer mode', async () => {
    const scene = new TRender();
    try {
        scene.setRenderer(100, undefined);
    } catch (err) {
        expect(err).toEqual('Undefined renderer type!');
    }
});
