import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import * as path from 'path';
import readFileToString from './readFile';

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
  })

const filePath = path.join(__dirname, 'message.txt');
const fileContent = readFileToString(filePath);
const msg = `${fileContent} - posted via the API at ${new Date().toLocaleString()}`;

async function main() {
    await agent.login({
        identifier: process.env.BLUESKY_USERNAME!, 
        password: process.env.BLUESKY_PASSWORD!
    })
    await agent.post({
        text: msg
    });
    console.log("Just posted!")
}

main();
