/**
 * @fileOverview Conjunto de funciones vitales en la construccion del laberinto
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

/**
 * Crea una copia del arreglo que recibe como parametro con el valor adicional que se le indico
 * @param {Array} a - Array por copiar
 * @param {number} n - Valor por añadir al array copiado
 */
let myPush = (a, n) => a.concat(n);

/**
 * Crea una copia del arreglo que recibe como parametro
 * @param {Array} a - Array a copiar
 */
let copyArray = (a) => a.slice(0, a.length);

/**
 * Crea una copia revertida del array que se le indica
 * @param {Array} a - Array a revertir
 */
let reverse = (a) => a.map((c, i) => a[a.length - (i + 1)]);

/**
 * Crea un array con dos elementos, una copia del array que recibe por parametro (sin el ultimo valor) y el ultimo valor del array
 * @param {Array} a - Array por manipular
 */
let myPop = (a) => new Array(a.slice(0, a.length - 1), a[a.length - 1]);

/**
 * Genera una matriz
 * @param {number} dim - Valor de la dimension de la matriz
 * @param {number} tam - Valor del tamaño de las celdas
 * @param {number} esp - Valor de las coordenadas del nodo inferior derecho de la matriz
 * @return {Matriz} Matriz formada
 */
function generaMatriz(dim, tam, esp) {
    let primero = new Nodo(tam, esp, esp);
	
	/**
	 * Construye una fila de una matriz(Excepto la primera fila)
	 * @param {Nodo} raiz - Primer nodo de la fila, que se va construyendo
	 * @param {Nodo} newO - Nodo que se posicionara del lado izquierdo del nodo que se esta generando
	 * @param {Nodo} newS - Nodo que se posicionara del lado inferior del nodo que se esta generando
	 * @param {number} x - Coordenada del eje x del nodo que se esta generando
	 * @param {number} y - Coordenada del eje y del nodo que se esta generando
	 * @return {Nodo} Nodo superior izquierdo de la matriz
	 */	
    function buildRow(raiz, newO, newS, x, y) {
        let node = new Nodo(tam, x + tam, y);
        node.oeste = newO;
        newO.este = node;
        node.sur = newS;
        newS.norte = node;
        return ((x + tam * 2) < (dim * tam)) ? buildStructure(raiz, node, newS.este, x + tam, y) :
            (0 < y) ? buildStructure(raiz, null, raiz.este, x + tam, y) : raiz;
    }

	/**
	 * Construye una columna para guiar una fila
	 * @param {Nodo} raiz - Primer nodo de la fila, que se va construyendo
	 * @param {Nodo} newS - Nodo que se posicionara del lado inferior del nodo que se esta generando
	 * @param {number} x - Coordenada del eje x del nodo que se esta generando
	 * @param {number} y - Coordenada del eje y del nodo que se esta generando
	 * @return {Nodo} Nodo superior izquierdo de la matriz
	 */
    function buildColumn(raiz, newS, x, y) {
        let aux = new Nodo(tam, 0, y - tam);
        let node = new Nodo(tam, tam, y - tam);
        raiz.norte = aux;
        aux.sur = raiz;
        node.oeste = aux;
        aux.este = node;
        node.sur = newS;
        newS.norte = node;
        return (0 < (y - tam) || 0 < x) ? buildStructure(aux, node, newS.este, tam, y - tam) : aux;
    }
	
	/**
	 * Construye la primera fila de la matriz
	 * @param {Nodo} raiz - El nodo que se posicionara del lado derecho del nodo que se esta creando
	 * @param {number} x  Coordenada del eje x del nodo que se esta generando
	 * @param {number} y - Coordenada del eje y del nodo que se esta generando
	 * @return {Nodo} Nodo superior izquierdo de la matriz
	 */
    function firstRow(raiz, x, y) {
        let node = new Nodo(tam, x - tam, y);
        node.este = raiz;
        raiz.oeste = node;
        return (0 < x - tam) ? buildStructure(node, null, null, x - tam, y) : buildStructure(node, null, node.este, x - tam, y);
    }
	
	/**
	 * Define el metodo que sigue por ejecutarse segun el estado actual de la matriz
	 * @param {Nodo} raiz- Primer nodo de la fila, que se va construyendo
	 * @param {Nodo} newO - Nodo que se posicionara del lado izquierdo del nodo que se esta generando
	 * @param {Nodo} newS - Nodo que se posicionara del lado inferior del nodo que se esta generando
	 * @param {number} x - Coordenada del eje x del nodo que se esta generando
	 * @param {number} y - Coordenada del eje y del nodo que se esta generando
	 * @return {Nodo} Nodo superior izquierdo de la matriz
	 */
    function buildStructure(raiz, newO, newS, x, y) {
        return (newO) ? buildRow(raiz, newO, newS, x, y) :
            (newS) ? buildColumn(raiz, newS, x, y) : firstRow(raiz, x, y);
    }
	
    return new Matriz(
        dim, //Dimensión de la matriz.
        buildStructure(primero, null, null, esp, esp), //Primer nodo de la matriz ya formada.
        null //Null porque aún no hay un laberinto adentro, no hay solución.
    );
}

