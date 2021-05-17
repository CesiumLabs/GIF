# @canvacord/gif
GIF Encoder and Decoder for **[Canvacord](https://npmjs.com/package/canvacord)**.

# Installation

```sh
$ npm install --save @canvacord/gif

// or
$ yarn add @canvacord/gif
```

# Examples
## Decoding GIF

```js
import { Decoder } from '@canvacord/gif';
import { readFileSync, createWriteStream } from 'fs';

const source = readFileSync('./img.gif');
const decoder = new Decoder(source);
const rawFrames = decoder.decode();

// log raw frames data
console.log(rawFrames);

// get png image of each frame
const pngFrames = decoder.toPNG(rawFrames);

for (let i = 0; i < pngFrames.length; i++) {
    const frame = pngFrames[i];
    frame.pipe(createWriteStream(`./frame_${i}.png`));
}
```

## Encoding raw frame to GIF

```js
import { Decoder, Encoder } from '@canvacord/gif';
import { readFileSync, createWriteStream } from 'fs';

const source = readFileSync('./img.gif');
const decoder = new Decoder(source);
const rawFrames = decoder.decode();

// encode each frames into gif
for (let i = 0; i < rawFrames.length; i++) {
    const frame = new Encoder(rawFrames[i]).encode();
    frame.pipe(createWriteStream(`./frame_${i}.png`));
}
```