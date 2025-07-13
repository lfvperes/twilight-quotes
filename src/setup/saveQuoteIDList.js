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
    let allIDs = [];
    for (let i = 1; i <= 5; i++) {
        let data;
        try {
            data = fs.readFileSync(path.join(__dirname, `../subtitles/new/${i}.srt`), 'utf8');
        }
        catch (err) {
            console.error('Error reading file:', err);
            continue;
        }
        // get subtitle numbers
        if (data != undefined) {
            let subtIDStr;
            subtIDStr = data.match(/\d+(?=(\n.+)+)/g);
            if (subtIDStr == null) {
                console.log(`no matches found for ${i}.srt`);
                continue;
            }
            const subtIDInt = subtIDStr?.map(idStr => parseInt(idStr) + i * 10000);
            allIDs.push(...subtIDInt);
        }
    }
    const arrayIDStr = allIDs.join('\n') + '\n';
    fs.writeFileSync(path.join(__dirname, `../assets/allIDs.txt`), arrayIDStr, 'utf8');
}
main();
