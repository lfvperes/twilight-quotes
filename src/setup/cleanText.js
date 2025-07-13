"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function removeTimestamps(text) {
    console.log("Removing timestamps");
    return text.replaceAll(/\n+\d+:\d+:\d+,\d+ --> \d+:\d+:\d+,\d+/g, '');
}
function joinPhrases(text) {
    console.log("Joining incomplete quotes");
    // if first phrase starts lowercase move to previous block
    // works even with timestamps
    text = text.replaceAll(/\n{2}\d+(\n.+-->.+)*(?=\n[a-z])/g, '');
    // block ending in comma, gets next block joined to it
    text = text.replaceAll(/(?<=,)\n{2}\d+(\n.+-->.+)*/g, '');
    // multiline blocks with split phrases turn into one line
    text = text.replaceAll(/(?<=[a-z'\dI])\n(?=[a-z])/g, ' ');
    // line ends in comma, next line has anything but a newline character, join them
    text = text.replaceAll(/(?<=,)\n(?=.)/g, ' ');
    return text;
}
function removeItalic(text) {
    console.log("Removing Italic tags");
    return text.replaceAll(/<\/?i>/g, '');
}
function removeMusicQuotes(text) {
    console.log("Removing music quotes");
    // works even with timestamps
    let noSymbol = text.replaceAll(/\n[0-9]+(\n.+-->.+)*\n.*(♪)(.+\n)+/g, '');
    let noDesc = noSymbol.replaceAll(/\n[0-9]+(\n.+-->.+)*\n.*\(.*PLAYING.*\).*\n/g, '');
    return noDesc;
}
function removeFontClrTag(text) {
    console.log("Removing Font Color tags");
    return text.replaceAll(/<\/?font(\scolor="#[0-9a-fA-F]{6}")?>/g, '');
}
function removeAllCapsPrths(text) {
    console.log("Removing parenthesis description");
    return text.replaceAll(/[0-9]+(\n.+-->.+)*\n\([A-Z\s]+\)\n{2}/g, '');
}
function correctNewlineFormat(filePath) {
    const rawContent = fs.readFileSync(filePath, 'binary');
    let content = fs.readFileSync(filePath, 'utf8');
    if (rawContent.includes('\r\n') || rawContent.includes('\r')) {
        content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        console.log(`Newline format corrected to LF on file ${path.basename(filePath)}`);
        // fs.writeFileSync(filePath, content, 'utf8');
    }
    return content;
}
function removeCharNames(text) {
    console.log("Removing Character Names");
    return text.replaceAll(/\b[A-Z\.]+(?:\s+[A-Z0-9]+)*:\s/g, '');
}
async function cleanAllText(filename) {
    let content;
    let filePath = path.join(__dirname, `../../subtitles/original/${filename}`);
    console.log(`\nCleaning text from file ${path.basename(filePath)}...`);
    try {
        content = correctNewlineFormat(filePath);
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
    // get subtitle numbers
    if (content != undefined) {
        let cleanText;
        cleanText = content;
        let fileNum = Number(path.parse(filename).name);
        cleanText = removeTimestamps(content);
        switch (fileNum) {
            case 1:
                cleanText = removeMusicQuotes(cleanText);
                break;
            case 2:
                cleanText = removeItalic(cleanText);
                cleanText = removeMusicQuotes(cleanText);
                cleanText = removeAllCapsPrths(cleanText);
                cleanText = removeCharNames(cleanText);
                break;
            case 3:
                cleanText = removeItalic(cleanText);
                cleanText = removeMusicQuotes(cleanText);
                cleanText = removeAllCapsPrths(cleanText);
                cleanText = removeCharNames(cleanText);
                break;
            case 4:
                cleanText = removeMusicQuotes(cleanText);
                cleanText = removeAllCapsPrths(cleanText);
                cleanText = removeCharNames(cleanText);
                break;
            case 5:
                cleanText = removeFontClrTag(cleanText);
                cleanText = removeMusicQuotes(cleanText);
                cleanText = removeAllCapsPrths(cleanText);
                cleanText = removeCharNames(cleanText);
                break;
            default:
                cleanText = removeItalic(cleanText);
                cleanText = removeMusicQuotes(cleanText);
                cleanText = removeAllCapsPrths(cleanText);
                cleanText = removeCharNames(cleanText);
                break;
        }
        cleanText = joinPhrases(cleanText);
        let newPath = path.join(__dirname, `../../subtitles/new/${path.basename(filePath)}`);
        fs.writeFileSync(newPath, cleanText, 'utf8');
        console.log(`Done cleaning ${path.basename(filePath)}, new file at ${path.relative('', newPath)}`);
    }
}
for (let i = 1; i <= 5; i++) {
    cleanAllText(`${i}.srt`);
}
// cleanAllText('sample.srt');
