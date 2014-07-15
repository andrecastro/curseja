define(["backbone", "jquery", "socket.io", "views/message_view"], function (Backbone, $, io, MessageView) {

    var ChatView = Backbone.View.extend({
        el: $("#west-container"),

        events: {
            "click #sendMessage": "sendMessage",
            "keyup": "processKey"
        },

        initialize: function () {
            var self = this;
            this.user = "Usuário " + this.generateRandomName();
            this.socket = io.connect('http://' + window.location.hostname + ':3000');
            this.socket.on('message', function (data) {
                if (data.message) {
                    self.renderMessage(data);
                }
            });
        },

        render: function () {

        },

        sendMessage: function () {
            var message = this.message();
            if (message) {
                this.socket.emit('send', { user: this.user, message: message });
            }
            $("#chatMessage").val(null);
        },

        renderMessage: function (data) {
            var messageView = new MessageView(data);
            $("#west-main-container").append(messageView.render());
            $("#west-main-container").scrollTop($("#west-main-container")[0].scrollHeight);
        },

        processKey: function (e) {
            if (e.which === 13) {
                this.sendMessage();
            }
        },

        message: function () {
            return $("#chatMessage").val();
        },

        generateRandomName: function () {
            var letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
            var randomName = '';
            for (var i = 0; i < 3; i++) {
                var rnum = Math.floor(Math.random() * letters.length);
                randomName += letters.substring(rnum, rnum + 1);
            }

            return randomName;
        }

    });

    var chatView = new ChatView();
    return chatView;
});