/**
 * @fileOverview Módulo que define Nodo al servidor para que este pueda hacer uso de estos.
 * @module Generador
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

let algoritmo = require('./Algoritmo.js');
let converter = require('./BaseDatos.js');

const tamanoCelda = 50;

/**
 * Genera un laberinto en el servidor.
 * @param {number} dim - Dimensión del laberinto a generar.
 * @return {Matriz} - Laberinto generado por el servidor.
 */
function generate(dim) {
    let matriz;
    matriz = algoritmo.creaLaberinto(algoritmo.generaMatriz(dim, tamanoCelda, (tamanoCelda * dim) - tamanoCelda));
    return converter.mazeToJson(matriz);
}

module.exports = {
    generate: generate
}