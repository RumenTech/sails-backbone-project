define([
    'marionette',
    'views/findfriends/filter_form_view',
    'views/findfriends/friend_request_view',
    'views/findfriends/review_requests_compositeview',
    'views/findfriends/suggestions_compositeview',
    'text!templates/findfriends/index.html',
    'regions/modal_region',
    'collections/connections',
    'collections/friends',
    'models/connection'
], function (Marionette, FilterFormView, FriendRequestView, ReviewRequestsCompositeView, SuggestionsCompositeView, Template, ModalRegion, Connections, Friends, Connection) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,
        regions: {
            filterForm: '#filter-form-section',
            reviewRequests: '#review-requests-section',
            suggestions: '#suggestions-section',
            modal: ModalRegion
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.collection = new Connections(null, options);
            this.listenTo(this.collection, 'loaded', this.onLoaded, this);
            this.friends = new Friends(null, {reqres: this.reqres});
            this.listenTo(this.friends, 'loaded', this.loadFriends, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);

            this.reviewRequests.show(new ReviewRequestsCompositeView({
                reqres: this.reqres,
                collection: this.collection
            }));
            this.listenTo(this.reviewRequests.currentView, 'itemview:acceptRequest', this.acceptRequest, this);
            this.listenTo(this.reviewRequests.currentView, 'itemview:declineRequest', this.declineRequest, this);
        },

        loadFriends: function () {
            this.filterForm.show(new FilterFormView({
                reqres: this.reqres,
                collection: null
            }));
            this.listenTo(this.filterForm.currentView, 'filter', this.onFilter, this);
            this.suggestions.show(new SuggestionsCompositeView({
                reqres: this.reqres,
                collection: this.friends
            }));
            this.listenTo(this.suggestions.currentView, 'showModal itemview:showModal', this.showModal, this);
            $("#searchFriends").click();//find friends from tutorial
        },

        onFilter: function (view, model) {
            this.friends.reset();
            this.friends.fetch({
                data: $.param({
                    name: model.get('name'),
                    company: model.get('company'),
                    major: model.get('major'),
                    school: model.get('school')
                })
            });
        },

        acceptRequest: function (view) {
            var user_id = view.model.get("user_id");
            var modelAux = this.model;
            this.model = new Connection(null, {reqres: this.reqres});
            this.model.fetch({ data: $.param({ request_user_id: user_id }),
                    type: 'POST',
                    success: _.bind(function () {
                        if (this.model.get("id")) {
                            this.collection.remove(view.model);
                            this.onLoaded();
                        } else {

                        }
                    }, this)
                },
                null
            );
        },

        declineRequest: function (view) {
            var idRequest = view.model.get('id');
            var modelRequest = new Connection(view.model.attributes, {reqres: this.reqres});
            modelRequest.destroy(
                { data: $.param({ id: idRequest
                }),
                    success: _.bind(function () {
                        if (modelRequest.get("id")) {
                            this.collection.remove(view.model);
                            this.onLoaded();
                        } else {

                        }
                    }, this)
                }
            );
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