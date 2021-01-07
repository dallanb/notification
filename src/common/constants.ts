const constants = {
    TOPICS: {
        AUTH: 'auth',
        ACCOUNTS: 'accounts',
        CONTESTS: 'contests',
        LEAGUES: 'leagues',
        MEMBERS: 'members',
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
            PARTICIPANT_COMPLETED: 'participant_completed',
        },
        MEMBERS: {
            MEMBER_INVITED: 'member_invited',
            MEMBER_ACTIVE: 'member_active',
        },
        LEAGUES: {
            LEAGUE_CREATED: 'league_created',
        },
        SCORES: {
            STROKE_UPDATE: 'stroke_update',
        },
    },
};

export default constants;
