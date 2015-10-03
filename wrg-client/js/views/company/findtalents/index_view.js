define([
    'marionette',
    'views/company/findtalents/filter_form_view',
    'views/company/findtalents/friend_request_view',
    'views/company/findtalents/review_requests_compositeview',
    'views/company/findtalents/suggestions_compositeview',
    'views/company/findtalents/search_criteria_compositeview',
    'text!templates/company/findtalents/index.html',
    'regions/modal_region',
    'collections/company/talents',
    'collections/company/criterias_search',
    'models/company'
], function (Marionette, FilterFormView, FriendRequestView, ReviewRequestsCompositeView, SuggestionsCompositeView, SearchCriteriaCompositeView, Template, ModalRegion, Friends, CriteriaSearchCollection, Company) {
    "use strict";

    var IndexView = Marionette.Layout.extend({

        template: Template,

        regions: {
            filterForm: '#filter-form-section',
            reviewRequests: '#review-requests-section',
            suggestions: '#suggestions-section',
            searchCriterias: '#search-criterias',
            modal: ModalRegion
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new Company(null, options);
            this.friends = new Friends(null, {reqres: this.reqres});
            this.listenTo(this.model, 'loaded', this.loadFriends, this);
            this.listenTo(this.model, 'loaded', this.loadCriteria, this);
            $("#pageloader").fadeIn(300).delay(300).fadeOut(300);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            this.reviewRequests.show(new ReviewRequestsCompositeView({
                reqres: this.reqres,
                collection: this.collection
            }));
            this.listenTo(this.reviewRequests.currentView, 'itemview:acceptRequest', this.acceptRequest, this);
            this.listenTo(this.reviewRequests.currentView, 'itemview:declineRequest', this.declineRequest, this);
        },

        loadFriends: function () {
            if (this.model.get('payment_flag') === true) {
                this.filterForm.show(new FilterFormView({
                    reqres: this.reqres,
                    collection: null,
                    id: this.model.get('id'),
                    colData: this.model.get('criteria')
                }));

                this.listenTo(this.filterForm.currentView, 'filter', this.onFilter, this);
                this.listenTo(this.filterForm.currentView, 'showModal', this.showModal, this);

                this.suggestions.show(new SuggestionsCompositeView({
                    reqres: this.reqres,
                    collection: this.friends
                }));
                this.listenTo(this.suggestions.currentView, 'showModal itemview:showModal', this.showModal, this);
            }
            else {
                this.$el.find('#paymentMessage').show();
            }
        },

        onFilter: function (view, model) {
            this.friends.reset();
            this.friends.fetch({
                data: $.param({
                    name: model.get('name'),
                    company: model.get('company'),
                    major: model.get('major'),
                    school: model.get('school'),
                    gpa: model.get('gpa'),
                    job_title: model.get('job_title'),
                    talent_skill: model.get('talent_skill'),
                    gpa_criteria: model.get('gpa_criteria'),
                    experiences: model.get('experiences')
                })
            });
        },

        showModal: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.friends,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({reqres: this.reqres}, options));
        }
    });
    return IndexView;
});