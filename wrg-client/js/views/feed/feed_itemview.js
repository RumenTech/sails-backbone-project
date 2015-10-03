/**
 * Created by semir.sabic on 29.4.2014.
 */
define([
    'marionette',
    'text!templates/feed/feed.html'
], function (Marionette, Template) {
    "use strict";

    var FeedItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        initialize: function () {
            this.model.on('saved', this.render, this);

            if (this.model.get('user_role') === 'student') {
                this.model.set('user_url', '#student/' + this.model.get('user_id'));
            }
            else if (this.model.get('user_role') === 'alumni') {
                this.model.set('user_url', '#alumni_user/' + this.model.get('user_id'));
            }
            else if (this.model.get('user_role') === 'company') {
                this.model.set('user_url', '#company/' + this.model.get('user_id'));
            }
            else {
                this.model.set('user_url', '#college/' + this.model.get('user_id'));
            }

            if (this.model.get('event_type') === 'connection') {
                if (this.model.get('connection_role') === 'student') {
                    this.model.set('connection_url', '#student/' + this.model.get('connection_id'));
                }
                else {
                    this.model.set('connection_url', '#alumni_user/' + this.model.get('connection_id'));
                }
            }
        }
    });
    return FeedItemView;
});
