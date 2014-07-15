define(["backbone"], function (Backbone) {

    var Task = Backbone.Model.extend({

        idAttribute: "_id",

        initialize: function () {
            this.on("invalid", function (model, error) {
                alert(error);
            });
        },

        validate: function (attrs, opts) {
            if (!attrs.name || attrs.name.replace(" ", "").length == 0) {
                return "Nome não pode ser vazio";
            }
        },

        changeStatus: function () {
            if (this.get("status") == "complete") {
                this.set("status", "incomplete");
            } else {
                this.set("status", "complete");
            }

            this.save();
        }
    });

    return Task;
});