import { Message } from 'kafka-node';
import { Account, Auth, Contest, Score, Sport, Wager } from '../services';

class Services {
    listener({ topic, key, value }: Message): void {
        switch (topic) {
            case 'auth':
                Auth.handleEvent(key, value);
                break;
            case 'accounts':
                Account.handleEvent(key, value);
                break;
            case 'contests':
                Contest.handleEvent(key, value);
                break;
            case 'scores':
                Score.handleEvent(key, value);
                break;
            case 'sports':
                Sport.handleEvent(key, value);
                break;
            case 'wagers':
                Wager.handleEvent(key, value);
                break;
            default:
                throw new Error('Invalid topic');
        }
    }
}
export default new Services();
