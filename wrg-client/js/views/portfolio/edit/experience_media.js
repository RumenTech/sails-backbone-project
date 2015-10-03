define(['marionette',
        'text!templates/portfolio/edit/experience_media.html'],

    function (Marionette, MediaTemplate) {
        'use strict';

        var MediaItemTemplate = Marionette.ItemView.extend({
            tagName: 'li',
            className: 'media-item large-3',
            template: MediaTemplate,
            events: {
                'click .icon-delete': 'deleteMe',
                'change .select-type-media': 'changetype'
            },

            onRender: function () {
                if (this.model.id) {
                    this.$('#media-image-form-' + this.model.get('index')).hide();
                }
            },

            changetype: function (obj) {
                if (this.$('.select-type-media').val() == 'Video') {
                    this.$('.video-selected').show();
                    this.$('.file-selected').hide();

                } else {
                    this.$('.video-selected').hide();
                    this.$('.file-selected').show();
                }
            },

            deleteMe: function () {

                if (this.model.id == undefined) {
                    this.trigger('new:remove');
                } else {
                    this.model.set('deleted', 'on');
                    this.close();
                }
            }
        });

        var MediaCollectionTemplate = Marionette.CollectionView.extend({
            itemView: MediaItemTemplate,
            tagName: 'ul',
            className: 'media-list panel',
            initialize: function (params) {
                this.collection = params.data;
                this.on('itemview:new:remove', this.onNewMediaRemove);
            },
            onNewMediaRemove: function (child) {
                this.collection.remove(child.model);
            }
        });
        return MediaCollectionTemplate;
    }
);