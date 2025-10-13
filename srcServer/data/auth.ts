// Authentication / autentisering

import jwt from 'jsonwebtoken'

const jwtSecret: string = process.env.JWT_SECRET || ''

function createToken(userId: string): string {
	// Tiden sedan 1970-01-01 i sekunder
	const now = Math.floor(Date.now() / 1000)

	// En kvart
	const defaultExpiration: number = now + 15 * 60
	return jwt.sign({
		userId: userId,
		exp: defaultExpiration
	}, jwtSecret)
}

export { createToken }
