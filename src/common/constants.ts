const constants = {
    TOPICS: {
        AUTH: 'auth',
        ACCOUNTS: 'accounts',
        CONTESTS: 'contests',
        SCORES: 'scores',
        SPORTS: 'sports',
        WAGERS: 'wagers',
        NOTIFICATIONS: 'notifications',
    },
    EVENTS: {
        NOTIFICATIONS: {
            PENDING: 'pending',
        },
        CONTESTS: {
            CONTEST_CREATED: 'contest_created',
            CONTEST_READY: 'contest_ready',
            CONTEST_ACTIVE: 'contest_active',
            PARTICIPANT_INVITED: 'participant_invited',
            PARTICIPANT_ACTIVE: 'participant_active',
        },
    },
};

export default constants;
