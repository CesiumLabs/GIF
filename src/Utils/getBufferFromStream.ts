import { Readable } from "stream";

function getBuffer(stream: Readable) {
    return new Promise<Buffer>((resolve, reject) => {
        const data: Buffer[] = [];

        stream.on('data', (chunk) => data.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(data)));
        stream.on('error', reject);
    });
}

export = getBuffer;