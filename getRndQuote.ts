import * as fs from 'fs';
import * as path from 'path';

export function randomQuote() {
    const allIDsStr = fs.readFileSync(path.join(__dirname, `allIDs.txt`), 'utf8');
    const allIDs: number[] = allIDsStr.split('\n').filter(Boolean).map(Number);
    
    const chooseID = Math.floor(Math.random() * allIDs.length + 1);
    console.log(`ID stored in ${chooseID}: ${allIDs[chooseID]}`)
    
    const fileNumber = Math.floor(allIDs[chooseID] / 10000);
    const quoteIdx = allIDs[chooseID] % 10000;
    console.log(`ID: ${allIDs[chooseID]}, file ${fileNumber}, quote number ${quoteIdx}`);

    const data = fs.readFileSync(path.join(__dirname, `./subtitles/${fileNumber}.srt`), 'utf8');
    const regEx = new RegExp(`(?<=${quoteIdx}+\n.+-->.+\n)(.+\n)+`, 'g');
    const pulledQuote = data.match(regEx);
    if (pulledQuote != null) {
        console.log(pulledQuote[0]);
    }

    return pulledQuote == null ? [] : pulledQuote[0];
}