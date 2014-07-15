define(["backbone", "underscore", "text!templates/message_tmp.html"], function (Backbone, _, message_tmp) {

    var MessageView = Backbone.View.extend({
        template: _.template(message_tmp),
        className: "message",

        initialize: function(data) {
            this.data = data;
        },

        render: function() {
            var view = this.template({ data: this.data });
            this.$el.html(view);
            return this.el;
        }
    });

    return MessageView;
});