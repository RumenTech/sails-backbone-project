/**
 * Created by semir.sabic on 3/20/14.
 */
define([
    'marionette',
    'text!templates/findcolleges/suggestions.html',
    'views/findcolleges/suggestion_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var SuggestionsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        initialize: function (params) {
            this.params = params;
            this.collection = params.collection;

            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        events: {
            'click #loadColleges': 'loadColleges'
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.loadColleges();
            }
        },

        loadColleges: function () {
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
                            $('#loadColleges').html('No more colleges found');
                        }
                    }, this)}
            );
        }
    });
    return SuggestionsCompositeView;
});