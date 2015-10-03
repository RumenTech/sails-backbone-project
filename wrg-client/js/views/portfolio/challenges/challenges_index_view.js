define([
    'marionette',
    'text!templates/portfolio/challenges/challenges_index.html',
    'regions/modal_region',
    'models/portfolio/student',
    'views/portfolio/challenges/challenges_compositeview',
    'views/portfolio/challenges/filter_form_view',
    'collections/portfolio/challenges',
    'views/messages/sponsors_view'
], function (Marionette, Template, ModalRegion, Company, ChallengesCompositeView, FilterFormView, ChallengesCollection, SponsorsView) {
    'use strict';

    var ChallengesIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            challengesPosted: '#challenges-posted',
            filterForm: '#filter-form-section',
            sponsors: '#sponsors-section'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new Company(null, options);
            this.challenges = new ChallengesCollection(null, {reqres: this.reqres});
            this.model.on('loaded', this.render, this);
            this.config = this.reqres.request('config');
            this.listenTo(this.model, 'loaded', this.onLoaded, this);

            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {

            this.filterForm.show(new FilterFormView({
                reqres: this.reqres,
                collection: this.model.get('challenges')
            }));

            this.challengesPosted.show(new ChallengesCompositeView({
                reqres: this.reqres,
                data: this.challenges
            }));

            this.sponsors.show(new SponsorsView());

            this.listenTo(this.filterForm.currentView, 'filter', this.onFilter, this);
            this.listenTo(this.challengesPosted.currentView, 'showModal itemview:showModal', this.showPostChallenges, this);
        },

        onFilter: function (view, model) {
            this.challenges.reset();
            this.challenges.fetch({ data: $.param({
                challengesearch: model.get('challengesearch'),
                location: model.get('location')})
            });

            this.challengesPosted.close();
            this.challengesPosted.show(new ChallengesCompositeView({
                reqres: this.reqres,
                data: this.challenges
            }));
        },

        showPostChallenges: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                company: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, company_id: view.model.company_id, reqres: this.reqres}, options));
        }
    });
    return ChallengesIndexView;
});


