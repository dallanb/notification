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
            CONTEST_INACTIVE: 'contest_inactive',
            CONTEST_ACTIVE: 'contest_active',
            CONTEST_COMPLETED: 'contest_completed',
            PARTICIPANT_INVITED: 'participant_invited',
            PARTICIPANT_INACTIVE: 'participant_inactive',
            PARTICIPANT_ACTIVE: 'participant_active',
            PARTICIPANT_COMPLETED: 'participant_completed',
        },
        MEMBERS: {
            MEMBER_PENDING: 'member_pending',
            MEMBER_ACTIVE: 'member_active',
        },
        LEAGUES: {
            LEAGUE_CREATED: 'league_created',
            MEMBER_CREATED: 'member_created',
            MEMBER_PENDING: 'member_pending',
            MEMBER_ACTIVE: 'member_active',
            MEMBER_INACTIVE: 'member_inactive',
        },
        SCORES: {
            STROKE_UPDATE: 'stroke_update',
        },
    },
};

export default constants;
