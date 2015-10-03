define([
	'marionette',
	'text!templates/alumni/friend_request.html',
	'models/connection'
], function(Marionette, Template, Connection) {
    "use strict";

	var FriendRequestView = Marionette.ItemView.extend({
		template: Template,

		events: {
			'click .button.add-friend': 'addFriend'
		},

		initialize: function(params) {
			this.model = new Connection(null, params);
		},

		addFriend: function() {
			// TODO: Save the new connection.
		}
	});

	return FriendRequestView;
});