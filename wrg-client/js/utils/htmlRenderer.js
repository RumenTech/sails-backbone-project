/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 2/26/14
 * Time: 12:11 PM
 * To change this template use File | Settings | File Templates.
 * This code will render htlm based on requirements
 */


define([
    'jquery'
], function ($) {
    'use strict';

    var renderer = {};

    renderer.showComments = function(singleComment, sessionId){
     //todo implement rendering for comments, single comment per call.

        var ruleSetter,
            iCanEdit,
            iCanDelete;

        if (singleComment.user_id === sessionId){
        ruleSetter = "<div><a id=comment-" + singleComment.id + " class='deletecomment'>Delete</a></div><div><a>Edit</a></div>";
         //iCanEdit = ' <a><i class="" title="Edit"></i></a>';
        // iCanDelete = ' <a><i class="" title="Delete"></i></a>';
        }

        if (singleComment.role === "admin"){
            ruleSetter = "<div><a id=comment-" + singleComment.id + " class='deletecomment'>Delete</a></div>";
        }

        var htmlMarkup = [

        '<div class="singlecomments">',
            ruleSetter,
        '<div>'+ singleComment.firstName + ' ' + singleComment.lastName +'</div>',
        '<img class="groupUserImage" src="' + singleComment.profileImage +'"/>',
        '<div>'+ singleComment.content + '</div>',
        '</div>'

        ].join('');
        return htmlMarkup;
    },

    renderer.dialogPendingMember = function (memberName, memberImage) {
        var htmlMarkup = [
            '<div>User Name: '+ memberName + '</div>',
            '<img style="height:160px; width:160px; box-shadow: 10px 10px 5px #888888;" class="groupUserImage" src="'+ memberImage +'">'
        ].join('');
        return htmlMarkup;
    };
    return renderer;
});
