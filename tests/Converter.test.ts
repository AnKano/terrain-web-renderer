import { GeographyConverter } from '../src/geo/math/Converter';

test("quadcode '0' to tile check", () => {
    const quadcode = '0';
    expect(GeographyConverter.quadcodeToTilecode(quadcode)).toEqual([0, 0, 1]);
});

test("quadcode '13122121100203' to tile check", () => {
    const quadcode = '13122121100203';
    expect(GeographyConverter.quadcodeToTilecode(quadcode)).toEqual([14689, 5765, 14]);
});

test('empty quadcode to tile check', () => {
    const quadcode = '';
    try {
        const result = GeographyConverter.quadcodeToTilecode(quadcode);
    } catch (err) {
        expect(err).toBe("unexpected string input!");
    }
});

test('wrong quadcode to tile check', () => {
    const quadcode = 'abcdef';
    try {
        const result = GeographyConverter.quadcodeToTilecode(quadcode);
    } catch (err) {
        expect(err).toBe("unexpected string input!");
    }
});
