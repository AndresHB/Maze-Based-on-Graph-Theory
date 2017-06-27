/**
 * @fileOverview Módulo que define Matriz al servidor para que este pueda hacer uso de Matrices.
 * @module Matriz
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

/** Objeto Matriz */
class Matriz {
	/**
	 * Constructor de Matriz
	 * @param {number} d - Valor de la dimension
	 * @param {Nodo} c - Nodo inicial (Posicion superior izquierda)
	 * @param {Array} s - Array que contiene la solucion del laberinto
	 */
    constructor(d = 0, c = null, s = null) {
        this.control = c;
        this.solucion = s;
        this.dimension = d;
    }
}

module.exports = {
    Matriz: Matriz
}