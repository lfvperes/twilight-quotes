import * as fs from 'fs';
import * as path from 'path';

async function main() {
    let allIDs: number[] = [];
    for (let i = 1; i <= 5; i++) {
        let data: string | undefined;
        try {
            data = fs.readFileSync(path.join(__dirname, `../subtitles/new/${i}.srt`), 'utf8');
        } catch (err) {
            console.error('Error reading file:', err);
            continue;
        }
        
        // get subtitle numbers
        if (data != undefined) {            
            let subtIDStr: RegExpMatchArray | null;
            subtIDStr = data.match(/\d+(?=(\n.+)+)/g);
            
            if (subtIDStr == null) {
                console.log(`no matches found for ${i}.srt`);
                continue;
            }
            
            const subtIDInt = subtIDStr?.map( idStr => parseInt(idStr) + i * 10000)
            
            allIDs.push(...subtIDInt)
        }
    }
    const arrayIDStr = allIDs.join('\n') + '\n';
    fs.writeFileSync(path.join(__dirname, `../assets/allIDs.txt`), arrayIDStr, 'utf8');

}

main();