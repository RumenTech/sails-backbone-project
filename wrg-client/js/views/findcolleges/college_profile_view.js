/**
 * Created by semir.sabic on 3/20/14.
 */

define([
    'marionette',
    'text!templates/findcolleges/college_profile.html',
    'lib/backbone.modelbinder',
    'models/college_profile',
    'views/findcolleges/media_view',
    'regions/modal_region'
], function (Marionette, Template, ModelBinder, CollegeProfile, MediaView, ModalRegion) {
    "use strict";

    var CollegeProfileView = Marionette.Layout.extend({
        template: Template,

        regions: {
            sponsors: '#sponsors-section',
            modal: ModalRegion
        },

        events: {
            'click .project-view': 'openModal',
            'click .candidates': 'showCandidate'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var collegeId = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.model = new CollegeProfile(collegeId, params);

            this.listenTo(this.model, 'loaded', this.onLoaded, this);
        },

        onLoaded: function () {
            var media = this.model.get('media'),
                candidates = this.model.get('candidates');
            for (var i = 0; i < media.length; i++) {
                if (media[i].type === 'video') {
                    var shortUrl = media[i].media_url.split("watch?v=");
                    media[i].id_video = shortUrl[1];
                    media[i].showIndex = i;
                    media[i].embedded = shortUrl[0] + 'embed/' + shortUrl[1];
                }
            }
            for (var i = 0; i < candidates.length; i++) {
                candidates[i].index = i;
            }
            this.render();
        },

        onRender: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility', 'visible');
            $('#candidate-0').click();
        },

        openModal: function (e) {
            var index = $(e.currentTarget).attr('index');
            this.showModal(MediaView, this.model);
        },

        showModal: function (formClass, model) {
            var options = {
                model: model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: model, reqres: this.reqres}, options));
        },

        showCandidate: function (e) {
            var candidates = this.model.get('candidates');
            var index = e.currentTarget.id.split('-')[1];
            $('div[id^="candidate-"]').css("background-color", "#ffffff");
            $('#candidate-' + index).css("background-color", "#00b3f0");
            $('#descriptionTitle').text(candidates[index].field);
            $('#descriptionText').text(candidates[index].description);
        }
    });
    return CollegeProfileView;
});