import express from 'express'
import type { Router, Request, Response } from 'express'
import { db, tableName } from '../data/dynamoDb.js';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

const router: Router = express.Router();

/*
Endpoints för resursen /api/users
GET /
POST /  (kan motsvara användarregistrering via frontend, eller att admin kan lägga till användare direkt)
PUT /:id
DELETE /:id
*/

// Beskriver user-items från databasen
interface UserItem {
	pk: string;
	sk: string;
	username: string;
	password: string;
	accessLevel: string;
}
interface UserResponse {
	username: string;
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

/*
const result = await db.send(new QueryCommand({
		TableName: myTable,
		KeyConditionExpression: 'movieId = :movieId',  // PK i databasen heter "movieId" - vanligtvis heter den "pk" i stället
		ExpressionAttributeValues: {
			':movieId': movieId
		}
	}))
*/

export default router
