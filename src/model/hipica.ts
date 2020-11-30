import {Schema, model} from 'mongoose'

export class Hipica {
    private _id: number
    private _tclases: string
    private _diasem: number
    private _caballop: string
    private _pupilaje: String

    constructor (id: number, tclases: string, diasem: number, caballop: string, pupilaje: string) {
        this._id = id
        this._tclases = tclases
        this._diasem = diasem
        this._caballop = caballop
        this._pupilaje = pupilaje
    }

    get id(){
        return this._id
    }

    get tclases(){
        return this._tclases
    }

    get diasem(){
        return this._diasem
    }

    get caballop(){
        return this._caballop
    }

    get pupilaje(){
        return this._pupilaje
    }

    set diasem(diasem: number){
        if (diasem <= 0){
            throw "Tiene que asistir al menos un día a la semana"
        }
        this._diasem=diasem
    }

    caballo(){
        let precaballo: number
        if (this._caballop == ""){
            throw "No ha introducido si tiene caballo propio"
        } else {
            if (this._caballop=="no"){
                return precaballo = 100
            } else {
                if (this._caballop=="si"){
                    return precaballo = 0
                }
            }
        }
    }

    tPupilaje(){
        let prepupilaje: number
        if (this._pupilaje == ""){
            throw "No ha introducido si desea pupilaje para el caballo"
        } else {
            if (this._pupilaje=="si"){
                return prepupilaje = 250
            } else {
                if (this._pupilaje=="no"){
                    return prepupilaje = 0
                }
            }
        }
    }

    cPrecio(){
        let precio: number
        if (isNaN(this._diasem)){
            throw "No ha introducido los días de clase a la semana"
        } else {
            if (this._tclases=="doma"){
                return precio = this._diasem*35
            } else {
                if (this._tclases=="salto"){
                    return precio = this._diasem*45
                } else {
                    if (this._tclases=="cross"){
                        return precio = this._diasem*40
                    } else {
                        throw "El tipo de clase es incorrecto"
                    }
                }
            }
        }
    }
}

export type hHipica = {
    _id: number,
    _tclases: string,
    _diasem: number,
    _caballop: string,
    _pupilaje: string
}

export const clasesSchema = new Schema (
    {
        _id: {
            type: Number,
            unique: true
        },
        _tclases: String,
        _diasem: {
            type: Number,
            max: 7
        },
        _caballop: String,
        _pupilaje: String
    }
)

export const Clases = model('hipica', clasesSchema)