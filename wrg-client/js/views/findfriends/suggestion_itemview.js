define([
    'marionette',
    'text!templates/findfriends/suggestion.html',
    'views/findfriends/friend_request_view',
    'utils/conversionUtils'
], function (Marionette, Template, FriendRequestView, ConversionUtils) {
    "use strict";

    var SuggestionItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #iconAdd': 'addFriend',
            'click #friend': 'viewReadOnlyIndividual'
        },

        addFriend: function () {
            this.trigger('showModal', FriendRequestView);
        },

        initialize: function () {
            this.reduceInformationSize();
        },

        reduceInformationSize: function () {
            var information = this.model.get('information'),
                reducedInformation = '', emptyInformation;
            if (information !== undefined && information !== null) {
                emptyInformation = information.split(" ");
                if (emptyInformation[0] === '' && emptyInformation[1] === 'at') {
                    reducedInformation = '';
                } else if (information.length > 45) {
                    reducedInformation = information.slice(0, 45) + '...';
                } else {
                    reducedInformation = information;
                }
            }
            this.model.set('reducedInformation', reducedInformation);
        },

        viewReadOnlyIndividual: function () {
            if (this.model.get('role') === "student") {
                window.location = '#student/' + ConversionUtils.returnInteger(this.model.get('user_id'), 'Could not convert user id');
            }
            else {
                window.location = '#alumni_user/' + ConversionUtils.returnInteger(this.model.get('user_id'), 'Could not convert user id');
            }
        }
    });
    return SuggestionItemView;
});