import express from 'express'
import morgan from 'morgan'

import { hipicaRoutes } from './routes/hipicaRoutes'
import { identificacionRoutes } from './routes/identificacionRoutes'


class Server {
    private app: express.Application
    constructor(){
        this.app = express()
        this.config()
        this.routes()
    }
    private async config(){

        this.app.set('port', process.env.PORT || 3000)

        this.app.use(express.json()) 
        this.app.use(morgan('dev')) 
    }

    private routes(){
        this.app.use('/hipica', hipicaRoutes)
        this.app.use('/id', identificacionRoutes)
    }
    start(){
        this.app.listen(this.app.get('port'), 
        () => {
            console.log(`Server on port: ${this.app.get('port')}`)
        })
    }
}

const server = new Server()
server.start()