/**
 * @fileOverview Vista de la página
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

/** Clase Vista */
class View {
	
	/**
	 * Constructor de Vista
	 * @param {Canvas} canvas - Objeto Canvas en el cual se dibujara el laberinto.
	 * @param {number} tamCelda - tamaño que tendra cada celda del laberinto.
	 */
    constructor(canvas, tamCelda) {
        let img = new Image();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.tamC = tamCelda;
        this.trophyImage = new Image();
        this.trophyImage.src = '../img/Trophy.png';
        this.tigreImage = new Image();
        this.tigreImage.src = '../img/Tiger.png';
        this.fail = new Audio('../audio/fail.mp3');
        this.win = new Audio('../audio/gol.mp3');
        this.msg = '';
    }
	
	/**
	 * Envía un mensaje al registro de eventos del juego
	 * @param {string} mensaje - Mensaje que se desea mostrar en el registro.
	 */
    setMessage(mensaje) {
        this.msg = mensaje;
        document.dispatchEvent(mostrarMensaje);
    }
	
	/**
	 * Muestra una imagen de un tigre en una posicion dada
	 * @param {number} x - Posicion en el eje x donde se desea dibujar la imagen.
	 * @param {number} y - Posicion en el eje y donde se desea dibujar la imagen.
	 */
    loadImage(x, y) {
        this.ctx.drawImage(this.tigreImage, x + (this.tamC * 0.25), y + (this.tamC * 0.25), this.tamC - (this.tamC * 0.5), this.tamC - (this.tamC * 0.5));
    }
	
	/**
	 * Muestra una imagen de un trofeo en una posicion dada
	 * @param {number} x - Posicion en el eje x donde se desea dibujar la imagen.
	 * @param {number} y - Posicion en el eje y donde se desea dibujar la imagen.
	 */
    loadTrophy(x, y) {
        this.ctx.drawImage(this.trophyImage, x + (this.tamC * 0.25), y + (this.tamC * 0.25), this.tamC - (this.tamC * 0.5), this.tamC - (this.tamC * 0.5));
    }
	
	/**
	 * Marca con un recuadro una celda del laberinto
	 * @param {number} x1 - Posicion en el eje x donde se desea dibujar el recuadro.
	 * @param {number} y1 - Posicion en el eje y donde se desea dibujar el recuadro.
	 * @param {number} x2 - Posicion en el eje x donde se desea dibujar la imagen al desplazarse.
	 * @param {number} y2 - Posicion en el eje y donde se desea dibujar la imagen al desplazarse.
	 * @param {number} tam - Tamaño del nodo
	 * @param {number} co - Color de fondo
	 */
    mark(x1, y1, x2, y2, tam, co) {
        this.ctx.beginPath();
        this.ctx.rect(x1 + (tam * 0.25), y1 + (tam * 0.25), tam - (tam * 0.5), tam - (tam * 0.5));
        this.ctx.fillStyle = co;
        this.ctx.fill();
        this.ctx.stroke();
        this.loadImage(x2, y2);
    }
 
	/**
	 * Dibuja una celda del laberinto.
	 * @param {Nodo} node - Posicion en el eje x donde se desea dibujar el recuadro.
	 */
    drawNode(node) {
        let X = node.ejeX,
            Y = node.ejeY,
            T = node.tamanyo;
        let drawLine = (x1, y1, x2, y2) => {
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
        }
        let drawSwitch = new mySwitch([
            null,
            () => {
                drawLine(X, Y, X + T, Y);
            },
            () => {
                drawLine(X + T, Y, X + T, Y + T);
            },
            () => {
                drawLine(X, Y + T, X + T, Y + T);
            },
            () => {
                drawLine(X, Y, X, Y + T);
            }
        ]);
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "red";
        this.ctx.rect(X, Y, T, T);
        this.ctx.fillStyle = "yellow";
        this.ctx.fill();
        this.ctx.stroke();
        node.conexiones.forEach(
            (e) => {
                this.ctx.beginPath();
                drawSwitch.getFunction(e)();
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = 'yellow';
                this.ctx.stroke();
            }
        );
        (node.visitado) ? vista.loadImage(X, Y): true;
        (node.nodoFinal) ? vista.loadTrophy(X, Y): true;
    }
	
	/**
	 * Crea los listeners que seran utilizados para dibujar sobre el canvas y mostrar mensajes en el registro de eventos.
	 */
    createListeners() {
        const dibujaLab = () => {
            vista.canvas.height = vista.tamC * modelo.matriz.dimension;;
            vista.canvas.width = vista.tamC * modelo.matriz.dimension;;

            function dibujaCelda(raiz, node, i, j, n) {
                vista.drawNode(node);
                (j < n) ? dibujaCelda(raiz, node.este, i, j + 1, n): (i < n) ? dibujaCelda(raiz.sur, raiz.sur, i + 1, 1, n) : true;
            }
            dibujaCelda(modelo.matriz.control, modelo.matriz.control, 1, 1, modelo.matriz.dimension);
        };

        function showMessage() {
            document.getElementById('msg').innerHTML += new Date().toLocaleString() + ' ' + vista.msg + '<br>';
        }
        document.addEventListener("Maze2Draw", e => dibujaLab());
        document.addEventListener("showMessage", e => showMessage());
    }
	
	/**
	 * Desactiva todos los botones de GUI
	 */
    deactivate() {
        document.getElementById("gen").disabled = true;
        document.getElementById("guardar").disabled = true;
        document.getElementById("cargar").disabled = true;
        document.getElementById("Solucion").disabled = true;
    }
	
	/**
	 * Activa los botones del GUI
	 * @param {boolean} solucion - Booleano que decide si debe desactivarse el boton de solucionar laberinto.
	 */
    activate(solucion) {
        document.getElementById("gen").disabled = false;
        document.getElementById("guardar").disabled = false;
        document.getElementById("cargar").disabled = false;
        document.getElementById("speed").disabled = false;
        document.getElementById("Solucion").disabled = solucion;
    }
	
	/**
	 * Desactiva algunos de los botones del GUI para cuando la pagina se carga la primera vez.
	 */
    initialState() {
        document.getElementById("Solucion").disabled = true;
        document.getElementById("guardar").disabled = true;
        document.getElementById("speed").disabled = true;
        document.getElementById("link").disabled = true;
    }
	
	/**
	 * Envía un mensaje a la consola declarando que la partida ha terminado y el jugador ha ganado.
	 */
    declareWinner() {
        this.setMessage('Felicidades has ganado');
        vista.win.play();
    }
}

let vista;
const evento = new CustomEvent("Maze2Draw");
const mostrarMensaje = new CustomEvent("showMessage");