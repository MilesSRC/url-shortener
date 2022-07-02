/* Imports */
import { config } from 'dotenv';
import managers from './lib/Managers';
import server from './lib/Server';

/* Import config */
config();

/* Start Managers */
managers();

/* Start Server */
server(__dirname);