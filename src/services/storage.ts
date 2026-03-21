import { type User } from "./types";

const USER_KEY = "auth_user";

export const storage = {
	setUser: (user: User) => {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
	},
	getUser: (): User | null => {
		const user = localStorage.getItem(USER_KEY);
		try {
			return user ? JSON.parse(user) : null;
		} catch (e) {
			console.error("Failed to parse stored user", e);
			return null;
		}
	},
	removeUser: () => {
		localStorage.removeItem(USER_KEY);
	},
	clear: () => {
		localStorage.clear();
	},
};
