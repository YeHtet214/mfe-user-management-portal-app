import axios from "axios";

export const baseURL = import.meta.env.VITE_API_BASE_URL || "http://laravel-api-for-microfrontend.test";
export const authURL = import.meta.env.VITE_AUTH_URL || "http://auth.laravel-api-for-microfrontend.test:5173";

const api = axios.create({
	baseURL: baseURL,
	withCredentials: true,
	withXSRFToken: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

api.interceptors.request.use((config) => {
	if (config.url?.includes("/login")) {
		return api.get("/sanctum/csrf-cookie", { withCredentials: true });
	}
	return config;
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			const { status, data } = error.response;

			if (status === 401) {
				const currentUrl = window.location.href;
				window.location.href = `${authURL}?redirect=${encodeURIComponent(currentUrl)}`;
			} else if (status === 403) {
				if (data.message?.toLowerCase().includes("inactive")) {
					const currentUrl = window.location.href;
					window.location.href = `${authURL}?redirect=${encodeURIComponent(currentUrl)}`;
				}
			} else if (status === 500) {
				console.error("Internal Server Error:", data.message);
			}
		} else if (error.request) {
			console.error("No response received:", error.request);
		} else {
			console.error("Request error:", error.message);
		}

		return Promise.reject(error);
	}
);

export default api;
