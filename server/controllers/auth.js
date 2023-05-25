const AuthSchema = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
	try {
		const { username, password, email } = req.body;

		const userEmail = await AuthSchema.findOne(email);

		if (userEmail) {
			return res
				.status(500)
				.json({ message: "A user for this email already exists!" });
		}

		if (password.length < 6) {
			return res
				.status(500)
				.json({ message: "Password must be greater than 6 characters!" });
		}

		const passwordHash = await bcrypt.hash(password, 12);

		if (!isEmail(email)) {
			return res.status(500).json({ message: "Check your email!" });
		}

		const newUser = await AuthSchema.create({
			username,
			email,
			password: passwordHash,
		});

		const token = await jwt.sign({ id: newUser._id }, "SECRET_KEY", {
			expiresIn: "1h",
		});

		res.status(200).json({
			status: "OK",
			newUser,
			token,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await AuthSchema.findOne(email);

		if (!user) {
			return res.status(500).json({ message: "User not found!" });
		}

		const passwordCompare = await bcrypt.compare(password, user.password);

		if (!passwordCompare) {
			return res.status(500).json({ message: "Wrong password!" });
		}

		const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });

		res.status(200).json({
			status: "OK",
			user,
			token,
		});
	} catch (error) {
		console.log(error);
	}
};

const isEmail = (email) => {
	const regex =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return email.match(regex);
};

module.exports = { register, login };
