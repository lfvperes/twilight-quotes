import * as fs from 'fs';
import * as path from 'path';

async function main() {
        let data: string | undefined;
        let filename = 2;
        try {
            data = fs.readFileSync(path.join(__dirname, `./subtitles/${filename}.srt`), 'utf8');
        } catch (err) {
            console.error('Error reading file:', err);
        }
        
        // get subtitle numbers
        if (data != undefined) {            
            // let cleanText: string | ArrayBufferView;
            let cleanText = '';
            const regExItalic = new RegExp(`<\/?i>`,'g'); // 2 and 3
            const regExMusicSymb = new RegExp(`[0-9]+\n.+-->.+\n♪.+(\n.+)*`,'g'); // 1 and 3 - whole quote
            const allCapsTxt = new RegExp(`[0-9]+\n.+-->.+\n\([A-Z\s]+\)`,'g'); // 2, 3, 4 and 5 - whole quote
            //extra [0-9]+\n.+-->.+\n(~\s\([A-Z\s]+\)\n)+\n
            const regExFontClr = new RegExp(`<\/?font(\scolor="#[a-z0-9]{6}")?>`,'g'); // 5
            
            switch (filename) {
                case 1:
                    cleanText = data.replaceAll(regExMusicSymb,'');
                    break;            
                case 2:
                    cleanText = data.replaceAll(regExItalic,'');
                    cleanText = cleanText.replaceAll(allCapsTxt,'');
                    break;            
                case 3:
                    cleanText = data.replaceAll(regExMusicSymb,'');
                    cleanText = cleanText.replaceAll(allCapsTxt,'');
                    cleanText = cleanText.replaceAll(regExItalic,'');
                    break;
                case 4:
                    cleanText = data.replaceAll(allCapsTxt,'');
                    break;
                    case 5:
                    cleanText = data.replaceAll(allCapsTxt,'');
                    cleanText = cleanText.replaceAll(regExFontClr,'');
                    break;
                default:
                    break;
            }
            
            fs.writeFileSync(path.join(__dirname, `./subtitles/${filename}.srt`), cleanText, 'utf8');            
            
        }
    }

main();