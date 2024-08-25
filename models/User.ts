import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		maxLength: [30, "First name must be 30 characters or less."],
	},
	lastName: {
		type: String,
		required: true,
		maxLength: [30, "Last name must be 30 characters or less."],
	},
	email: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		minLength: [3, "Username must be 3 characters or more."],
		maxLength: [30, "Username must be 30 characters or less."],
	},
	password: {
		type: String,
		required: true,
		minLength: [5, "Password must be 5 characters or more."],
		maxLength: [30, "Password must be 30 characters or less."],
	},
});

export default mongoose.models.User || mongoose.model("User", userSchema);
