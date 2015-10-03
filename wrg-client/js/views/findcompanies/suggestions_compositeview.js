define([
    'marionette',
    'text!templates/findcompanies/suggestions.html',
    'views/findcompanies/suggestion_itemview',
    'collections/companies'
], function (Marionette, Template, ItemView, Companies) {
    "use strict";

    var SuggestionsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        events: {
            'click .load_companies': 'moreCompanies'
        },

        initialize: function (params) {
            this.params = params;
            this.collection = params.collection;

            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreCompanies();
            }
        },

        moreCompanies: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({
                    data: $.param({
                        name: $('#name').val(),
                        state: $('#state').val(),
                        city: $('#city').val(),
                        limit: this.collection.length + 10
                    }),
                    success: _.bind(function () {
                        if (this.collection.length === this.result_length) {
                            $('.load_companies').html('No more companies found');
                        }
                    }, this)}
            );
        }
    });
    return SuggestionsCompositeView;
});