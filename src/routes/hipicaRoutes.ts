import {Request, Response, Router } from 'express'
import { Hipica, Clases, hHipica } from '../model/hipica'
import { db } from '../database/database'

class HipicaRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    //Mostrar las inscripciones
    private getClases = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Clases.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }

    //Añadir inscripción
    private getnInscripcion = async (req: Request, res: Response) => {
        const {id, tclases, diasem, caballop, pupilaje} = req.params
        console.log(req.params)
        await db.conectarBD()
        const Schema = {
            _id: parseInt(id),
            _tclases: tclases,
            _diasem: parseInt(diasem),
            _caballop: caballop,
            _pupilaje: pupilaje
        }
        const nuSchema = new Clases(Schema)
        await nuSchema.save()
        .then ((doc) => {
            console.log('Se ha guardado ' + doc)
            res.json(doc)
        })
        .catch((error: any) => {
            console.log(error)
            res.send(error)
        })
        await db.desconectarBD()
    }

    //Eliminar una inscripción
    private getEliminar = async (req: Request, res: Response) => {
        const {id} = req.params
        await db.conectarBD()
        await Clases.findByIdAndDelete(
            {_id: id},
            (error, doc: any) => {
                if (error) {
                    console.log(error)
                } else {
                    if (doc == null) {
                        console.log('No existe')
                        res.send('No existe')
                    } else {
                        console.log(doc)
                        res.send('Se ha eliminado la inscripción')
                    }
                }
            }
        )
        await db.desconectarBD()
    }

    //Calcular precio inscripción
    private getPinscrip = async (req: Request, res: Response) => {
        type i = {
            identificador: number,
            precio: number
        }
        let arrayI: Array<i> = new Array<i>()
        await db.conectarBD()
        let t: any
        const query = await Clases.find({})
        for (t of query) {
            const total: any = new Clases(t._id)
            const doc: i = {
                identificador: total._id,
                precio: total.cPrecio()
            }
        arrayI.push(doc)
        console.log(`La inscripción ${total._id} tiene como precio ${total.cPrecio()}€`)
        }
        console.log(arrayI)
        res.json(arrayI)
        await db.desconectarBD()
    }

    //Modificar inscripción
    private modi = async (req: Request, res: Response) => {
        const { id } = req.params 
        const {tclases, diasem, caballop, pupilaje} = req.body
        await db.conectarBD()
        const doc: any = await Clases.findOneAndUpdate(
            {_id: id},
            {
                _id: id,
                _tclases: tclases,
                _diasem: diasem,
                _caballop: caballop,
                _pupilaje: pupilaje
            },
            {
                new: true,
                runValidators: true
            }
        )
        .then((doc) => {
            console.log('Se ha modificado ' + doc)
            res.json(doc)
        })
        .catch((error) => {
            console.log(error)
            res.json({error})
        })
        await db.desconectarBD()
    }

    misrutas() {
        this._router.get('/inscripciones', this.getClases)
        this._router.get('/nuevaI', this.getnInscripcion)
        this._router.get('/eliminar', this.getEliminar)
        this._router.get('/precio', this.getPinscrip)
        this._router.get('/modificar', this.modi)
    }
}

const obj = new HipicaRoutes()
obj.misrutas()
export const hipicaRoutes = obj.router