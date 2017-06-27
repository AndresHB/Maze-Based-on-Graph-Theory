﻿/**
 * @fileOverview Módulo que gestiona la conversión de un laberinto a JSON y un JSON a laberinto
 * @module BaseDatos
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

let nodo = require('./Nodo.js');
let matriz = require('./Matriz.js');
let utils = require('./Utilidades.js');

/**
 * Copia un nodo
 * @param {Nodo} node - El nodo a ser copiado
 * @returns {Nodo} El nuevo nodo copiado
 */
function copyNode(node) {
    let newNode = new nodo.Nodo(node.tamanyo, node.ejeX, node.ejeY);
    newNode.visitado = node.visitado;
    newNode.nodoFinal = node.nodoFinal;
    newNode.conexiones = node.conexiones;
    newNode.norte = node.norte;
    newNode.este = node.este;
    newNode.sur = node.sur;
    newNode.oeste = node.oeste;
    return newNode;
}

/**
 * Define el tipo de objeto que se recupera.
 * @param {string} k - Llave del objeto
 * @param {Object} v - Valor del objeto
 * @returns {Object} El objeto a ser parseado
 */
function revive(k, v) {
    if (v instanceof Object && v._class == 'Matriz')
        return matriz.Matriz.from(v);
    if (v instanceof Object && v._class == 'Nodo')
        return nodo.Nodo.from(v);
    return v;
}

/**
 * Define el tipo de objeto que se guarda.
 * @param {string} k - Llave del objeto
 * @param {Object} v - Valor del objeto
 * @returns {string} El valor que se va a agregar a la cadena JSON
 */
function replacer(k, v) {
    if (v instanceof matriz.Matriz)
        return matriz.Matriz.to(v);
    if (v instanceof nodo.Nodo)
        return nodo.Nodo.to(v);
    return v;
}

/**
 * Convierte una matriz (con el laberinto adentro) en formato JSON
 * @param {Matriz} matriz - La matriz por convertir
 * @returns {string} La matriz en formato JSON
 */
function mazeToJson(matriz) {
    let toJSON = [matriz.dimension, matriz.solucion];

    /**
	 * Borra las conexiones entre nodos para no confundir el JSON.stringify
	 * @param {Nodo} node - El nodo para quitar las conexiones
	 * @returns {Nodo} El nodo sin las conexiones
	 */
    function limpiaConexiones(node) {
        node.norte = null;
        node.este = null;
        node.sur = null;
        node.oeste = null;
        return node;
    }

    /**
	 * Recorre la matriz guardando los nodos en orden en un array.
	 * @param {Array} a - Array que lleva los nodos a los cuales se les aplicara el JSON.stringify
	 * @param {Nodo} raiz - Nodo que guia al metodo al cambiar de fila en la matriz
	 * @param {Nodo} node - Nodo actual que se va incorporando al Array a (usando myPush para realizar copias de a)
	 * @param {number} i - Fila del node para ubicar su posicion
	 * @param {number} j - Columna del node para ubicar su posicion
	 * @param {number} n - Tamaño de la matriz que indica el final del metodo
	 * @returns {string} Conversion de un Array de nodos
	 */
    function toCode(a, raiz, node, i, j, n) {
        let aN, aR;
        aR = (j == 1) ? raiz.sur : raiz;
        aN = node.este;
        let a2 = utils.myPush(a, limpiaConexiones(node));
        return (j < n) ? toCode(a2, aR, aN, i, j + 1, n) :
            (i < n) ? toCode(a2, aR, aR, i + 1, 1, n) : JSON.stringify(a2);
    }
    return toCode(toJSON, matriz.control, matriz.control, 1, 1, matriz.dimension);
}

/**
 * Convierte un string de JSON a una matriz (Con el laberinto adentro)
 * @param {string} code - JSON de un Array de nodos
 * @returns {Matriz} La matriz construida con el laberinto formado adentro
 */
