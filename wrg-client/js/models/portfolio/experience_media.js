define(['backbone'],
	   function(Backbone){
		
		var ExperienceMedia = Backbone.Model.extend({
			
			initialize:function(options){
				
				if (options) {
					this.reqres = options.rest;
				}
				
			},
			urlRoot:function()
			{
				var config = this.reqres.request('config');
				return config.restUrl+'/experiencemedia'
			}
		});
		
		return ExperienceMedia;
	});