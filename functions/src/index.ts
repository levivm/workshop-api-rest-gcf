/* src/index.ts */

import * as functions from 'firebase-functions';
import { Server }  from "./server";

const appServer = new Server();
appServer.appExecute();

export const webApi = functions.https.onRequest(appServer.main);
