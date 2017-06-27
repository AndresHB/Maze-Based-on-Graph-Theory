/**
 * @fileOverview Controlador de la página
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

let worker = new Worker("js/Worker.js");

class Controller {
	
	/**
	 * Constructor de Constructor
	 */
    constructor() {}

	/**
	 * Genera un laberinto localmente.
	 */
    getGenLocal() {
        let dimM = parseInt(document.getElementById("Dimension").value);
        let errorDim = () => vista.setMessage("Dimension de laberinto invalida");

		/**
		 * Caso de exito del metodo getGenLocal
		 */
        function correctDim() {
            vista.setMessage("Generando Laberinto");
            worker.addEventListener("message", (e) => {
                modelo.setModel(JsonToMaze(e.data));
                vista.activate(false);
            });
            worker.postMessage({
                D: dimM,
                T: vista.tamC,
                E: (vista.tamC * dimM)
            });
            vista.setMessage("Generado localmente");
            vista.activate(false);
        }
        (isNaN(dimM) || dimM < 2 || dimM > 40) ? errorDim(): correctDim();
    }

	/**
	 * Define la manera de generar laberinto debe usar la pagina
	 */
    getGen() {
        return (document.getElementById("isLocal").checked) ? this.getGenLocal() : this.getGenServer();
    }
	
	/**
	 * Genera un laberinto desde el servidor.
	 */
    getGenServer() {
        let dimM = parseInt(document.getElementById("Dimension").value);
        let errorDim = () => vista.setMessage("Dimension de laberinto invalida");

		/**
		 * Caso de exito del metodo getGenServer
		 */
        function correctDim() {
            vista.setMessage("Generando Laberinto");
            fetch("/generar/" + dimM, {
                    method: "GET"
                })
                .then((response) => {
                    return (response.status === 200) ? response.json() : "Not 200";
                })
                .then(obj => {
                    modelo.setModel(JsonToMaze(obj));
                    vista.setMessage("Generado desde Server");
                })
                .catch(err => {
                    vista.setMessage("No hay conexion con el servidor, generado localmente");
                    worker.addEventListener("message", (e) => {
                        modelo.setModel(JsonToMaze(e.data));
                        vista.activate(false);
                    });
                    worker.postMessage({
                        D: dimM,
                        T: vista.tamC,
                        E: (vista.tamC * dimM)
                    });
                });
            vista.activate(false);
        }
        (isNaN(dimM) || dimM < 2 || dimM > 40) ? errorDim(): correctDim();
    }

	/**
	 * Define la manera de guardar una partida
	 */
    postSave() {
        return (document.getElementById("isLocal").checked) ? this.postSaveLocal() : this.postSaveServer();
    }

	/**
	 * Guarda una partida localmente
	 */
    postSaveLocal() {
        let name = document.getElementById('name').value;
        let savedgame = mazeToJson(modelo.matriz);
        this.savingLocaly(name, savedgame);
    }

	/**
	 * Guarda una partida en el servidor
	 */
    postSaveServer() {
        let name = document.getElementById('name').value;
        let savedgame = mazeToJson(modelo.matriz);
        modelo.loadModel(JsonToMaze(savedgame));
        fetch("/guardar/" + name, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: savedgame
            })
            .then(response => {
                return (response.status === 200) ? response.text() : 'No encontrado en server, procediendo a guardado local';
            })
            .then(obj => {
                vista.setMessage(obj);
            })
            .catch(err => {
                this.savingLocaly(name, savedgame);
            });
    }

	/**
	 * Define la manera de cargar una partida
	 */
    getLoad() {
        return (document.getElementById("isLocal").checked) ? this.getLoadLocal() : this.getLoadServer();
    }

	/**
	 * Carga una partida desde el servidor
	 */
    getLoadServer() {
        let name = document.getElementById('name').value;
        fetch("/cargar/" + name, {
                method: "GET"
            })
            .then((response) => {
                return (response.status === 200) ? (vista.setMessage("Cargado desde Server"), response.json()) : (vista.setMessage("Partida no encontrada en el servidor"), loadingLocaly(name));
            })
            .then(obj => {
                modelo.loadModel(JsonToMaze(obj));
                vista.activate(false);
            })
            .catch((err) => {
                this.loadingLocaly(name);
                vista.activate(false);
            });
    }

	/**
	 * Carga una partida localmente
	 */
    getLoadLocal() {
        let name = document.getElementById('name').value;
        this.loadingLocaly(name);
        vista.activate(false);
    }

	/**
	 * Guarda localmente un laberinto
	 * @param {string} name - Nombre de la partida por guardar
	 */
    savingLocaly(name, savedgame) {
        vista.setMessage("Intentando Guardar Localmente...");
        localStorage[name] = JSON.stringify(savedgame);
        vista.setMessage('Guardado localmente exitosamente');
    }

	/**
	 * Carga localmente un laberinto
	 * @param {string} name - Nombre de la partida por cargar
	 */
    loadingLocaly(name) {
        vista.setMessage("Intentando Cargar Localmente...");
        localStorage[name] ? vista.setMessage('Partida local encontrada') : vista.setMessage('No hay partida local con ese nombre');
        modelo.loadModel(JsonToMaze(JSON.parse(localStorage[name])));
        (modelo.matriz) ? vista.setMessage('Cargado localmente'): vista.setMessage('No se pudo cargar localmente');
    }

	/**
	 * Controla el desplazamiento del jugador por el laberinto
	 * @param {number} e - Numero de tecla presionada
	 */
    controlCases(e) {
        let next = null,
            num, boton, check;
        let controlSwitch = new mySwitch([
            () => {
                next = modelo.actual.oeste;
                num = 4;
            },
            () => {
                next = modelo.actual.norte;
                num = 1;
            },
            () => {
                next = modelo.actual.este;
                num = 2;
            },
            () => {
                next = modelo.actual.sur;
                num = 3;
            }
        ]);

		/**
		 * Mueve la imagen que representa al jugador
		 */
        function canMove() {
            check = modelo.actual.conexiones.some((e) => {
                return (e == num) ?
                    (vista.mark(modelo.actual.ejeX, modelo.actual.ejeY, next.ejeX, next.ejeY, modelo.actual.tamanyo, "white"), true) :
                    false;
            });
            (check) ?
            ((next.nodoFinal) ?
                (vista.activate(true), modelo.winner = true, vista.declareWinner()) :
                (modelo.actual.visitado = false, next.visitado = true, modelo.actual = next)) :
            vista.fail.play();
        }
        boton = (e.keyCode) - 37;
        (0 <= boton && boton <= 4) ? controlSwitch.getFunction(boton)(): true;
        (next && !modelo.winner) ? canMove(): true;
    }

	/**
	 * Recorre el laberinto mostrando su solucion
	 */
    autoControl() {
        let speed = parseInt(document.getElementById('speed').value);
        let errorSpeed = () => vista.setMessage("Velocidad de solucion invalida");

		/**
		 * Recorre el laberinto cuando la velocidad ingresada es correcta
		 */
        function correctSpeed() {
            vista.deactivate();
            modelo.actual = modelo.matriz.control;
            let solucion = reverse(modelo.matriz.solucion);
            let sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

			/**
			 * Mueve la imagen que representa al jugador de forma automatica
			 * @param {Nodo} node - Nodo al cual se dirige la imagen
			 * @param {Array} solution - Array con el camino solucion del laberinto
			 */
            function autoMovement(next, solution) {
                let nS = myPop(solution);
                vista.mark(modelo.actual.ejeX, modelo.actual.ejeY, next.ejeX, next.ejeY, modelo.actual.tamanyo, "grey");
                modelo.actual = next;
                (next.nodoFinal) ? (vista.activate(true), vista.declareWinner()) : sleep(speed).then(() => autoMovement(next.go(nS[1]), nS[0]));
            }
            let newSolution = myPop(solucion);
            modelo.winner = true;
            sleep(speed).then(() => autoMovement(modelo.actual.go(newSolution[1]), newSolution[0]));
        }
        (isNaN(speed) || speed < 0 || speed > 1000) ? errorSpeed(): correctSpeed();
    }

	/**
	 * Guarda una imagen del laberinto en su estado actual
	 */
    save() {
        let dt = document.getElementById("Panel").toDataURL('image/jpeg');
        this.href = dt;
    }
	
}

let controller = new Controller();

/**
 * Funciones por ejecutar al cargar la pagina
 */
window.onload = () => {
    let leCanvas = document.getElementById("Panel");
    vista = new View(leCanvas, 50);
    vista.createListeners();
    modelo = new Model();
    vista.initialState();
    window.addEventListener('keydown', controller.controlCases);
    document.getElementById("link").addEventListener("click", controller.save, false);
}