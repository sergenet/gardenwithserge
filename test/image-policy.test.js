'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { detectImageMime, isSupportedImage } = require('../lib/image-policy');

test('detects supported image signatures instead of trusting extensions', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0, 0, 0, 0, 0, 0, 0, 0]);
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const webp = Buffer.from('RIFF0000WEBP', 'ascii');
    assert.equal(detectImageMime(jpeg), 'image/jpeg');
    assert.equal(detectImageMime(png), 'image/png');
    assert.equal(detectImageMime(webp), 'image/webp');
    assert.equal(isSupportedImage(Buffer.from('not an image')), false);
});
