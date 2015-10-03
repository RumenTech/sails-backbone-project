/**
 * News
 *
 * @module      :: Model
 * @description :: Model container for the news on the front page.
 *
 */

module.exports = {

    attributes: {
        title:{
            type: 'string',
            required: true
        },
        newsbody:{
            type: 'string',
            required: true
        },
        publishedby:{
            type: 'string',
            required: true
        },
        newsurl:{
            type: 'string',
            required: true
        },
        toJSON: function() {
            var obj = this.toObject();
            return obj;
        }
    }
};