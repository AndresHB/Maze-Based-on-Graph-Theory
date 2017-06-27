importScripts("Algoritmo.js", "BaseDatos.js", "Nodo.js", "Matriz.js", "MySwitch.js");
self.addEventListener("message", (e) =>
    self.postMessage(
        mazeToJson(
            creaLaberinto(
                generaMatriz(e.data.D, e.data.T, e.data.E - e.data.T)
            )
        )
    )
);