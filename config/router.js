module.exports.start = function(app) {
    var home_controller  = require("../app/controllers/home_controller");
    var tasks_controller = require("../app/controllers/tasks_controller");

	app.get('/', home_controller.index);
    app.get('/client', home_controller.client);

    app.get("/tasks", tasks_controller.index);
    app.post("/tasks", tasks_controller.create);
    app.put("/tasks/:id", tasks_controller.update);
    app.delete("/tasks/:id", tasks_controller.destroy);

	/// catch 404 and forwarding to error handler
	app.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});

	/// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.render('error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.render('error', {
	        message: err.message,
	        error: {}
	    });
	});
}

