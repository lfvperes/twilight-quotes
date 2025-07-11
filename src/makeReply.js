"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readFile_1 = __importDefault(require("./readFile"));
function makeReplyContent(recordObj, textPath) {
    const textContent = (0, readFile_1.default)(textPath);
    return {
        text: textContent,
        createdAt: new Date().toISOString(),
        reply: {
            root: {
                uri: recordObj.uri,
                cid: recordObj.cid
            },
            parent: {
                uri: recordObj.uri,
                cid: recordObj.cid
            }
        }
    };
}
exports.default = makeReplyContent;
