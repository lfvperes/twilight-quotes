import { BskyAgent } from "@atproto/api";
import AppBskyEmbedVideo from "@atproto/api";
// import { AppBskyEmbedVideo, BskyAgent } from "@atproto/api";
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg'

async function main(){
  const userAgent = new BskyAgent({
    service: "https://bsky.social",
  });

  dotenv.config();

  await userAgent.login({
      identifier: process.env.BLUESKY_USERNAME!, 
      password: process.env.BLUESKY_PASSWORD!
  })

  console.log(`Logged in as ${userAgent.session?.handle}`);


  const videoPath = path.join(__dirname, '../assets', 'video.mp4');

  try {
    const fileHandle = await fs.open(videoPath, 'r');
    const { size } = await fileHandle.stat();
    console.log(`File size: ${size} bytes`);

    // Close the file handle
    await fileHandle.close();
  } catch (error) {
    console.error(`Error reading file: ${error}`);
  }


  const { data } = await userAgent.com.atproto.repo.uploadBlob(
    // @ts-expect-error - expecting an Uint8Array, but a ReadableStream is fine
          fs.readFileSync(videoPath),

  );

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

  async function getAspectRatio(fileName: string): Promise<{ width: number; height: number }> {
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
          } as { width: number; height: number });
        } else {
          reject(new Error('No video stream found'));
        }
      });
    });
  }
}

main();