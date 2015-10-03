define([
    'marionette',
    'views/company/findtalents/search_talent',
    'regions/modal_region',
    'collections/connections',
    'collections/company/talents',
    'models/searched_talents'
], function (Marionette, SearchTalent, ModalRegion, Connections, Friends, SearchedTalents) {
    "use strict";

    var IndexView = Marionette.Layout.extend({

        regions: {
            modal: ModalRegion,
            studentView: '#student-view'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new SearchedTalents(options.model, options.model);
            this.onLoaded();
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            this.modal.show(new SearchTalent({model: this.model, company_id: this.model.id, reqres: this.reqres}, options));
        }
    });
    return IndexView;
});