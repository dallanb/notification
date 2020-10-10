import config from '../../config';
import { logger } from '../../common';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: config.POSTGRES_URL,
});

export default pool;
