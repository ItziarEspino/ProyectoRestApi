"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hipicaRoutes = void 0;
const express_1 = require("express");
const hipica_1 = require("../model/hipica");
const database_1 = require("../src/database/database");
class HipicaRoutes {
    constructor() {
        //Mostrar las inscripciones
        this.getClases = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield hipica_1.Clases.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        //Añadir inscripción
        this.getnInscripcion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, tclases, diasem, caballop, pupilaje } = req.params;
            console.log(req.params);
            yield database_1.db.conectarBD();
            const Schema = {
                _id: parseInt(id),
                _tclases: tclases,
                _diasem: parseInt(diasem),
                _caballop: caballop,
                _pupilaje: pupilaje
            };
            const nuSchema = new hipica_1.Clases(Schema);
            yield nuSchema.save()
                .then((doc) => {
                console.log('Se ha guardado ' + doc);
                res.json(doc);
            })
                .catch((error) => {
                console.log(error);
                res.send(error);
            });
            yield database_1.db.desconectarBD();
        });
        //Eliminar una inscripción
        this.getEliminar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.db.conectarBD();
            yield hipica_1.Clases.findByIdAndDelete({ _id: id }, (error, doc) => {
                if (error) {
                    console.log(error);
                }
                else {
                    if (doc == null) {
                        console.log('No existe');
                        res.send('No existe');
                    }
                    else {
                        console.log(doc);
                        res.send('Se ha eliminado la inscripción');
                    }
                }
            });
            yield database_1.db.desconectarBD();
        });
        //Calcular precio inscripción
        this.getPinscrip = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let arrayI = new Array();
            yield database_1.db.conectarBD();
            let t;
            const query = yield hipica_1.Clases.find({});
            for (t of query) {
                const total = new hipica_1.Clases(t._id, t._tclases, t._diasem, t._caballop, t._pupilaje);
                const doc = {
                    identificador: total._id,
                    precio: total.cPrecio()
                };
                arrayI.push(doc);
                console.log(`La inscripción ${total._id} tiene como precio ${total.cPrecio()}€`);
            }
            console.log(arrayI);
            res.json(arrayI);
            yield database_1.db.desconectarBD();
        });
        //Modificar inscripción
        this.modi = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { tclases, diasem, caballop, pupilaje } = req.body;
            yield database_1.db.conectarBD();
            const doc = yield hipica_1.Clases.findOneAndUpdate({ _id: id }, {
                _id: id,
                _tclases: tclases,
                _diasem: diasem,
                _caballop: caballop,
                _pupilaje: pupilaje
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => {
                console.log('Se ha modificado ' + doc);
                res.json(doc);
            })
                .catch((error) => {
                console.log(error);
                res.json({ error });
            });
            yield database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misrutas() {
        this._router.get('/inscripciones', this.getClases);
        this._router.get('/nuevaI', this.getnInscripcion);
        this._router.get('/eliminar', this.getEliminar);
        this._router.get('/precio', this.getPinscrip);
        this._router.get('/modificar', this.modi);
    }
}
const obj = new HipicaRoutes();
obj.misrutas();
exports.hipicaRoutes = obj.router;
