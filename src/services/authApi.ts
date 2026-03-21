import api from "./api";
import { storage } from "./storage";

export const logout = async () => {

	try {
		await api.post("/logout", {
			withCredentials: true,
			withXSRFToken: true,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		storage.removeUser();
	} catch (error) {
		console.error("Error logging out:", error);
	}
};
