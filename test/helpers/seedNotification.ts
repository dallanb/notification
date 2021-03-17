import { Notification } from '../../src/models';

const seedNotification = async (recipient: string, sender: string) => {
    return await Notification.create({
        topic: 'leagues',
        key: 'league_created',
        recipient,
        sender,
        properties: {},
    });
};

export default seedNotification;
