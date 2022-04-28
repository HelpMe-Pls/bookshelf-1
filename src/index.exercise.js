// 🐨 you'll need to import React and createRoot from react-dom up here
import React from 'react'
import {createRoot} from 'react-dom/client'

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

function LoginForm({onSubmit, buttonText}) {
	function handleSubmit(event) {
		event.preventDefault()
		const {username, password} = event.target.elements

		onSubmit({
			username: username.value,
			password: password.value,
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">Username</label>
				<input id="username" />
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input id="password" type="password" />
			</div>
			<div>
				<button type="submit">{buttonText}</button>
			</div>
		</form>
	)
}

function App() {
	const [showDialog, setShowDialog] = React.useState(false)
	// Shared state gets overlapped for this case, that's why the implement from './index.extra-2.js' makes more sense
	const open = () => setShowDialog(true)
	const close = () => setShowDialog(false)

	function login(formData) {
		console.log('login', formData)
	}
	function register(formData) {
		console.log('register', formData)
	}

	return (
		<div>
			<Logo width="69" height="69" />
			<h1>Bookshelf</h1>
			<button onClick={open}>Login</button>
			<button onClick={open}>Register</button>
			<div>
				<Dialog aria-label="Login form" isOpen={showDialog}>
					<div>
						<button onClick={close}>Close</button>
					</div>
					<h3>Login</h3>
					<LoginForm onSubmit={login} buttonText="Login" />
				</Dialog>
			</div>
			<div>
				<Dialog aria-label="Login form" isOpen={showDialog}>
					<div>
						<button onClick={close}>Close</button>
					</div>
					<h3>Register</h3>
					<LoginForm onSubmit={register} buttonText="Register" />
				</Dialog>
			</div>
		</div>
	)
}

// 🐨 use createRoot to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
const root = createRoot(document.getElementById('root'))
root.render(<App />)
export {root}
