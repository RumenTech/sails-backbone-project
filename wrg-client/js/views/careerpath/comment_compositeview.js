define([
    'marionette',
    'text!templates/careerpath/comments.html',
    'views/careerpath/comment_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var CommentsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#commentsContainer',

        initialize: function (params) {
            this.collection = params.data;
        }
    });

    return CommentsCollectionView;
});