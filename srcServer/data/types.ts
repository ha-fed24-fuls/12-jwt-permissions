
// Används för body vid request: /login och /register
export interface UserBody {
	username: string;
	password: string;
}

export interface JwtResponse {
	success: boolean;
	token?: string;  // JWT
}

// Beskriver user-items från databasen
export interface UserItem {
	pk: string;
	sk: string;
	username: string;
	password: string;
	accessLevel: string;
}
