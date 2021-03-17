// @ts-ignore
import globals from './globals';

const deleteAllSubscriptions = async () => {
    return await globals.pg.query('DELETE FROM subscription');
};

export default deleteAllSubscriptions;
