import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
	accountBalance: {
		type: Number,
		default: 10000,
	},
	pnl: {
		type: Number,
		default: 0,
	},
	wins: {
		type: Number,
		default: 0,
	},
	losses: {
		type: Number,
		default: 0,
	},
	winrate: {
		type: Number,
		default: 0,
	},
	units: {
		type: Number,
		default: 0,
	},
	totalTradeDuration: {
		type: Number,
		default: 0,
	},
	averageWin: {
		type: Number,
		default: 0,
	},
	averageLoss: {
		type: Number,
		default: 0,
	},
	averageUnits: {
		type: Number,
		default: 0,
	},
	averageTradeDuration: {
		type: Number,
		default: 0,
	},
});

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
		match: /.+\@.+\..+/,
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
	dashboard: {
		type: dashboardSchema,
		default: () => ({}),
	},
});

export default mongoose.models.User || mongoose.model("User", userSchema);
