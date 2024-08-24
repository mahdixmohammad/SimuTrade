"use server";

import User from "@/models/User";

const addUser = async (user: FormData) => {
	const firstName = user.get("First Name");
	const lastName = user.get("Last Name");
	const email = user.get("Email");
	const username = user.get("Username");
	const password = user.get("Password");

	const newUser = new User({ firstName, lastName, email, username, password });
	await newUser.save();
};

const getUsers = async () => {
	return User.find();
};

export { addUser, getUsers };
