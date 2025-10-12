import './styles/App.css'
import './styles/button.css'

const App = () => {
	const handleClick = async () => {
		fetch('/api/ping')
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
			<ul className="list">
				<li> ett </li>
				<li> ett </li>
				<li> ett </li>
				<li> ett </li>
			</ul>
			</div>

		</main>
		<footer> </footer>
		</>
	)
}

export default App
