import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction, registerAction } from "../redux/actions/auth";

const Auth = () => {
	const [isRegister, setIsRegister] = useState(true);
	const [authData, setAuthData] = useState({ username: "", email: "", password: "" });
	const dispatch = useDispatch();

	const onChangeData = (e) => {
		setAuthData({ ...authData, [e.target.name]: e.target.value });
	};

	const onAuth = () => {
		if (isRegister) {
			dispatch(registerAction(authData));
		} else {
			dispatch(loginAction(authData));
		}
	};

	return (
		<div className="w-full h-screen bg-gray-100 flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 z-50">
			<div className="w-1/3 bg-white p-3 rounded-md">
				<h1 className="text-2xl text-indigo-600 font-bold uppercase">
					{isRegister ? "Register" : "Login"}
				</h1>
				<div className="flex flex-col space-y-3 my-5">
					{isRegister && <input type="text" name="username" value={authData.username} onChange={onChangeData} placeholder="Username" className="input-style" />}
					<input type="email" name="email" value={authData.email} onChange={onChangeData} placeholder="Email" className="input-style" />
					<input type="password" name="password" value={authData.password} onChange={onChangeData} placeholder="Password" className="input-style" />

					<span onClick={() => setIsRegister(!isRegister)} className="text-gray-500 text-xs cursor-pointer hover:text-indigo-600">
						{isRegister ? "Have you logged in before?" : "I want to register"}
					</span>

					<button className="primary-button" onClick={onAuth}>
						{isRegister ? "Register" : "Login"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Auth;
