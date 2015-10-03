define([
    'marionette',
    'text!templates/portfolio/experience_points.html',
    'models/portfolio/ranking',
    'collections/portfolio/future_self',
    'views/portfolio/future_self_compositeview',
    'views/portfolio/edit/future_self_note_form_view',
    'utils/conversionUtils',
    'lib/jqueryui'
], function (Marionette, Template, Model, FutureSelfCollection, FutureSelfCompositeView, FormView, ConversionUtils) {
    'use strict';

    var ExperiencePointsView = Marionette.Layout.extend({
        template: Template,

        regions: {
            futureSelfList: '#futureSelf'
        },

        events: {
            'click #showFutureSelf': 'showFutureSelf',
            'click #showXpPoints': 'showXpPoints'
        },

        initialize: function (params) {
            var calculatedValue,
                inlineStyle;

            this.model = new Model();
            this.ranking = ConversionUtils.calculateProfessionalPoints(params.data.models);
            this.experiencesCollection = params.data;
            this.config = params.reqres.request('config');
            var options = {};
            this.reqres = params.reqres;
            options.reqres = params.reqres;
            this.futureSelfCollection = new FutureSelfCollection(null, options);
            this.listenTo(this.futureSelfCollection, 'loaded', this.onLoaded);
            for (var i = 0; i < this.ranking.length; i++) {
                if (this.ranking[i] < 8) {
                    calculatedValue = this.ranking[i] * 11 + '%'; //Fix for Internet explorer all browsers.
                    //IE cant render "style" HTML attribute properly, therefore it is served as a model property
                    inlineStyle = "style=width:" + calculatedValue + ";";

                    this.model.set('percent_' + i, inlineStyle);
                    this.model.set('number_' + i, this.ranking[i]);
                } else {
                    inlineStyle = "style=width:" + "88%;";
                    this.model.set('percent_' + i, inlineStyle);
                    this.model.set('number_' + i, this.ranking[i] + "+");
                }
            }
        },

        showModal: function(view, formClass, collection) {
            this.trigger('showModal', view, formClass, collection);
        },

        showExpModal: function(view, formClass, collection) {
            view.model = null; // Set model as null so that experience form view can initiate new Experience model
            this.trigger('showExpModal', view, formClass, this.experiencesCollection);
        },

        onLoaded: function () {
            this.futureSelfList.show(new FutureSelfCompositeView({
                reqres: this.reqres,
                data: this.futureSelfCollection
            }));
            this.listenTo(this.futureSelfList.currentView, 'showModal itemview:showModal', this.showModal, this);
            this.listenTo(this.futureSelfList.currentView, 'itemview:showExpModal', this.showExpModal, this);
        },

        showFutureSelf: function () {
            $('#futureSelf').css('display', 'block');
            $('#experiencePoints').css('display', 'none');
        },

        showXpPoints: function () {
            $('#futureSelf').css('display', 'none');
            $('#experiencePoints').css('display', 'block');
        }
    });
    return ExperiencePointsView;
});