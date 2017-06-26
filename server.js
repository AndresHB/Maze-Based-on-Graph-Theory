/**
 * @fileOverview Implementación del Servidor.
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

/**
 * Paquetes utilizado por el servidor para su correcto funcionamiento.
 */
let express = require('express');
let fs = require("fs");
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let generator = require('./server/Generador.js');

/**
 *Esta sección contiene los parametros para configurar el servidor
 * @param {number} serverPort - Puerto del servidor por el cual se tramitaran los request
 * @param {string} dbAddress - Dirección IP donde se encuentra alojado el MongoDB
 * @param {string} db - Nombre de la base de datos en la cual guardar/cargar los laberintos.
 */
const serverPort = 8081;
const dbAddress = 'localhost';
const db = 'maze';

/**
 *Inicia la conexion con el Mongoose y la mantiene abierta mientras se ejecuta el servidor.
 */
mongoose.connect('mongodb://' + dbAddress + '/' + db);

/**
 *Configurar promesas de Mongoose para que sean igual que las nativas
 */
mongoose.Promise = global.Promise;
module.exports = mongoose;

/**
 *Crea el modelo de la base de datos para guardar partidas en Mongoose
 *El modelo esta en el path mostrado
 */
let SavedGame = require('./models/savedGame');

/**
 *Crea el servidor.
 */
let server = express();

/**
 *Crea el router del servidor para direccionar las solicitudes.
 */
let router = express.Router();

/**
 *Permite que el servidor pueda acceder al body de un request.
 */
server.use(bodyParser.urlencoded({
    extended: false
}))
server.use(bodyParser.json());

/**
 *Esta seccion se encarga de recibir el request de solicitud de la página.
 */
router.route('/')
    .get((req, res) => {
        //
        res.writeHead(200);
        fs.readFile('Public/index.html', null, (error, data) => {
            (error) ? res.write("<h1>Err 404: Pagina no encontrada</h1>"): res.write(data);
            res.end();
        });
    });

/**
 *Esta seccion se encarga de tramitar el request de generar un laberinto.
 * @param {number} :dim - La dimension del laberinto deseado.
 * Contesta el request con el laberinto generado por el servidor.
 */
router.route('/generar/:dim')
    .get((req, res) => {
        console.log('Generar laberinto de ' + req.params.dim + 'x' + req.params.dim);
        res.json(generator.generate(req.params.dim));
        console.log('Generado con exito');
    });

/**
 *Esta seccion se encarga de tramitar el request de cargar un laberinto.
 * @param {string} :name - El nombre del laberinto que se desea cargar.
 * Contesta el request con el laberinto que se encontró en el servidor.
 */
router.route('/cargar/:name')
    .get((req, res) => {
        console.log('Cargar laberinto con nombre: ' + req.params.name);
        let query = SavedGame.findOne({
            _id: req.params.name
        });
        query.exec().catch(err => {
            console.log('error');
            res.sendStatus(400);
            res.end();
        }).then(result => res.json(result.maze)).then(obj => console.log('Encontrada la partida y enviada al solicitante'));
    });

/**
 *Esta seccion se encarga de tramitar el request de guardar un laberinto.
 * @param {string} :name - El nombre del laberinto que se desea guardar
 * @param {string} req.body - El laberinto que fue enviado por el request para guardarse.
 * Envia un mensaje al cliente con el resultado de la operación.
 */
router.route('/guardar/:name')
    .post((req, res) => {
        console.log('Guardar laberinto con nombre: ' + req.params.name);
        let insert = new SavedGame({
            _id: req.params.name,
            maze: JSON.stringify(req.body)
        });
        insert.save().then(a => {
            console.log('Guardado con nombre: ' + req.params.name);
            res.write("Laberinto " + req.params.name + " guardado exitosamente!");
            res.end();
        }).catch(err => {
            console.log('Error al guardar partida... Llave duplicada');
            res.write("Laberinto " + req.params.name + " no se pudo guardar porque existe otra partida con ese nombre");
            res.end();
        });
    });
/** 
 *Esta seccion se encarga de registrar las rutas a utilizar.
 */
server.use('/', router);

/** 
 *Ruta para cargar imagenes y assets del cliente.
 */
server.use(express.static("public"));

/** 
 *Muestra retroalimentación sobre el estado del servidor al iniciarse. Ademas pone al servidor en estado de escucha.
 */
console.log('Server iniciado en ' + serverPort);
console.log('Base de datos disponible en mongodb://' + dbAddress + '/maze');
server.listen(serverPort);