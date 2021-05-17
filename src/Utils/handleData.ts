import ops from 'ndarray-ops';
import ndarray, { NdArray } from 'ndarray';

function handleData(array: NdArray, data: Buffer, frame: number): Buffer {
    if (array.shape.length === 4) {
        return handleData(array.pick(frame), data, 0)
    } else if (array.shape.length === 3) {
        if (array.shape[2] === 3) {
            ops.assign(
                ndarray(data,
                    [array.shape[0], array.shape[1], 3],
                    [4, 4 * array.shape[0], 1]),
                array)
            ops.assigns(
                ndarray(data,
                    [array.shape[0] * array.shape[1]],
                    [4],
                    3),
                255)
        } else if (array.shape[2] === 4) {
            ops.assign(
                ndarray(data,
                    [array.shape[0], array.shape[1], 4],
                    [4, array.shape[0] * 4, 1]),
                array)
        } else if (array.shape[2] === 1) {
            ops.assign(
                ndarray(data,
                    [array.shape[0], array.shape[1], 3],
                    [4, 4 * array.shape[0], 1]),
                ndarray(array.data,
                    [array.shape[0], array.shape[1], 3],
                    [array.stride[0], array.stride[1], 0],
                    array.offset))
            ops.assigns(
                ndarray(data,
                    [array.shape[0] * array.shape[1]],
                    [4],
                    3),
                255)
        } else {
            throw new Error('Incompatible array shape')
        }
    } else if (array.shape.length === 2) {
        ops.assign(
            ndarray(data,
                [array.shape[0], array.shape[1], 3],
                [4, 4 * array.shape[0], 1]),
            ndarray(array.data,
                [array.shape[0], array.shape[1], 3],
                [array.stride[0], array.stride[1], 0],
                array.offset))
        ops.assigns(
            ndarray(data,
                [array.shape[0] * array.shape[1]],
                [4],
                3),
            255)
    } else {
        throw new Error('Incompatible array shape')
    }

    return data;
}

export = handleData;