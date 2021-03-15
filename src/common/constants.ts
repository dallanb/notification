const constants = {
    TOPICS: {
        AUTH: 'auth',
        ACCOUNTS: 'accounts',
        CONTESTS: 'contests',
        COURSES: 'courses',
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
        COURSES: {
            COURSE_CREATED: 'course_created',
            COURSE_APPROVED: 'course_approved',
        },
        MEMBERS: {
            AVATAR_CREATED: 'avatar_created',
            AVATAR_UPDATED: 'avatar_updated',
            AVATAR_DELETED: 'avatar_deleted',
            MEMBER_PENDING: 'member_pending',
            MEMBER_ACTIVE: 'member_active',
            DISPLAY_NAME_UPDATED: 'display_name_updated',
            COUNTRY_UPDATED: 'country_updated',
            STAT_UPDATED: 'stat_updated',
            WALLET_UPDATED: 'wallet_updated',
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
        WAGERS: {
            WAGER_CREATED: 'wager_created',
            PAYOUT_UPDATED: 'payout_updated',
        },
    },
};

export default constants;
