import express from 'express'
import type { Router, Request, Response } from 'express'
import { db, tableName } from '../data/dynamoDb.js';
import { DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import type { UserItem } from '../data/types.js';

const router: Router = express.Router();

/*
Endpoints för resursen /api/users
GET /
POST /  (kan motsvara användarregistrering via frontend, eller att admin kan lägga till användare direkt)
PUT /:id
DELETE /:id
*/


interface UserResponse {
	username: string;
	userId: string;
}
interface UserIdParam {
	userId: string;
}

router.get('/', async (req, res: Response<void | UserResponse[]>) => {
	const command = new QueryCommand({
		TableName: tableName,
		KeyConditionExpression: 'pk = :value',  // USER är ett reserverat ord, kan inte skriva det direkt
		ExpressionAttributeValues: {
			':value': 'USER'
		}
	})
	const output = await db.send(command)

	if( !output.Items ) {
		res.status(500).send()
		return
	}

	// TODO: validera med zod att output.Items matchar UserItem-interfacet
	// OBS! Använd aldrig "as" i produktion - validera i stället!
	const users: UserItem[] = output.Items as UserItem[]

	// Frontend behöver bara användarnamn och id
	res.send(users.map(ui => ({
		username: ui.username,
		userId: ui.sk.substring(5)  // id-delen av 'sk'
	})))
	// USER#id - hur får vi tag i id-delen av strängen? Substring, .split m.m.
})

interface Payload  {
	userId: string;
	accessLevel: string;
}
function validateJwt(authHeader: string | undefined): Payload | null {
	// 'Bearer: token'
	if( !authHeader ) {
		return null
	}
	const token: string = authHeader.substring(8)  // alternativ: slice, split
	try {
		const decodedPayload: Payload = jwt.verify(token, process.env.JWT_SECRET || '') as Payload
		// TODO: validera decodedPayload
		const payload: Payload = { userId: decodedPayload.userId, accessLevel: decodedPayload.accessLevel }
		return payload

	} catch(error) {
		console.log('JWT verify failed: ', (error as any)?.message)
		return null
	}
}


router.delete('/:userId', async (req: Request<UserIdParam>, res: Response<void>) => {
	const userIdToDelete: string = req.params.userId
	
	// TODO: kontrollera om man är inloggad och har access
	// Steg 1: kontrollera att JWT följer med i headern
	// Steg 2: verifiera JWT -> få payload (som innehåller userId)
	//   - se till så payload innehåller accesslevel också
	// Steg 3: kontrollera att accessLevel är tillräcklig för det man vill göra
	// Steg 4: utför operationen eller svara med status 401
	// Detta behöver göras av flera endpoints - skapa en funktion

	const maybePayload: Payload | null = validateJwt(req.headers['authorization'])
	if( !maybePayload ) {
		console.log('Gick inte att validera JWT')
		res.sendStatus(401)
		return
	}

	const { userId, accessLevel } = maybePayload
	// Man får lov att ta bort en användare om man tar bort sig själv eller har accessLevel admin
	if( userId !== userIdToDelete && accessLevel !== 'admin' ) {
		console.log('Inte tillräcklig access level. ', userId, accessLevel)
		res.sendStatus(401)
		return
	}

	const command = new DeleteCommand({
		TableName: tableName,
		Key: {
			pk: 'USER',
			sk: 'USER#' + userIdToDelete
		},
		ReturnValues: "ALL_OLD"
	})
	const output = await db.send(command)
	if( output.Attributes ) {
		res.sendStatus(204)  // lyckades ta bort
	} else {
		res.sendStatus(404)
	}
})
export default router
