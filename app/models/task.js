var mongoose = require("mongoose");
var Schema = mongoose.Schema;

TaskSchema = new Schema({
   name: { type: String },
   status: { type: String , default: "incomplete" },
   order: { type: Number , default: -1 },
   createdAt  : { type : Date, default : Date.now }
});

TaskSchema.path("name").required("Titulo é obrigatório");

mongoose.model("Task", TaskSchema);

