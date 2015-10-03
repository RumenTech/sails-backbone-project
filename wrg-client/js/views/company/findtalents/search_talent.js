/**
 * Created by Mistral on 12/30/13.
 */
define([
    'marionette',
    'text!templates/company/findtalents/search_talent.html',
    'lib/backbone.modelbinder',
    'models/searched_talents',
    'utils/conversionUtils',
    'views/company/findtalents/media_view',
    'regions/modal_region'
], function (Marionette, Template, ModelBinder, SearchedTalents, ConversionUtils, MediaView, ModalRegion) {
    "use strict";

    var AddEventView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion
        },

        events: {
            'click .project-view': 'openModal'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var talentId = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.model = new SearchedTalents(talentId, params);

            this.listenTo(this.model, 'loaded', this.onLoaded, this);
        },

        onLoaded: function () {
            var experiences = this.model.get('experiences'),
                ranking = ConversionUtils.calculatePoints(experiences);
            for (var i = 0; i < ranking.length; i++) {
                if (ranking[i] < 11) {
                    this.model.set('percent_' + i, (ranking[i] * 11) + '%');
                    this.model.set('number_' + i, ranking[i]);
                } else {
                    this.model.set('percent_' + i, '88%');
                    this.model.set('number_' + i, ranking[i] + "+");
                }
            }

            for (var i = 0; i < experiences.length; i++) {
                var start = ConversionUtils.convertMonth(new Date(experiences[i].start_date).getMonth() + 1) + ', ' + new Date(experiences[i].start_date).getFullYear().toString();
                var end = ConversionUtils.convertMonth(new Date(experiences[i].end_date).getMonth() + 1) + ', ' + new Date(experiences[i].end_date).getFullYear().toString();
                experiences[i].start = start;
                experiences[i].end = end;
                if (experiences[i].media) {
                    if (experiences[i].media.length) {
                        for (var j = 0; j < experiences[i].media.length; j++) {
                            experiences[i].media[j].showIndex = i;
                            if (experiences[i].media[j].type === 'Video') {
                                var shortUrl = experiences[i].media[j].data.split("watch?v=");
                                experiences[i].media[j].id_video = shortUrl[1];
                                experiences[i].media[j].embedded = shortUrl[0] + 'embed/' + shortUrl[1];
                                experiences[i].media[j].isVideo = true;
                            }
                        }
                    }
                }
            }

            this.model.set('experiences', experiences);

            var personalUrl = this.model.get('video_url');
            if (personalUrl !== undefined && personalUrl !== null) {
                var videoUrl = ConversionUtils.parseVideoUrl(personalUrl);
                if (videoUrl !== '') {
                    this.model.set('id_video', videoUrl);
                }
            }

            var month = ConversionUtils.convertMonth(this.model.get('graduation_month'));
            this.model.set('graduation_month', month);
            this.render();
        },

        onRender: function () {
            if (this.model.get('awards') === undefined || this.model.get('awards').length === 0) {
                $("#awardsDiv").hide();
            }

            if (this.model.get('experiences') === undefined || this.model.get('experiences').length === 0) {
                $("#experienceDiv").hide();
            }
            if (this.model.get('skills') === undefined || this.model.get('skills').length === 0) {
                $("#skillsDiv").hide();
            }

            if (this.model.get('personal_statement') === null && this.model.get('video_url') === null) {
                $("#personalStatementDiv").hide();
            }

            if (this.model.get('high_school') === undefined && this.model.get('company') === undefined && this.model.get('job_title') === undefined) {
                $("#portfolioInfoDiv").hide();
            }

            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility', 'visible');
        },

        openModal: function (e) {
            var index = $(e.currentTarget).attr('index');
            var exp = this.model.get('experiences')[index];
            this.showModal(MediaView, exp);
        },

        showModal: function (formClass, model) {
            var options = {
                model: model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: model, reqres: this.reqres}, options));
        }
    });
    return AddEventView;
});
