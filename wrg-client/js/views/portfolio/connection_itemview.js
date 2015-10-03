define([
    'marionette',
    'text!templates/portfolio/connection.html',
    'utils/conversionUtils'
], function (Marionette, Template, ConversionUtils) {
    'use strict';

    var ConnectionItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .connection': 'viewReadOnlyIndividual'
        },

        initialize: function () {
            this.reduceInformationSize();
        },

        reduceInformationSize: function () {
            var information = this.model.get('information'),
                reducedInformation = '', emptyInformation;
            if (information !== undefined && information !== null) {
                emptyInformation = information.split(" ");
                if (emptyInformation[0] === '' && emptyInformation[1] === 'at') {
                    reducedInformation = '';
                } else if (information.length > 35) {
                    reducedInformation = information.slice(0, 35) + '...';
                } else {
                    reducedInformation = information;
                }
            }
            this.model.set('reducedInformation', reducedInformation);
        },

        viewReadOnlyIndividual: function () {
            if (this.model.get('alumni_id') === null) {
                window.location = '#student/' + ConversionUtils.returnInteger(this.model.get('request_user_id'), 'Could not convert user id');
            }
            else {
                window.location = '#alumni_user/' + ConversionUtils.returnInteger(this.model.get('request_user_id'), 'Could not convert user id');
            }
        }
    });
    return ConnectionItemView;
});
