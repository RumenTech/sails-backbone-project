/**
 * Created by Mistral on 12/30/13.
 */
define([
    'marionette',
    'text!templates/company/event.html',
    'views/company/edit/add_event_form_view'
], function(Marionette, Template, FormView) {
    "use strict";

    var EventItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function() {
            this.model.on('saved', this.render, this);
        },
        onRender: function () {
//            if(this.model.get('first')) {
//                $('#eventDiv').html($('#eventdiv' + this.model.get('id')).html());
//            }
        },
        afterRender: function() {
//            if(this.model.get('first')) {
//                $('#eventDiv').html($('#eventdiv' + this.model.get('id')).html());
//            }
        },
        beforeRender: function() {
//            if(this.model.get('first')) {
//                $('#eventDiv').html($('#eventdiv' + this.model.get('id')).html());
//            }
        },
        edit: function() {
            this.trigger('showModal', FormView);
        }
    });

    return EventItemView;
});
