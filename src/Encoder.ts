import NativeGIFEncoder from 'gif-encoder'
import { NdArray } from 'ndarray'
import handleData from './Utils/handleData';

class GIFEncoder {
    private data: NdArray<number>;

    constructor(src: NdArray<number>) {
        this.data = src;
    }

    get frames() {
        return this.data.shape.length === 4 ? this.data.shape[0] : 1
    }

    get width() {
        return this.data.shape.length === 4 ? this.data.shape[1] : this.data.shape[0]
    }

    get height() {
        return this.data.shape.length === 4 ? this.data.shape[2] : this.data.shape[1];
    }

    encode() {
        const frames = this.frames;
        const width = this.width;
        const height = this.height;

        const gif = new NativeGIFEncoder(width, height);
        let pixel = Buffer.alloc(width * height * 4);

        gif.writeHeader();

        for (let i = 0; i < frames; i++) {
            pixel = handleData(this.data, pixel, i)
            gif.addFrame(pixel);
        }

        gif.finish();
        return gif;
    }

}

export = GIFEncoder;