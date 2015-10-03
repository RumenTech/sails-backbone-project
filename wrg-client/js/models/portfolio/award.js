define(['backbone', 'utils/conversionUtils'], function(Backbone, ConversionUtils) {

	var Award = Backbone.Model.extend({

		initialize: function(attributes,params) {
			this.reqres = params.collection.reqres;

			if (this.get('date')) {
				var dateArray = this.get('date').split('-');
				this.set('year', dateArray[0]);
				this.set('month', dateArray[1]);
			}
		},
		urlRoot:function(){
			var config = this.reqres.request('config');
            return  config.restUrl+'/award'
		},
        validate: function(attrs, options){
            if(!attrs.title){
                $('.save-button').removeAttr("disabled");
                return 'Title is a required field.';
            }
            if(!attrs.title.length > 50 ){
                $('.save-button').removeAttr("disabled");
                return 'Title must be 50 characters or fewer.';
            }
            if(attrs.title.indexOf("/") > -1 || attrs.title.indexOf("\\") > -1) {
                $('.save-button').removeAttr("disabled");
                return 'Title cannot contain the symbol / or \\';
            }
            if(!attrs.date){
                $('.save-button').removeAttr("disabled");
                return 'Date is a required field';
            }

            if (attrs.year){
                var now = new Date(),
                    thisYear =  now.getFullYear(),
                    thisMonth =  now.getMonth() + 1,
                    awardMonth = ConversionUtils.returnInteger(attrs.month, 'Error converting award month'),
                    awardYear = ConversionUtils.returnInteger(attrs.year, 'Error converting award year');
                if (awardYear > thisYear){
                    return 'Date cannot be in the future (check year)';
                } else if (awardYear === thisYear && awardMonth > thisMonth) {
                    return 'Date cannot be in the future (check month)';
                }
            }
        }
	});

	return Award;
});