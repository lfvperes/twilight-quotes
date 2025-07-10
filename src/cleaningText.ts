import * as fs from 'fs';
import * as path from 'path';

function removeTimestamps(text: string) {
    console.log("Removing timestamps");
    return text.replaceAll(/\n+\d+:\d+:\d+,\d+ --> \d+:\d+:\d+,\d+/g, '');
}

function joinPhrases(text: string) {
    console.log("Joining incomplete quotes");
    // if phrase starts lowercase move to previous block
    // works even with timestamps
    text = text.replaceAll(/\n{2}\d+(\n.+-->.+)*(?=\n[a-z])/g, '');

    // join all lines in one
    text = text.replaceAll(/(?<=[a-z])\n(?=[a-z])/g, ' ');
    
    return text;
}

function removeItalic(text: string) {
    console.log("Removing Italic tags");
    return text.replaceAll(/<\/?i>/g, '');
}

function removeMusicQuote(text: string) {
    console.log("Removing music quotes");
    // works even with timestamps
    return text.replaceAll(/[0-9]+(\n.+-->.+)*\n.*(\(.+PLAYING\)|♪).*\n{2}/g,'');
}

function removeFontClrTag(text: string) {
    console.log("Removing Font Color tags");
    return text.replaceAll(/<\/?font(\scolor="#[0-9a-fA-F]{6}")?>/g,'');
}
function removeAllCapsPrths(text: string) {
    console.log("Removing parenthesis description");
    return text.replaceAll(/[0-9]+(\n.+-->.+)*\n\([A-Z]+\)\n{2}/g,'');
}

function correctNewlineFormat(filePath: string) {
    const rawContent = fs.readFileSync(filePath, 'binary');
    let content = fs.readFileSync(filePath, 'utf8');
    if (rawContent.includes('\r\n') || rawContent.includes('\r')) {
        content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        console.log(`Newline format corrected to LF on file ${path.basename(filePath)}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
    return content;
}

async function cleanText(filename: string) {
    let content: string | undefined;
    let filePath = path.join(__dirname, `./subtitles/original/${filename}.srt`);
    console.log(`\nCleaning text from file ${path.basename(filePath)}...`);
    try {
        const rawContent = fs.readFileSync(filePath, 'binary');
        content = fs.readFileSync(filePath, 'utf8');
        if (rawContent.includes('\r\n') || rawContent.includes('\r')) {
            content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            console.log(`Newline format corrected to LF on file ${path.basename(filePath)}`);
        }
    } catch (err) {
        console.error('Error reading file:', err);
    }
    
    // get subtitle numbers
    if (content != undefined) {            
        let cleanText: string;

        cleanText = removeTimestamps(content);
        switch (Number(filename)) {
            case 1:
                    cleanText = removeMusicQuote(cleanText);
                break;            
            case 2:
                    cleanText = removeItalic(cleanText);
                    // cleanText = removeAllCapsPrths(cleanText);
                break;            
            case 3:
                    cleanText = removeItalic(cleanText);
                    cleanText = removeMusicQuote(cleanText);
                    // cleanText = removeAllCapsPrths(cleanText);
                break;
            case 4:
                    cleanText = removeMusicQuote(cleanText);
                    // cleanText = removeAllCapsPrths(cleanText);
                break;
            case 5:
                    cleanText = removeFontClrTag(cleanText);
                    // cleanText = removeAllCapsPrths(cleanText);
                break;
            default:
                break;
        }
        cleanText = joinPhrases(cleanText);
        
        let newPath = path.join(__dirname, `./subtitles/new/${path.basename(filePath)}`);
        fs.writeFileSync(newPath, cleanText, 'utf8');            
        console.log(`Done cleaning ${path.basename(filePath)}, new file at ${path.relative('',newPath)}`);
    }
}