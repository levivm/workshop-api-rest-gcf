/* src/server.ts */

import * as express from 'express';
import * as bodyParser from "body-parser";
import { Routes }  from "./routes";


export class Server{

    public app: any;
    public main: any;

    constructor(){
        this.app = express();
        this.main = express();
    }

    appConfig(){

        this.main.use('/api/v1', this.app);
        this.main.use(bodyParser.json());
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new Routes(this.app).appRoutes();
    }

    /* Including app Routes ends*/
    appExecute(){

        this.appConfig();
        this.includeRoutes();

    }

}