function JsonToMaze(code) {
    /**
	 * Repara los nodos que vienen sin metodos despues de aplicarles JSON.parse
	 * @param {Array} a - Array de nodos por reparar
	 * @returns {Array} Array de nodos reparados
	 */
    let fixNodes = (a) => a.map((e) => copyNode(e));

    /**
	 * Añade a un Array nodos que ya estan conectados en sus puntos este y oeste
	 * @param {Array} nA - Array de nodos con sus puntos este y oeste conectados
	 * @param {Array} oA - Array con nodos desconectados
	 * @param {Nodo} node - Nodo conectado por añadir a nA (usando myPush)
	 * @param {number} i - Posicion actual del Array oA
	 * @param {number} n - Dimension de la matriz que se esta recuperando
	 * @returns {Array} Array con nodos conectados con sus puntos este y oeste
	 */
    function addNode(nA, oA, node, i, n) {
        nA2 = utils.myPush(nA, node);
        return (i < (oA.length - 1)) ? simplify(nA2, oA, oA[i + 1], oA[i + 1], i + 2, n) : nA2;
    }

    /**
	 * Simplifica la conexion de nodos al preparar los puntos este y oeste
	 * @param {Array} nA - Array de nodos con sus puntos este y oeste conectados
	 * @param {Array} oA - Array con nodos desconectados
	 * @param {Nodo} raiz - Nodo con sus puntos este y oeste conectados
	 * @param {Nodo} node - Nodo por redirigir sus puntos este y oeste
	 * @param {number} i - Posicion actual del Array oA
	 * @param {number} n - Dimension de la matriz que se esta recuperando
	 * @returns {Array} Array con nodos conectados con sus puntos este y oeste
	 */
    function simplify(nA, oA, raiz, node, i, n) {
        node.este = oA[i];
        oA[i].oeste = node;
        return ((i + 1) % n == 0) ? addNode(nA, oA, raiz, i, n) : simplify(nA, oA, raiz, oA[i], i + 1, n);
    }

    /**
	 * Conecta entre nodos los puntos norte y sur.
	 * @param {Nodo} nodeA - Nodo que se posicionara al norte de nodeB
	 * @param {Nodo} nodeB - Nodo que se posicionara al sur de nodeA
	 * @returns {Matriz} La matriz construida con el laberinto formado adentro
	 */
    function connectNode(nodeA, nodeB) {
        nodeA.sur = nodeB;
        nodeB.norte = nodeA;
        return (nodeA.este != null) ? connectNode(nodeA.este, nodeB.este) : true; //Que tramposo soy xD
    }

    /**
	 * Arma una matriz guiada por un Array de nodos conectados en sus puntos este y oeste
	 * @param {Array} nA - Array de nodos con sus puntos este y oeste conectados
	 * @param {number} i - Posicion actual en el Array nA
	 * @param {number} n - Dimension de la matriz que se esta recuperando
	 * @returns {Nodo} Nodo superior izquierdo de la matriz reconstruida
	 */
    function toMatriz(nA, i, n) {
        connectNode(nA[i], nA[i + 1]);
        return ((i + 2) < n) ? toMatriz(nA, i + 1, n) : nA[0];
    }

    let fromJSON = JSON.parse(code, revive);
    let nodesJSON = fixNodes(fromJSON.slice(2, fromJSON.length));
    let nodesSimplify = simplify([], nodesJSON, nodesJSON[0], nodesJSON[0], 1, fromJSON[0]);
    return new matriz.Matriz(
        fromJSON[0], //Dimensión de la matriz.
        toMatriz(nodesSimplify, 0, fromJSON[0]), //Nodo por el cual comienza el laberinto.
        fromJSON[1] //Camino que lleva directamente al final del laberinto.
    );
}

module.exports = {
    JsonToMaze: JsonToMaze,
    mazeToJson: mazeToJson
}