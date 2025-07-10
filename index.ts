import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import * as process from 'process';
import * as path from 'path';
import readFileToString from './src/readFile';
import * as fs from 'fs';
import { randomQuote } from './getRndQuote'

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
  })

const textContent = randomQuote();

async function main() {
    await agent.login({
        identifier: process.env.BLUESKY_USERNAME!, 
        password: process.env.BLUESKY_PASSWORD!
    })
    console.log(`Logged in as ${agent.session?.handle}`);
    
    // await agent.post(
    //     await createVideoPost(textPath, videoPath, agent)
    // );

    const recordObj = await agent.post({
        text: textContent
    })

    console.log(`Just posted: ${textContent} at ${recordObj.uri}`)
}

main();
