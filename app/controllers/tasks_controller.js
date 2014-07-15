var mongoose = require("mongoose");
var Task = mongoose.model("Task");
var extend = require("util")._extend;

module.exports.index = function (req, res) {
    Task.find().sort({ 'order': 1, 'createdAt': -1 }).exec(function (err, tasks) {
        res.json(tasks);
    });
}

module.exports.create = function (req, res) {
    Task.create(req.body, function (err, task) {
        if (err) {
            res.json(400, err.errors);
        } else {
            res.json(201, task);
        }
    });
}

module.exports.update = function (req, res) {
    Task.findById(req.params.id, function (err, task) {
        task = extend(task, req.body);
        task.save(function (err, task) {
            res.json(200, task);
        });
    });
}

module.exports.destroy = function (req, res) {
    Task.findById(req.params.id, function (err, task) {
        task.remove();
        res.json(200, task);
    });
}