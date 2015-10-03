define([
    'marionette',
    'text!templates/admin/companies.html',
    'views/admin/company_itemview',
    'utils/notifier'
], function (Marionette, Template, ItemView, Notificator) {
    "use strict";

    var CompaniesCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.company-list.company-list',

        events: {
            'click #savePayment': 'save',
            'click .button.search-companies': 'searchCompany',
            'keypress #company-name': function (e) {
                if (e.which === 13) {
                    this.searchCompany();
                }
            }
        },

        initialize: function (params) {
            this.collection = params.collection;
            this.config = params.reqres.request('config');
        },

        save: function () {
            var message = '';
            var that = this;
            this.collection.forEach(function (employer) {
                var id = employer.get('id'),
                    flag = $('#payment' + id).prop('checked');
                if (flag !== employer.get('payment_flag')) {
                    employer.save(null, {
                        url: that.config.restUrl + '/company/updatePayment',
                        data: $.param({
                            id: id,
                            flag: flag
                        }),
                        success: _.bind(function () {
                            that.trigger('saved');
                        }, this),
                        error: _.bind(function (model, response) {
                            message = response.responseJSON.message;
                            Notificator.validate(message, "error");
                        }, this)
                    });
                }
            });
        },

        searchCompany: function () {
            this.collection.reset();
            this.collection.fetch({
                data: $.param({
                    name: $('#company-name').val(),
                    limit: 'ALL'
                })
            });
        }
    });
    return CompaniesCollectionView;
});
