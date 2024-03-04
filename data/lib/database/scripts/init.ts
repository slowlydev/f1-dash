import { Database } from 'bun:sqlite';
import { config } from '../../config/config';
import { info } from '../../logger/logger';

info('initializing empty database');

new Database(config.databasePath, { create: true });
