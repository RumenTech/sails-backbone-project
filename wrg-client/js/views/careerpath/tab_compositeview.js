/**
 * Created by semir.sabic on 18.4.2014.
 */
define([
    'marionette',
    'text!templates/careerpath/tabs.html',
    'views/careerpath/tab_itemview',
    'collections/careerpath/careerpath_tabs'
], function (Marionette, Template, ItemView, Tabs) {
    "use strict";

    var TabsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#tabsContainer',

        initialize: function (params) {
            this.collection = new Tabs(params.data, params);
            this.reqres = this.collection.reqres;
            this.model = new Backbone.Model();
            this.model.reqres = this.reqres;
            this.session = this.reqres.request('session');
            if (this.session.role === 'admin') {
                this.model.set('role', 'admin');
            } else if (params.data === null) {
                this.model.set('college', 'no');
            }
        }
    });

    return TabsCollectionView;

});