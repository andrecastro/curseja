define(["backbone", "models/task"], function (Backbone, Task) {

    var Tasks = Backbone.Collection.extend({
        url: "/tasks",
        model: Task
    });

    return Tasks;
});