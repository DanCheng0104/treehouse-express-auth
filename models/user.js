const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	name: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	favoriteBook: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}
});

//hash pwd before saving to db;
UserSchema.pre("save",function(next){
	console.log('save pwd');
	const user = this;
	bcrypt.hash(user.password,10,function(err,hash){
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	})
});
//authenticate input
UserSchema.statics.authenticate = function(email,password,callback){
	User.findOne({email:email})
		.exec(function(error,user){
			console.log(user);
			if (error){
				return callback(error);
			} else if(!user){
				const err = new Error('User not found.');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password,user.password,function(error,result){
				if(result === true){
					return callback(null,user);
				}else{
					return callback();
				}
			})
		})
}

const User = mongoose.model('user',UserSchema);
module.exports = User;