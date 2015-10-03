define([
    'marionette',
    'text!templates/groups/posts.html',
    'collections/groups/posts',
    'views/groups/post_itemview',
    'utils/notifier',
    'models/groups/post'

], function (Marionette, Template, PostsCollection, ItemView, Notificator, Post) {
    "use strict";

    var PostCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.post-list',
        itemView: ItemView,

        initialize: function (params) {
            this.collection = new PostsCollection(params.group_id, params);
            this.model = new Post(params.data, params);
            this.model.set('user_id', params.user_id);
            this.model.set('group_id', params.group_id);
            this.listenTo(this.collection, 'loaded', this.onLoaded, this);
        },

        regions: {
            message: '.post-validation-messages'
        },

        events: {
            'click #save-post': 'newPost',
            'click .load_posts': 'morePosts'
        },

        onLoaded: function () {
            if (this.collection.length >= 5) {
                $('.load_posts').css('visibility', 'visible');
            }
        },

        newPost: function (e) {
            e.preventDefault();
            var message = '';

            this.model.set('id', undefined);
            this.model.set('content', $("#content").val());
            $("#content").val('');

            this.model.save(null, {
                success: _.bind(function () {
                    this.collection.reset();
                    this.collection.fetch({
                        data: $.param({ id: this.model.get('group_id')})
                    });
                }, this),
                error: _.bind(function (model, response) {
                    if (response.responseJSON.ValidationError) {
                        message = response.responseJSON.ValidationError.content[0].message;
                        message = 'You can not share empty post';
                    }
                    Notificator.validate(message, "error", '.post-validation-messages');
                }, this)
            });
        },

        morePosts: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({
                data: $.param({
                    id: this.model.get('group_id'),
                    limit: this.collection.length + 5
                }),
                success: _.bind(function () {
                    if (this.collection.length === this.result_length) {
                        $('.load_posts').html('No more posts found');
                    }
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return PostCollectionView;
});




