/**
 * @fileOverview Sustituto del switch convencional
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

/** Objeto mySwitch */
class mySwitch {
	
	/**
	 * Constructor de mySwitch
	 * @param {Array} a - Funciones por ejecutar
	 */
    constructor(a = []) {
        this.funciones = a;
    }
	
	/**
	 * Devuelve la funcion en la posicion n del Array de funciones de mySwitch
	 * @param {number} n - Posicion en el Array de funciones correspondiente a la funcion por ejecutar
	 * @return {Function} La funcion por ejecutar
	 */
    getFunction(n) {
        return this.funciones[n];
    }
}