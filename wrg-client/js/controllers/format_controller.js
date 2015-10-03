define([
	'marionette',
	'wreqr'
], function(Marionette, Wreqr) {
	var FormatController = Marionette.Controller.extend({
		initialize: function(params) {
			this.vent = params.vent;
			this.reqres = params.reqres;

			// Register response/request handlers for each formatter function.
			this.reqres.setHandler('format:month', _.bind(this.formatMonth));
		},

		// Convert an integer to a string representation in English.
		// 
		// monthNumber: integer 0-11 representing January-December.
		// returns: an object with both long and short string representations in
		// the following format.
		//
		// {
		//		long: "November",
		//		short: "Nov"	
		// }
		formatMonth: function(monthNumber) {
			var longNames = ['January', 'February', 'March', 'April', 'May',
				'June', 'July', 'August', 'September', 'October', 'November',
				'December'];
			var shortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
				'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

			return {
				long: longNames[monthNumber],
				short: shortNames[monthNumber]
			};
		}
	});

	return FormatController;
});