define([
    'marionette',
    'text!templates/alumni/gallery.html',
    'views/alumni/alumnus_thumbnail_view'
], function (Marionette, Template, ItemView) {
    "use strict";

    var GalleryCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.alumni-list',

        events: {
            'click .load_stories': 'moreStories'
        },

        initialize: function (params) {
            this.collection = params.collection;

            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreStories();
            }
        },

        moreStories: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({ data: $.param({
                    name: $('#name').val(),
                    company: $('#company').val(),
                    major: $('#major').val(),
                    limit: this.collection.length + 12
                }),

                    success: _.bind(function () {
                        if (this.collection.length === this.result_length) {
                            $('.load_stories').html('No more stories found.');
                        }
                        //this.trigger('loaded');
                    }, this)
                }
            );
        }
    });

    return GalleryCompositeView;
});