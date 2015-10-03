/**
 * Created by semir.sabic on 20.4.2014.
 */
define([
    'marionette',
    'text!templates/careerpath/category.html'
], function (Marionette, Template) {
    "use strict";

    var CategoryItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'tr',

        initialize: function () {
            this.model.on('saved', this.render, this);
        }
    });

    return CategoryItemView;
});
