var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	languate: String,
	country: String,
	poster: String,
	summary: String,
	flash: String,
	year: Number,
	meta: {
		createAt: {
			type:Date,
			detault: Date.now()
		},
		updateAt: {
			type: Date,
			detault: Date.now()
		}
	}
})

MovieSchema.pre('save',function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now();
	}
	next()
})

MovieSchema.statics = {
	fetch: function(cb) {
		var models = this.find({}).sort('meta.updateAt').exec(cb)
		console.log(models)
		return models
	},
	findById: function(id,cb) {
		return this.findOne({_id:id}).exec(cb);
	}
}

module.exports = MovieSchema