/**
 * Genera un laberinto dentro de una matriz
 * @param {Matriz} tabla - Matriz con la cual se guiara el laberinto
 * @return {Matriz} Copia de la matriz tabla con el laberinto adentro
 */
function creaLaberinto(tabla) {
    let solucion;
	
	/**
	 * Define el nuevo nodo con mayor distancia del inicio
	 * @param {Nodo} nN - Nuevo nodo con mayor distancia desde el inicio
	 * @param {Array} nM - Array de coordenadas para llegar del primer nodo al nN
	 * @return {Array} Array con el nodo mas distante y la distancia que esta del nodo inicial
	 */
    let nuevoMayor = (nN, nM) => {
        solucion = copyArray(nM);
        return [nN, nM.length];
    };
	
	/**
	 * Define la coordenada opuesta  de la que le ingresa
	 * @param {number} n - Coordenada por revertir
	 * @return {number} Coordenada opuesta a la que recibio
	 */
    let opuesto = n => (n < 3) ? (n + 2) : (n - 2);

	/**
	 * Genera un numero random entre min y max
	 * @param {number} min - Valor minimo
	 * @param {number} max - Valor maximo
	 * @return {number} Numero aleatorio entre min y max
	 */	
    let getRandom = (min, max) => Math.floor((Math.random() * max) + min);

	/**
	 * Define el nodo mas distante del inicial y su distancia
	 * @param {Nodo} oN - Nodo que antes era el mas distante del inicial
	 * @param {Nodo} nM - Nodo que puede ser el nuevo mas distante del inicial
	 * @param {number} oM - Distancia entre el nodo inicial y oN
	 * @param {number} nM - Distancia entre el nodo inicial al nM
	 * @return {Array} Array con el nodo mas distante y la distancia que esta del nodo inicial
	 */
    let getEnd = (oN, nN, oM, nM) => (!oN || oM < nM.length) ? nuevoMayor(nN, nM) : [oN, oM];

	/**
	 * Metodo que hace backtracking cuando se necesita
	 * @param {Nodo} node - Nodo actualmente visitado en la elaboracion del laberinto
	 * @param {Array} pila - Registro de movimiento en la elaboracion del laberinto
	 * @param {Nodo} nodeF - Posible nodo final
	 * @param {number} numM -	Distancia del nodo inicial al nodoF
	 * @return {Nodo} Nodo inicial del laberinto
	 */
    function deadEnd(node, pila, nodeF, numM) {
        let finalNode = getEnd(nodeF, node, numM, pila);
        let newNodoF = finalNode[0];
        let newPila = myPop(pila);
        (nodeF) ? nodeF.nodoFinal = false: true;
        newNodoF.nodoFinal = true;
        return (pila.length == 0) ? node : findPath(node.go(opuesto(newPila[1])), newPila[0], newNodoF, finalNode[1]);
    }

	/**
	 * Define el siguiente paso a dar en la generacion del laberinto
	 * @param {Array} opc - Opciones de desplazamiento
	 * @param {Nodo} node - Nodo actualmente visitado en la elaboracion del laberinto
	 * @param {Array} pila - Registro de movimiento en la elaboracion del laberinto
	 * @param {Nodo} nodeF - Posible nodo final
	 * @param {number} numM - Distancia del nodo inicial al nodoF
	 * @return {Nodo} Nodo inicial del laberinto
	 */
    function alleyClear(opc, node, pila, nodeF, numM) {
        let num = getRandom(0, opc.length);
        node.connect(opc[num]);
        node.go(opc[num]).connect(opuesto(opc[num]));
        return findPath(node.go(opc[num]), myPush(pila, opc[num]), nodeF, numM);
    }
	
	/**
	 * Define el proximo movimiento por ejecutar
	 * @param {Nodo} node - Nodo actualmente visitado en la elaboracion del laberinto
	 * @param {Array} pila - Registro de movimiento en la elaboracion del laberinto
	 * @param {Nodo} nodeF - Posible nodo final
	 * @param {number} numM - Distancia del nodo inicial al nodoF
	 * @return {Nodo} Nodo inicial del laberinto
	 */
    function findPath(node, pila, nodeF, numM) {
        node.visitado = false;
        let opc = node.where();
        return (opc.length == 0) ? deadEnd(node, pila, nodeF, numM) : alleyClear(opc, node, pila, nodeF, numM);
    }
	
    return new Matriz(
        tabla.dimension, //Dimensión de la matriz que contiene al laberinto.
        findPath(tabla.control, [], null, 0), //Nodo por el cual comienza el laberinto.
        solucion //Camino que lleva directamente al final del laberinto.
    );
}
