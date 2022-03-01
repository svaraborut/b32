import * as path from 'path';
import * as fs from 'fs';
import { Decoder, Encoder } from '../src/classes';
import * as stream from 'stream';
import { TransformCallback } from 'stream';


class HexToBuffer extends stream.Transform {
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        this.push(Buffer.from(chunk.toString('ascii'), 'hex'));
        callback();
    }
}

class Collector extends stream.Writable {
    multipart = [];

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) {
        this.multipart.push(chunk);
        callback();
    }

    result() {
        return Buffer.concat(this.multipart);
    }
}

async function waitForStream(stream) {
    return new Promise((resolve, reject) => {
        stream.on('close', resolve);
        stream.on('error', reject);
    })
}

test('decode_64', async () => {
    const collector = new Collector();

    const s = fs.createReadStream(path.join(__dirname, 'data/64.b32'))
        .pipe(new Decoder())
        .pipe(collector)

    await waitForStream(s);

    const ref = Buffer
        .from(fs.readFileSync(path.join(__dirname, 'data/64.hex')).toString('ascii'), 'hex')

    expect(Buffer.compare(collector.result(), ref)).toEqual(0);
})

test('decode_7463', async () => {
    const collector = new Collector();

    // watermark is lowered to force the system to break the file in many chunks
    const s = fs.createReadStream(path.join(__dirname, 'data/7463.b32'), { highWaterMark: 128 })
        .pipe(new Decoder())
        .pipe(collector)

    await waitForStream(s);

    const ref = Buffer
        .from(fs.readFileSync(path.join(__dirname, 'data/7463.hex')).toString('ascii'), 'hex')

    expect(Buffer.compare(collector.result(), ref)).toEqual(0);

})


test('encode_64', async () => {
    const collector = new Collector();

    const s = fs.createReadStream(path.join(__dirname, 'data/64.hex'))
        .pipe(new HexToBuffer())
        .pipe(new Encoder())
        .pipe(collector)

    await waitForStream(s);

    const ref = fs.readFileSync(path.join(__dirname, 'data/64.b32'));

    expect(Buffer.compare(collector.result(), ref)).toEqual(0);
})

test('encode_7463', async () => {
    const collector = new Collector();

    const s = fs.createReadStream(path.join(__dirname, 'data/7463.hex'), {highWaterMark: 256})
        .pipe(new HexToBuffer())
        .pipe(new Encoder())
        .pipe(collector)

    await waitForStream(s);

    const ref = fs.readFileSync(path.join(__dirname, 'data/7463.b32'));

    expect(Buffer.compare(collector.result(), ref)).toEqual(0);
})
