import * as dotenv from 'dotenv';
dotenv.config();
import UrlCheckerAPI from "./api.js";

const api = new UrlCheckerAPI();
void api.start();