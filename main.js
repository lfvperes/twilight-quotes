"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@atproto/api");
// import { AppBskyEmbedVideo, BskyAgent } from "@atproto/api";
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const ffmpeg = __importStar(require("fluent-ffmpeg"));
async function main() {
    const userAgent = new api_1.BskyAgent({
        service: "https://bsky.social",
    });
    dotenv.config();
    await userAgent.login({
        identifier: process.env.BLUESKY_USERNAME,
        password: process.env.BLUESKY_PASSWORD
    });
    console.log(`Logged in as ${userAgent.session?.handle}`);
    const videoPath = path.join(__dirname, '../assets', 'video.mp4');
    try {
        const fileHandle = await fs.open(videoPath, 'r');
        const { size } = await fileHandle.stat();
        console.log(`File size: ${size} bytes`);
        // Close the file handle
        await fileHandle.close();
    }
    catch (error) {
        console.error(`Error reading file: ${error}`);
    }
    const { data } = await userAgent.com.atproto.repo.uploadBlob(
    // @ts-expect-error - expecting an Uint8Array, but a ReadableStream is fine
    fs.readFileSync(videoPath));
    console.log("video uploaded, posting...");
    await userAgent.post({
        text: "This post should have a video attached",
        langs: ["en"],
        embed: {
            $type: "app.bsky.embed.video",
            video: data.blob,
            aspectRatio: await getAspectRatio(videoPath),
        },
        // } satisfies AppBskyEmbedVideo.Main,
    });
    console.log("done ✨ (video will take a little bit to process)");
    async function getAspectRatio(fileName) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(fileName, (err, metadata) => {
                if (err) {
                    return reject(err);
                }
                const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
                if (videoStream) {
                    resolve({
                        width: videoStream.width,
                        height: videoStream.height,
                    });
                }
                else {
                    reject(new Error('No video stream found'));
                }
            });
        });
    }
}
main();
