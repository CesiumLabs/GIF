import { GifReader } from 'omggif'
import ndarray from 'ndarray'
import EventEmitter from 'events';
import handleData from './Utils/handleData';
// @ts-ignore
import { PNG } from 'pngjs-nozlib';
import { Readable } from 'stream';

class GIFDecoder extends EventEmitter {
    private _source: Buffer;
    public width: number = 0;
    public height: number = 0;

    constructor(source: Buffer) {
        super();

        this._source = source;

        Object.defineProperty(this, '_source', { enumerable: false, configurable: false, writable: false });
    }

    decode() {
        const decoder = new GifReader(this._source);

        // apply width and height prop
        this.width = decoder.width;
        this.height = decoder.height;

        if (decoder.numFrames() > 0) {
            const nshape = [decoder.numFrames(), decoder.height, decoder.width, 4];
            const ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2] * nshape[3]);
            const result = ndarray(ndata, nshape);

            for (let i = 0; i < decoder.numFrames(); ++i) {
                decoder.decodeAndBlitFrameRGBA(i, ndata.subarray(result.index(i, 0, 0, 0), result.index(i + 1, 0, 0, 0)));
            }

            return this._readFrames(result.transpose(0, 2, 1));
        } else {
            const nshape = [decoder.height, decoder.width, 4];
            const ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2]);
            const result = ndarray(ndata, nshape);

            decoder.decodeAndBlitFrameRGBA(0, ndata)

            return this._readFrames(result.transpose(1, 0));
        }
    }

    private _readFrames(data: ndarray.NdArray<number>) {
        if (data.shape.length === 4) {
            const [
                frames,
                width,
                height,
                channels
            ] = data.shape;

            const numPixelsInFrame = width * height;

            const resultArray: ndarray.NdArray<number>[] = [];

            for (let i = 0; i < frames; ++i) {
                if (i > 0) {
                    const currIndex = data.index(i, 0, 0, 0);
                    const prevIndex = data.index(i - 1, 0, 0, 0);

                    for (let j = 0; j < numPixelsInFrame; ++j) {
                        const curr = currIndex + j * channels;

                        if (data.data[curr + channels - 1] === 0) {
                            const prev = prevIndex + j * channels;

                            for (let k = 0; k < channels; ++k) {
                                data.data[curr + k] = data.data[prev + k];
                            }
                        }
                    }
                }

                resultArray.push(data.pick(i))
            }

            return resultArray;
        } else {
            return [data];
        }
    }

    toPNG(raw: ndarray.NdArray<number> | ndarray.NdArray<number>[]) {
        if (!Array.isArray(raw)) raw = [raw];
        const frames: Readable[] = [];

        for (let i = 0; i < raw.length; i++) {
            const png = new PNG({
                width: raw[i].shape[0],
                height: raw[i].shape[1]
            });

            const data = handleData(raw[i], png.data, null);
            png.data = data;
            frames.push(png.pack());
        }

        return frames;
    }

}

export = GIFDecoder;