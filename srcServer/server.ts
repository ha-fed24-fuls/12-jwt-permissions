import express from 'express'
import type { Express, Request, Response } from 'express'
import { logger } from './middleware.js'
import registerRouter from './routes/register.js'

// Konfiguration
const app: Express = express()
const port: number = Number(process.env.PORT) || 1337


// Middleware
app.use(express.static('./dist/'))
app.use(express.json())
app.use('/', logger)
// TODO: CORS (behövs när vi vill publicera appen)

// Router-moduler
// TODO: /api/users --> app.use('/api/users', userRouter)


// Endpoints
// POST /api/register
app.use('/api/register', registerRouter)
// POST /api/login



app.get('/api/ping', (req: Request, res: Response) => {
	// Denna används bara för att testa att servern är igång
	res.send({ message: 'Pong' })
})


app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})