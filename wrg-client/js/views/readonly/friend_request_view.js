define([
    'marionette',
    'text!templates/findfriends/friend_request.html',
    'models/connection'
], function (Marionette, Template, Connection) {
    'use strict';

    var FriendRequestView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .button.add-friend': 'addFriend'
        },

        initialize: function (options, params) {
            this.config = options.reqres.request('config');
            this.reqres = options.reqres;
            this.collection = params.collection;
            this.model = params.model;
        },

        addFriend: function () {
            $('.add-friend').attr('disabled', 'disabled');
            var user_id = this.model.get("user_id");
            var friend = this.model;
            this.model = new Connection(null, {reqres: this.reqres});
            var urlConnection = this.config.restUrl + '/connection';
            var options = {
                url: urlConnection
            };
            this.model.fetch(
                { data: $.param({ request_user_id: user_id
                }),
                    type: 'POST',
                    success: _.bind(function () {
                        if (this.model.get("id")) {
                            this.model = friend;
                            $('.close-reveal-modal').click();
                            $('#sendFriendRequest').hide();
                        } else {
                            alert("Please try again");
                            this.model = friend;
                            $('#sendFriendRequest').hide();
                        }
                    }, this)
                },
                options
            );
        }
    });
    return FriendRequestView;
});