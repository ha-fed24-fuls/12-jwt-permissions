import { useState } from 'react';
import './styles/App.css'
import './styles/button.css'
import type { UserResponse } from './types.js';

interface FormData {
	username: string;
	password: string;
}
// TODO: dela upp App i flera komponenter

const LS_KEY = 'jwt'


const App = () => {
	const [formData, setFormData] = useState<FormData>({ username: '', password: '' })
	const [users, setUsers] = useState<UserResponse[]>([])

	const handleClick = async () => {
		fetch('/api/ping')
	}

	const handleSubmitRegister = async () => {
		// TODO: gör register-knappen disabled tills denna funktion är färdig
		const response = await fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
		const data = await response.json()
		
		// Vi tittar i backend: filen srcServer/routes/register.ts
		// Servern skickar tillbaka ett objekt: { success: boolean, token?: string }
		// TODO: validera med Zod att data variabeln matchar objektet
		
		if( data.success ) {
			const jwt: string = data.token
			localStorage.setItem(LS_KEY, jwt)
			// spara, använd i framtida request
			// uppdatera listan med användare:
			// Alt. 1: skicka nytt request till servern (som om man klickar på knappen "Visa alla användare")
			// Alt. 2: uppdatera state-variabeln direkt <- går inte, eftersom vi inte har userId
			handleGetUsers()  // alt. 1
			// TODO: rensa formuläret, så man inte reggar samma användare igen
		} else {
			// TODO: visa ett informativt felmeddelande i formuläret
		}
	}

	const handleGetUsers = async () => {
		// Obs! Response i frontend är inte samma sak som Response i Express!
		const response: Response = await fetch('/api/users')
		const data = await response.json()

		// TODO: validera datan

		console.log('Data from serveR:', data)
		const userResponse: UserResponse[] = data
		setUsers(userResponse)
	}
	const handleDeleteUser = async (userId: string): Promise<void> => {
		const response: Response = await fetch('/api/users/' + userId, {
			method: 'DELETE'
		})

		// kontrollera status för responsen. Lyckades requestet?
		if( response.status === 204 ) {
			console.log('DELETE lyckades!')
			handleGetUsers() // uppdatera listan
			// En alternativ metod: ta bort användaren direkt ur state-variabeln

		} else {
			console.log('DELETE failade med status ' + response.status)
		}
	}


	return (
		<>
		<header> <h1> Användarhantering </h1> </header>
		<main>

			<div className="box column">
				<p> Testa request </p>
				<button onClick={handleClick}> Skicka HTTP request till server </button>

			</div>

			<div className="box">
				<p> Användare </p>
				<button onClick={handleGetUsers}> Visa alla användare </button>
				<ul className="list">
					{users.map(u => (
						<li key={u.userId} className="row">
							<div className="grow"> {u.username} </div>
							<button onClick={() => handleDeleteUser(u.userId)}> Ta bort </button>
						</li>
					))}
				</ul>
			</div>

			<div className="box column">
				<h2> Registrera ny användare </h2>
				<label> Användarnamn </label>
				<input type="text" placeholder=""
					onChange={event => setFormData({ ...formData, username: event.target.value })}
					value={formData.username}
					/>

				<label> Lösenord </label>
				<input type="password"
					onChange={event => setFormData({ ...formData, password: event.target.value })}
					value={formData.password}
					/>

				{/* TODO: frontend-validering av input-fälten */}
				{/* TODO: gör så man inte kan klicka knappen om allt inte är ifyllt */}
				<button onClick={handleSubmitRegister}> Registrera </button>
			</div>

		</main>
		<footer> </footer>
		</>
	)
}

export default App
