import * as fs from 'fs';
import * as path from 'path';

export function randomQuote(movieNumber?: number) {
    const DBPath = '../assets/allIDs.txt';
    const allIDsStr = fs.readFileSync(path.join(__dirname, DBPath), 'utf8');
    const allIDs: number[] = allIDsStr.split('\n')
        .filter(line => {
            if (movieNumber == undefined || movieNumber < 1 || movieNumber > 5) return true;
            else return line.startsWith(`${movieNumber}`);
        })
        .map(Number);
    
    const chooseID = Math.floor(Math.random() * allIDs.length);
    // console.log(`ID stored in ${chooseID}: ${allIDs[chooseID]}`)
    
    const fileNumber = Math.floor(allIDs[chooseID] / 10000);
    const quoteIdx = allIDs[chooseID] % 10000;
    console.log(`ID: ${allIDs[chooseID]}, file ${fileNumber}, quote number ${quoteIdx}`);

    const data = fs.readFileSync(path.join(__dirname, `../subtitles/new/${fileNumber}.srt`), 'utf8');
    const regEx = new RegExp(`(?<=${quoteIdx}\n)(.+\n)+`, 'g');
    const pulledQuote = data.match(regEx);
    if (pulledQuote != null) {
        console.log(pulledQuote[0]);
    }

    return pulledQuote == null ? '' : pulledQuote[0];
}