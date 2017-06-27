/**
 * @fileOverview Conjunto de entidades que le dan forma a la pagina
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

/** Clase modelo */
class Model {
	/**
	 * Constructor de Model
	 */
    constructor() {
        this.matriz = undefined;
        this.actual = undefined;
        this.winner = true;
    }
	/**
	 * Establece un laberinto como nuevo modelo.
	 * @param {Matriz} newMatriz - Laberinto el cual debe ser cargado.
	 */
    setModel(newMatriz) {
        this.matriz = newMatriz;
        this.actual = this.matriz.control;
        this.actual.visitado = true;
        this.winner = false;
        document.dispatchEvent(evento);
    }

	/**
	 * Ubica en donde se encuentra el nodo de la Matriz que ubica al jugador.
	 * @param {Nodo} raiz - Primer nodo que forma al laberinto.
	 * @param {Nodo} node - nodo en el cual se trabajara el metodo
	 * @param {number} i - Fila del laberinto .
	 * @param {number} j - Columna del laberinto.
	 * @param {number} n - Dimensión del laberinto.
	 * returns {Nodo} Nodo en el que esta el jugador en el laberinto
	 */
    loadProcess(raiz, node, i, j, n) {
        return (node.visitado) ? node :
            (j < n) ? this.loadProcess(raiz, node.este, i, j + 1, n) :
            (i < n) ? this.loadProcess(raiz.sur, raiz.sur, i + 1, 1, n) : this.matriz.control;
    }

	/**
	 * Carga el laberinto en la logica del MVC 
	 * @param {Matriz} newMatriz - Laberinto el cual debe ser cargado.
	 */
    loadModel(newMatriz) {
        this.matriz = newMatriz;
        this.actual = this.loadProcess(newMatriz.control, newMatriz.control, 1, 1, newMatriz.dimension);
        this.winner = false;
        document.dispatchEvent(evento);
    }
}

let modelo;