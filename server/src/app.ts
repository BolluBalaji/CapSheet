import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';


class App {
    public app: Application;
    constructor() {
        this.app = express();
        this.config();
    }
    private config(): void {
        this.app.use(cors());
        this.app.use(fileUpload());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
    }
}

export default new App().app;


