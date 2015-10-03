define([
    'marionette',
    'text!templates/college/media.html',
    'views/college/media_itemview',
    'collections/college/media',
    'views/college/edit/media_form_view'
], function (Marionette, Template, ItemView, MediaCollection, FormView) {
    "use strict";

    var MediaCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        initialize: function (params) {
            this.role = params.role;
            this.collection = new MediaCollection(params.data, params);

            this.collection.on('remove', function (model, attributes) {
                var modelSize = this.collection.models.length;
                if (modelSize > 0) {
                    this.mediaCounter(this.collection.meta("currentPosition"), modelSize, true);
                }
            }, this);

            this.collection.on('change', function (model, attributes) {

                var modelSize = this.collection.models.length;
                this.mediaCounter(this.collection.meta("currentPosition"), modelSize);

                //first media ever added
                if (this.collection.models.length === 1) {
                    $("#leftMediaNavigator").show();
                    $("#rightMediaNavigator").show();
                    this.collection.meta("currentPosition", 0);
                    this.showPicture("firstmedia", model.attributes);
                }
            }, this);
        },

        events: {
            'click .icon-plus.tip-top': 'newMedia',
            'click #rightMediaNavigator': function () {
                this.showPicture("right");
            },
            'click #leftMediaNavigator': function () {
                this.showPicture("left");
            }
        },

        newMedia: function () {
            this.trigger('showModal', this, FormView, this.collection);
        },

        onShow: function () {
            if (this.collection.length > 0) {
                $('#collegeGallery').css('display', 'inline');
            }
            var role = this.role;

            var rightButtonHtml = "<a id='rightMediaNavigator' title='Next Media' class='right' ><span style='font-size:40px' class='glyphicon glyphicon-arrow-right'></span></a>";
            var leftButtonHtml = "<a id='leftMediaNavigator' title='Previous Media' class='left' ><span style='font-size:40px' class='glyphicon glyphicon-arrow-left'></span></a>";

            $("#imageNavigationButtons").prepend(rightButtonHtml);
            $("#imageNavigationButtons").prepend(leftButtonHtml);

            if (role !== "admin" && role !== "moderator") {
                $("#addGroupMedia").remove();
            }

            var size = this.collection.models.length;

            if (size !== 0) { //show initial media items if any
                this.collection.meta("currentPosition", 0);
                this.showPicture("left");
            } else {//model is empty hide the controls
                $("#leftMediaNavigator").hide();
                $("#rightMediaNavigator").hide();
            }
        },

        showPicture: function (direction, onChangeValue) {
            var originalPosition = this.collection.meta("currentPosition"); //run this via utils converter
            var imageSrc = "";
            var tempObject;
            var modelSize = this.collection.models.length;
            var isVideo = ""; //this.model.attributes.media[originalPosition].type;

            if (direction === "firstmedia") {
                imageSrc = onChangeValue.media_url;
                isVideo = onChangeValue.type;
                tempObject = onChangeValue;
                this.mediaRenderer(isVideo, imageSrc, tempObject, originalPosition, modelSize);
            }

            if (direction === "right") {
                if (originalPosition === modelSize - 1) {
                    this.collection.meta("currentPosition", 0);

                    tempObject = this.collection.models[0].attributes;
                    imageSrc = tempObject.media_url;
                    isVideo = tempObject.type;
                    this.mediaRenderer(isVideo, imageSrc, tempObject, 0, modelSize);
                } else {
                    originalPosition++;
                    tempObject = this.collection.models[originalPosition].attributes;
                    imageSrc = tempObject.media_url;
                    isVideo = tempObject.type;
                    this.collection.meta("currentPosition", originalPosition);
                    this.mediaRenderer(isVideo, imageSrc, tempObject, originalPosition, modelSize);
                }
            }
            if (direction === "left") {
                if (originalPosition === 0) {
                    tempObject = this.collection.models[originalPosition].attributes;
                    imageSrc = tempObject.media_url;
                    isVideo = tempObject.type;
                    this.mediaRenderer(isVideo, imageSrc, tempObject, originalPosition, modelSize);
                } else {
                    originalPosition--;
                    tempObject = this.collection.models[originalPosition].attributes;
                    imageSrc = tempObject.media_url;
                    isVideo = tempObject.type;
                    this.collection.meta("currentPosition", originalPosition);
                    this.mediaRenderer(isVideo, imageSrc, tempObject, originalPosition, modelSize);
                }
            }
        },

        mediaRenderer: function (isVideo, imageSrc, tempObject, originalPosition, modelSize) {
            $('#mediaCaption').html('');
            if (isVideo === 'video') {
                var shortUrl = imageSrc.split("watch?v="),
                    embeddedUrl = shortUrl[0] + 'embed/' + shortUrl[1];
                $('#bigPicture').html('');

                var myImage = $('<iframe/>', {
                    width: "300",
                    height: "300",
                    src: embeddedUrl
                });

                $('#mediaCaption').html(tempObject.video_caption);
                $('#bigPicture').append(myImage);
                originalPosition++;
                $('#mediaCounter').html(originalPosition + " of " + modelSize);
            } else {
                $('#bigPicture').html('');
                var photoUrl = imageSrc;
                var myImage = $('<img/>');
                myImage.attr('width', 300);
                myImage.attr('height', 300);
                myImage.attr('class', "groupMediaPhoto");
                myImage.attr('src', photoUrl);

                $('#bigPicture').append(myImage).hide().fadeIn(1000);
                $('#mediaCaption').html(tempObject.photo_caption);
                originalPosition++;
                $('#mediaCounter').html(originalPosition + " of " + modelSize);
            }
        },

        mediaCounter: function (originalPosition, modelSize, deleted) {
            if (deleted) {    //in delete case, ensure we point to the last media in collection
                this.collection.meta(("currentPosition"), modelSize);

                var myModel = this.collection.models[modelSize - 1].attributes;
                this.mediaRenderer(myModel.type, myModel.media_url, myModel, originalPosition, modelSize);

                $('#mediaCounter').html(modelSize + " of " + modelSize);
            } else {
                originalPosition++;
                $('#mediaCounter').html(originalPosition + " of " + modelSize);
            }
        },

        edit: function () {
            this.trigger('showEditModal', this, FormView, this.collection);
        }
    });

    return MediaCollectionView;
});