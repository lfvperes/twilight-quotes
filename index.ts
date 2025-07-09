import * as fs from 'fs';
import * as path from 'path';

async function main() {
    let allIDs: number[] = [];
    for (let i = 1; i <= 5; i++) {
        let data: string | undefined;
        try {
            data = fs.readFileSync(path.join(__dirname, `./subtitles/${i}.srt`), 'utf8');
        } catch (err) {
            console.error('Error reading file:', err);
            continue;
        }
        
        // get subtitle numbers
        if (data != undefined) {            
            let subtIDNoMusicStr: RegExpMatchArray | null;
            subtIDNoMusicStr = data.match(/[0-9]+(?=\n.+-->.+\n[^♪].+(\n.+)*)/g);
    
            if (subtIDNoMusicStr == null) {
                console.log(`no matches found for ${i}.srt`);
                continue;
            }

            const subtIDNoMusicInt = subtIDNoMusicStr?.map( idStr => parseInt(idStr) + i * 10000)

            allIDs.push(...subtIDNoMusicInt)
        }
    }
     
    const chooseID = Math.floor(Math.random() * allIDs.length + 1);
    console.log(`${chooseID}: ${allIDs[chooseID]}`)

}

main();