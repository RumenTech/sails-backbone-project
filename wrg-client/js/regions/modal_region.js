define([
    'marionette'
], function(Marionette) {

    var ModalRegion = Marionette.Region.extend({
        el: '#modal',

        constructor: function() {
            Marionette.Region.prototype.constructor.apply(this, arguments);
            this.ensureEl();
            this.$el.on('hidden', this.close);
        },

        onShow: function() {
            this.currentView.on('closeModal', this.dismissModal, this);
            $('#modal').foundation('reveal', 'open');
        },

        dismissModal: function() {
            $('#modal').foundation('reveal', 'close');
        }
    });

    return ModalRegion;
});
