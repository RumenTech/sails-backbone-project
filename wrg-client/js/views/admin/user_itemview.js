define([
    'marionette',
    'text!templates/admin/user.html'
], function(Marionette, Template) {
    "use strict";

    var UserItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        initialize: function() {
        },

        onRender : function () {
            $('body').css('visibility','visible');
        }
    });

    return UserItemView;
});
