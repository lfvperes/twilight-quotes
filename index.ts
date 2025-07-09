import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import * as path from 'path';
import readFileToString from './src/readFile';
import * as fs from 'fs';

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
  })

const textPath = path.join(__dirname, '../assets', 'text.txt');
const videoPath = path.join(__dirname, '../assets','video.mp4');

async function main() {
    await agent.login({
        identifier: process.env.BLUESKY_USERNAME!, 
        password: process.env.BLUESKY_PASSWORD!
    })
    console.log(`Logged in as ${agent.session?.handle}`);
    
    const textContent = readFileToString(textPath);
    const { data } = await agent.com.atproto.repo.uploadBlob(
        fs.readFileSync(videoPath),
    );
    console.log("Video uploaded, posting...")
    
    await agent.post({
        text: textContent,
        langs: ["en"],
        embed: {
            $type: "app.bsky.embed.video",
            video: data.blob,
            aspectRatio: {
                width: 360,
                height: 640
            },
        },
    });

    console.log("Just posted!")
}

main();
