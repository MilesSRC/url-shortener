import express from "express";
import morgan from 'morgan';
import helmet from "helmet";
import cors from 'cors';
import fs from 'fs';

exports.Server = class Server {
    private app: express.Application;
    private root: string;

    constructor(root: string) {
        this.app = express();
        this.root = root;

        if(!fs.existsSync(root))
            throw new Error(`Path @ ${root} doesn't exist.`);

        this.engine();
        this.config();
        this.routes();
    }

    private engine(): void {
        this.app.set('views', `${this.root}/../src/views`);
        this.app.set('view engine', 'ejs');
    }

    private config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan(process.env.NODE_ENV == 'development' ? 'dev' : 'combined'));
        this.app.use(helmet());
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:8080' || "https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js"
        }));
        this.app.use(express.json());
    }

    private routes(): void {
        fs.readdirSync(`${this.root}/routes`).forEach(file => {
            const route: {
                path: string,
                router: express.Router
            } = require(`${this.root}/routes/${file}`);
            this.app.use(route.path, route.router);
        });

        this.listen();
    }

    public async listen(): Promise<void> {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server on port ${this.app.get('port')}`);
        })
    }
}

export default (root: string) => {
    return new exports.Server(root);
}