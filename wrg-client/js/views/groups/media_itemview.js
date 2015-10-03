define([
    'marionette',
    'text!templates/groups/group_media.html',
    'models/groups/media_model'
], function (Marionette, Template, Media) {
    "use strict";

    var GroupMediaView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .close-reveal-modal .close-modal': 'closeModal',
            'click .show-modal': 'showPicture'
        },

        initialize: function (params) {
            this.model.on('saved', this.onRender, this);

        },

        getYouTubeVideoImage: function (url, size) {
            if (url === null) {
                return '';
            }

            size = (size === null) ? 'big' : size;
            var vid;
            var results;

            if (url.indexOf('watch?v=') != -1) {
                results = url.replace('http://www.youtube.com/watch?v=', '');
                vid = results;
            } else if (url.indexOf('youtu.be') !== -1) {
                results = url.replace('http://youtu.be/', '');
                vid = results;
            }

            if (size === 'small') {
                return '//img.youtube.com/vi/' + vid + '/2.jpg';
            } else {
                return '//img.youtube.com/vi/' + vid + '/0.jpg';
            }
        },

        onBeforeRender: function () {
            var model = this.model;
            if (model.attributes.type === 'video') {
                var embeddedUrl = this.getYouTubeVideoImage(model.attributes.media_url, 'small');
                this.model.set('embedded', embeddedUrl);
            }
        },

        onRender: function (params) {
            this.render;
        },

        showPicture: function () {
            var model = this.model,
                isVideo = model.get('type');
            $('#mediaCaption').html('');
            if (isVideo === 'video') {
                var shortUrl = model.attributes.media_url.split("watch?v="),
                    embeddedUrl = shortUrl[0] + 'embed/' + shortUrl[1];
                $('#bigPicture').html('');
                var photoUrl = model.get('media_url');
                var myImage = $('<iframe/>', {
                    width: "300",
                    height: "300",
                    src: embeddedUrl
                });
                $('#mediaCaption').append(model.attributes.video_caption);
                $('#bigPicture').append(myImage);
            } else {
                $('#bigPicture').html('');
                var photoUrl = model.get('media_url');
                var myImage = $('<img/>', {
                    width: "300",
                    height: "300",
                    src: photoUrl
                });
                $('#bigPicture').append(myImage);
                $('#mediaCaption').append(model.attributes.photo_caption);
            }
        }
    });
    return GroupMediaView;
});