define([
    'marionette',
    'text!templates/company/challenges/challenges_index.html',
    'regions/modal_region',
    'models/company',
    'views/company/challenges/challenges_compositeview'
], function (Marionette, Template, ModalRegion, Company, ChallengesCompositeView) {
    "use strict";

    var ChallengesIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            challengesPosted: '#challenges-posted'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new Company(null, options);
            this.model.on('loaded', this.render, this);
            this.config = this.reqres.request('config');

            this.listenTo(this.model, 'loaded', this.onLoaded, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            $("#pageloader").fadeIn(300).delay(this.config.spinnerTimeout / 2).fadeOut(300);
            this.challengesPosted.show(new ChallengesCompositeView({
                reqres: this.reqres,
                data: this.model.get('challenges'),
                company: this.model
            }));

            this.listenTo(this.challengesPosted.currentView, 'showModal itemview:showModal', this.showPostChallenges, this);
        },

        showPostChallenges: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                company: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, company_id: this.model.get('id'), company_image: this.model.get('profile_image'), reqres: this.reqres}, options));
        }
    });
    return ChallengesIndexView;
});
