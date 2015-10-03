define([
    'marionette',
    'text!templates/findfriends/suggestions.html',
    'views/findfriends/suggestion_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var SuggestionsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.suggestions-list',

        initialize: function (params) {
            this.collection = params.collection;
            //Scroll event
            _.bindAll(this, "checkScroll"); //What does this do?
            $(window).scroll(this.checkScroll);

        },
        events: {
            'click .load_friends': 'moreFriends'
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreFriends();
            }
        },

        moreFriends: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({ data: $.param({
                    name: $('#name').val(),
                    company: $('#company').val(),
                    school: $('#school').val(),
                    major: $('#major').val(),
                    limit: this.collection.length + 10
                }),
                    success: _.bind(function () {
                        if (this.collection.length === this.result_length) {
                            $('.load_friends').html('No more friends found');
                        }
                        //this.trigger('loaded');
                    }, this)
                }
            );
        }
    });
    return SuggestionsCompositeView;
});