"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 3030;
const app = express_1.default();
app.get('/', (req, res) => {
    res.send("Hey Workinng!");
});
app.listen(PORT, () => {
    console.log(`Server is running on : ${PORT}`);
});
