/**
 * Created by semir.sabic on 30.4.2014.
 */
define([
    'marionette',
    'text!templates/feed/event.html'
], function (Marionette, Template) {
    "use strict";

    var EventItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        initialize: function () {
            this.model.on('saved', this.render, this);
            this.model.set('datum', new Date(this.model.get('datum')).toDateString());
        }
    });
    return EventItemView;
});
