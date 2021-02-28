import { Libs } from '../../src/providers';

const seedSubscription = async (uuid: string, user: string) => {
    return await Libs.pg.query(
        'INSERT INTO subscription(ctime, uuid, user_uuid)' +
            'VALUES($1, $2, $3)',
        [+new Date(), uuid, user]
    );
};

export default seedSubscription;
