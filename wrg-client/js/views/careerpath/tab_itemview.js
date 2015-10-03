/**
 * Created by semir.sabic on 18.4.2014.
 */
define([
    'marionette',
    'text!templates/careerpath/tab.html'
], function (Marionette, Template) {
    "use strict";

    var TabItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        initialize: function () {
            this.model.on('saved', this.render, this);
        },

        onShow: function () {
            $("div[class='tabElement']:eq(0)").css('background-color', 'dodgerblue');
        }
    });

    return TabItemView;
});
