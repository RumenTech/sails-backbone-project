module.exports = {

    attributes: {
        user_id: {
            type: 'integer',
            required: true
        },

        role: {
            type: 'string',
            required: true
        },

        gpa: {
            type: 'boolean'
        },

        wrg_points: {
            type: 'boolean'
        },

        future_self: {
            type: 'boolean'
        },

        skills: {
            type: 'boolean'
        },

        awards: {
            type: 'boolean'
        },

        video: {
            type: 'boolean'
        },

        connections: {
            type: 'boolean'
        }
    },

    createFriendPrivacy: function (privacyContainer, role) {
        privacyContainer.role = role
        Privacy.create(privacyContainer).done(function(err, privacy) {
            if (err) {
                sails.log.error('Cannot create privacy', err);
            } else {
                sails.log.info('General privacy for alumni created');
            }
        });
    }

};
