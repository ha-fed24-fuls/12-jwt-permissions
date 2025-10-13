import { useState } from 'react';
import './styles/App.css'
import './styles/button.css'

interface FormData {
	username: string;
	password: string;
}

const App = () => {
	const [formData, setFormData] = useState<FormData>({ username: '', password: '' })

	const handleClick = async () => {
		fetch('/api/ping')
	}

	const handleSubmitRegister = async () => {
		fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
	}


	return (
		<>
		<header> <h1> Användarhantering </h1> </header>
		<main>

			<div className="box column">
				<p> Testa request </p>
				<button onClick={handleClick}> Skicka HTTP request till server </button>

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

			<div className="box">
				<p> Användare </p>
				<ul className="list">
				</ul>
			</div>

		</main>
		<footer> </footer>
		</>
	)
}

export default App
