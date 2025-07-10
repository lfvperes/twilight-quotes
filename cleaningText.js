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
async function main() {
    let data;
    let filename = 2;
    try {
        data = fs.readFileSync(path.join(__dirname, `./subtitles/${filename}.srt`), 'utf8');
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
    // get subtitle numbers
    if (data != undefined) {
        // let cleanText: string | ArrayBufferView;
        let cleanText = '';
        const regExItalic = new RegExp(`<\/?i>`, 'g'); // 2 and 3
        const regExMusicSymb = new RegExp(`[0-9]+\n.+-->.+\n♪.+(\n.+)*`, 'g'); // 1 and 3 - whole quote
        const allCapsTxt = new RegExp(`[0-9]+\n.+-->.+\n\([A-Z\s]+\)`, 'g'); // 2, 3, 4 and 5 - whole quote
        //extra [0-9]+\n.+-->.+\n(~\s\([A-Z\s]+\)\n)+\n
        const regExFontClr = new RegExp(`<\/?font(\scolor="#[a-z0-9]{6}")?>`, 'g'); // 5
        switch (filename) {
            case 1:
                cleanText = data.replaceAll(regExMusicSymb, '');
                break;
            case 2:
                cleanText = data.replaceAll(regExItalic, '');
                cleanText = cleanText.replaceAll(allCapsTxt, '');
                break;
            case 3:
                cleanText = data.replaceAll(regExMusicSymb, '');
                cleanText = cleanText.replaceAll(allCapsTxt, '');
                cleanText = cleanText.replaceAll(regExItalic, '');
                break;
            case 4:
                cleanText = data.replaceAll(allCapsTxt, '');
                break;
            case 5:
                cleanText = data.replaceAll(allCapsTxt, '');
                cleanText = cleanText.replaceAll(regExFontClr, '');
                break;
            default:
                break;
        }
        fs.writeFileSync(path.join(__dirname, `./subtitles/${filename}.srt`), cleanText, 'utf8');
    }
}
main();
