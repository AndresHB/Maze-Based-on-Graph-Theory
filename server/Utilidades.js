/**
 * @fileOverview Módulo que permite realizar acciones de servicio general.
 * @module utilidades
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */
 
/**
 * Crea una copia del arreglo que recibe como parametro con el valor adicional que se le indico
 * @param {array} a- Array por copiar
 * @param {number} n- Valor por añadir al array copiado
 */
let myPush = (a, n) => a.concat(n);

/**
 * Crea una copia del arreglo que recibe como parametro
 * @param {array} a- Array a copiar
 */
let copyArray = (a) => a.slice(0, a.length);

/**
 * Crea una copia revertida del array que se le indica
 * @param {array} a- Array a revertir
 */
let reverse = (a) => a.map((c, i) => a[a.length - (i + 1)]);

/**
 * Crea un array con dos elementos, una copia del array que recibe por parametro (sin el ultimo valor) y el ultimo valor del array
 * @param {array} a- Array por manipular
 */
let myPop = (a) => new Array(a.slice(0, a.length - 1), a[a.length - 1]);

module.exports = {
    myPush: myPush,
    copyArray: copyArray,
    reverse: reverse,
    myPop: myPop
}