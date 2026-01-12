import { BskyAgent, RichText } from '@atproto/api';
import * as dotenv from 'dotenv';
import * as process from 'process';
import * as path from 'path';
import readFileToString from './readFile';
import * as fs from 'fs';
import { randomQuote } from './getRndQuote'

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
})

const textContent: string = randomQuote();

const rTxt = new RichText({
    text: textContent
})

async function main() {
    await agent.login({
        identifier: "quotes-twilight.bsky.social", 
        password: process.env.BLUESKY_PASSWORD!
    })
    console.log(`Logged in as ${agent.session?.handle}`);
    
    await rTxt.detectFacets(agent)
    const recordObj = await agent.post({
        text: rTxt.text,
        facets: rTxt.facets,
        langs: ["en-US"]
    })

    console.log(`Just posted: ${textContent} at ${recordObj.uri}`)
}

main();
