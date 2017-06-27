/**
 * @fileOverview Celda en la matriz o en el laberinto
 * @author Andrés Hernández Bravo <andreshdezb@hotmail.com>
 * @author Jose Joaquín Rojas Cortés <josejrojasc@hotmail.es>
 * @author Alejandro Vega Lacayo <vega_alejandro8@hotmail.com>
 * @author Javier Zamora Calvo <jazccr@hotmail.com>
 */

/** Objeto Nodo */
class Nodo {
	
	/**
	 * Constructor de Nodo
	 * @param {number} t - Valor de tamaño
	 * @param {number} x - Valor del eje X
	 * @param {number} t - Valor del eje Y
	 */
    constructor(t = 0, x = 0, y = 0) {
        this.visitado = true;
        this.nodoFinal = false;
        this.tamanyo = t;
        this.ejeX = x;
        this.ejeY = y;
        this.conexiones = [];
        this.norte = null;
        this.este = null;
        this.sur = null;
        this.oeste = null;
        this.switchN = new mySwitch([
            null,
            () => this.norte,
            () => this.este,
            () => this.sur,
            () => this.oeste
        ]);
    }
	
	/**
	 * Indica para donde puede desplazarse el jugador en el laberinto
	 * @return {Array} Las coordenadas de las posiciones que puede acceder
	 */
    where() {
        let opc1 = [],
            opc2, opc3, opc4, opc5;
        (this.norte) ? (this.norte.visitado) ? opc2 = myPush(opc1, 1): opc2 = opc1: opc2 = opc1;
        (this.este) ? (this.este.visitado) ? opc3 = myPush(opc2, 2): opc3 = opc2: opc3 = opc2;
        (this.sur) ? (this.sur.visitado) ? opc4 = myPush(opc3, 3): opc4 = opc3: opc4 = opc3;
        (this.oeste) ? (this.oeste.visitado) ? opc5 = myPush(opc4, 4): opc5 = opc4: opc5 = opc4;
        return opc5;
    }
	
	/**
	 * Desplaza al nodo indicado según el número
	 * @param {number} n - Coordenada correspondiente
	 * @return {Nodo} El nodo a donde se requirió desplazarse
	 */
    go(n) {
        return this.switchN.getFunction(n)();
    }
	
	/**
	 * Indica al nodo con cual esta conectado al nivel del laberinto
	 * @param {number} num - Coordenada de donde viene
	 */
    connect(num) {
        this.conexiones.push(num);
    }
}