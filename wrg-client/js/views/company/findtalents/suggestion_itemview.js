define([
    'marionette',
    'text!templates/company/findtalents/suggestion.html',
    'views/company/findtalents/friend_request_view',
    'utils/conversionUtils',
    'regions/modal_region',
    'models/searched_talents',
    'views/company/findtalents/student_view',
    'config'

], function (Marionette, Template, FriendRequestView, ConversionUtils, ModalRegion, SearchedTalents, StudentView, config) {
    "use strict";

    var SuggestionItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        regions: {
            modal: ModalRegion
        },

        events: {
            'click #iconAdd': 'addFriend',
            'click .talent-photo': 'viewTalentProfile',
            'click .connection-info': 'viewTalentProfile'
        },

        initialize: function (params) {
        },

        addFriend: function () {
            this.trigger('showModal', FriendRequestView);
        },

        viewTalentProfile: function () {
            window.location = '#student/' + ConversionUtils.returnInteger(this.model.get('user_id'), 'Could not convert user id');
        }
    });

    return SuggestionItemView;
});