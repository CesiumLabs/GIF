import GIFEncoder from './Encoder';
import GIFDecoder from './Decoder';
import handleData from './Utils/handleData';
import getBuffer from './Utils/getBufferFromStream';

export {
    GIFDecoder as Decoder,
    GIFEncoder as Encoder,
    handleData,
    getBuffer as streamToBuffer
}