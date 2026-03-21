export interface PaginationLinks {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

export interface PaginationMeta {
	current_page: number;
	from: number;
	last_page: number;
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface PaginatedResponse<T> {
	data: {
		data: T[];
		links: PaginationLinks;
		meta: PaginationMeta;
	};
}

export interface Role {
	id: number;
	name: string;
	slug: string;
	permissions_count?: number;
	permissions?: Permission[];
	created_at: string;
	updated_at: string;
}

export interface User {
	id: number;
	name: string;
	email: string;
	status: "active" | "inactive";
	role: Role;
	created_at: string;
	updated_at: string;
}

export interface Permission {
	id: number;
	name: string;
	slug: string;
	resource: string;
	action: string;
}

export interface PermissionGroup {
	resource: string;
	label: string;
	permissions: Permission[];
}

export interface MeResponse {
	message: string;
	user: User;
	role: Role;
	permissions: string[];
}

export interface ValidationErrorResponse {
	message: string;
	errors: Record<string, string[]>;
}

export interface GenericErrorResponse {
	message: string;
}
