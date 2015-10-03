define([
    'marionette',
    'text!templates/home/companies.html'
], function(Marionette, Template) {
    "use strict";

    var CompaniesView = Marionette.ItemView.extend({
        template: Template,

        initialize: function() {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility','visible');
        }
    });
    return CompaniesView;
});