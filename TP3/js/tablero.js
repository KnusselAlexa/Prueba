import { Ficha } from "./ficha.js";

class Tablero {

    /** @type {CanvasRenderingContext2D} */
    #ctx
    #casillaCantidad;
    #casillaAnchoYAlto;
    #canvasWidth;
    #canvasHeight;
    #posicionXenCanvas;
    #posicionYenCanvas;
    #posicionesColumnas;
    #tableroLogica;
    #altoTablero;
    #fichas;

    constructor(ctx, casillaCantidad, casillaAnchoYAlto, canvasWidth, canvasHeight) {
        this.#ctx = ctx;
        this.#casillaCantidad = casillaCantidad;
        this.#casillaAnchoYAlto = casillaAnchoYAlto;
        this.#canvasWidth = canvasWidth;
        this.#canvasHeight = canvasHeight;
        this.#posicionesColumnas = [];
        this.#tableroLogica = [];
        this.crearTableroLogica();
        this.#altoTablero = this.#casillaAnchoYAlto * this.#casillaCantidad - 1;
        this.#fichas = [];
    }

    get ctx() {
        return this.#ctx;
    }

    get casillaCantidad() {
        return this.#casillaCantidad;
    }

    get casillaAnchoYAlto() {
        return this.#casillaAnchoYAlto;
    }

    get canvasWidth() {
        return this.#canvasWidth;
    }

    get canvasHeight() {
        return this.#canvasHeight;
    }

    get posicionXenCanvas() {
        return this.#posicionXenCanvas;
    }

    get posicionYenCanvas() {
        return this.#posicionYenCanvas;
    }

    get posicionesColumnas() {
        return this.#posicionesColumnas;
    }

    get tableroLogica() {
        return this.#tableroLogica;
    }

    get altoTablero() {
        return this.#altoTablero;
    }

    dibujarTablero() {

        let cantidadCasillasX = this.casillaCantidad;
        let cantidadCasillasY = cantidadCasillasX - 1;

        let tamanioTableroX = cantidadCasillasX * this.casillaAnchoYAlto;
        let tamanioTableroY = cantidadCasillasY * this.casillaAnchoYAlto;

        if (tamanioTableroX < (this.canvasWidth - 100)) {

            this.#posicionXenCanvas = (this.canvasWidth - tamanioTableroX) / 2;
            this.#posicionYenCanvas = (this.canvasHeight - tamanioTableroY) / 2;

            let posicionX = this.#posicionXenCanvas;
            let posicionY = this.#posicionYenCanvas;

            for (let x = 0; x < cantidadCasillasX; x++) {

                for (let y = 0; y < cantidadCasillasY; y++) {
                    this.dibujarRectangulo('#E0E0E0', posicionX, posicionY);
                    posicionY += this.casillaAnchoYAlto;
                }
                posicionY = this.#posicionYenCanvas;
                posicionX += this.casillaAnchoYAlto;
            }
        }
        this.completarPosicionesColumnas();
    }

    dibujarRectangulo(fill, x, y) {
        this.ctx.fillStyle = fill;
        this.ctx.fillRect(x, y, this.casillaAnchoYAlto, this.casillaAnchoYAlto);
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, this.casillaAnchoYAlto, this.casillaAnchoYAlto);
    }

    //Llena el arreglo con las coordenadas x para detenerminar las x de cada columna
    completarPosicionesColumnas() {
        let firstposicionX = this.posicionXenCanvas;
        for (let i = 0; i <= this.casillaCantidad; i++) {
            this.posicionesColumnas[i] = firstposicionX;
            firstposicionX += this.casillaAnchoYAlto;
        }
    }

    //Devuelve la coordenada x correspondiente a una columna
    obtenerCoordX(fichaClickeada) {
        for (let i = 0; i < this.posicionesColumnas.length - 1; i++) {
            if (fichaClickeada.x >= this.posicionesColumnas[i] && fichaClickeada.x < this.posicionesColumnas[i + 1]) {
                return (this.posicionesColumnas[i + 1] - this.posicionesColumnas[i]) / 2 + this.posicionXenCanvas + i * this.casillaAnchoYAlto;
            }
        }
        return null;
    }

    //Devuelve la coordenada y correspondiente a una fila
    obtenerCoordY(x, fichaClickeada) {
        let columna = this.obtenerColumna(x);
        let cantidadFichasEnColumna = 0;
        for (let y = this.#casillaCantidad - 2; y >= 0; y--) {
            if (this.#tableroLogica[y][columna] == null) {
                this.#tableroLogica[y][columna] = fichaClickeada;
                break;
            } else {
                cantidadFichasEnColumna++;
            }
        }
        return this.#posicionYenCanvas + ((this.#casillaCantidad - 1) * this.#casillaAnchoYAlto) - this.#casillaAnchoYAlto / 2 - cantidadFichasEnColumna * this.#casillaAnchoYAlto;
    }

    //Devuelve la columna correspondiente a una coordenada x
    obtenerColumna(x) {
        let i = 0;
        let retornar = i;
        while (i < this.#posicionesColumnas.length - 1) {
            if (x > this.#posicionesColumnas[i] && x < this.#posicionesColumnas[i + 1]) {
                retornar = i;
            }
            i++;
        }
        return retornar;
    }

    //Devuelve la fila en la que se encuentra la ficha en una determinada columna
    obtenerFila(ficha, columna) {
        let fila = 0;
        while (0 < this.#tableroLogica.length) {
            if (ficha == this.#tableroLogica[fila][columna]) {
                return fila;
            }
            fila++;
        }
    }

    //Determina si la ficha es ganadora
    esFichaGanadora(ficha) {
        let columna = this.obtenerColumna(ficha.x);
        let fila = this.obtenerFila(ficha, columna);
        if (this.analizarHorizontal(ficha, fila, columna))
            return this.#fichas;
        else if (this.analizarVertical(ficha, fila, columna))
            return this.#fichas
        else if (this.analizarDiagonalDescendente(ficha, fila, columna))
            return this.#fichas
        else if (this.analizarDiagonalAscendente(ficha, fila, columna))
            return this.#fichas
        else return null
    }

    analizarHorizontal(ficha, fila, columna) {
        let indice = columna;
        let cantidad = 1;
        this.#fichas.push(ficha)
        while (indice < this.#tableroLogica[fila].length - 1) {
            if (this.#tableroLogica[fila][indice + 1] instanceof Ficha && ficha.jugador == this.#tableroLogica[fila][indice + 1].jugador) {
                cantidad++;
                this.#fichas.push(this.#tableroLogica[fila][indice + 1])
                if (cantidad == this.#casillaCantidad - 3) {
                    alert("Ganador: " + ficha.jugador.nombre);
                    return true;
                }
            } else {
                indice = this.#tableroLogica[fila].length - 1;
            }
            indice++;
        }
        indice = columna;
        while (indice > 0) {
            if (this.#tableroLogica[fila][indice - 1] instanceof Ficha && ficha.jugador == this.#tableroLogica[fila][indice - 1].jugador) {
                cantidad++;
                this.#fichas.push(this.#tableroLogica[fila][indice - 1])
                if (cantidad == this.#casillaCantidad - 3) {
                    alert("Ganador: " + ficha.jugador.nombre);
                    return true;
                }
            } else {
                indice = 0;
            }
            indice--;
        }
        this.#fichas = [];
    }

    analizarVertical(ficha, fila, columna) {
        let indice = fila;
        let cantidad = 1;
        this.#fichas.push(ficha);
        while (indice < this.#tableroLogica.length - 1) {
            if (this.#tableroLogica[indice + 1][columna] instanceof Ficha && ficha.jugador == this.#tableroLogica[indice + 1][columna].jugador) {
                cantidad++;
                this.#fichas.push(this.#tableroLogica[indice + 1][columna]);
                if (cantidad == this.#casillaCantidad - 3) {
                    alert("Ganador: " + ficha.jugador.nombre);
                    return true;
                }
            } else {
                indice = this.#tableroLogica.length - 1;
            }
            indice++;
        }
        this.#fichas = [];
    }

    analizarDiagonalDescendente(ficha, fila, columna) {
        let indiceFila = fila;
        let indiceColumna = columna;
        let cantidad = 1;
        this.#fichas.push(ficha);
        while (indiceFila < this.#tableroLogica.length - 1 && indiceColumna < this.#tableroLogica[indiceFila].length - 1) {
            if (this.#tableroLogica[indiceFila + 1][indiceColumna + 1] instanceof Ficha && ficha.jugador == this.#tableroLogica[indiceFila + 1][indiceColumna + 1].jugador) {
                cantidad++;
                this.#fichas.push(this.#tableroLogica[indiceFila + 1][indiceColumna + 1]);
                if (cantidad == this.#casillaCantidad - 3) {
                    alert("Ganador: " + ficha.jugador.nombre);
                    return true;
                }
            } else {
                indiceFila = this.#tableroLogica.length - 1;
            }
            indiceFila++;
            indiceColumna++;
        }
        indiceFila = fila;
        indiceColumna = columna;
        while (indiceFila > 0 && indiceColumna > 0) {
            if (this.#tableroLogica[indiceFila - 1][indiceColumna - 1] instanceof Ficha && ficha.jugador == this.#tableroLogica[indiceFila - 1][indiceColumna - 1].jugador) {
                cantidad++;
                this.#fichas.push(this.#tableroLogica[indiceFila - 1][indiceColumna - 1]);
                if (cantidad == this.#casillaCantidad - 3) {
                    alert("Ganador: " + ficha.jugador.nombre);
                    return true;
                }
            } else {
                indiceFila = 0;
            }
            indiceFila--;
            indiceColumna--;
        }
        this.#fichas = [];
    }

    analizarDiagonalAscendente(ficha, fila, columna) {
        let indiceFila = fila;
        let indiceColumna = columna;
        let cantidad = 1;
        this.#fichas.push(ficha);
        while (indiceFila < this.#tableroLogica.length - 1 && indiceColumna > 0) {
            if (this.#tableroLogica[indiceFila + 1][indiceColumna - 1] instanceof Ficha && ficha.jugador == this.#tableroLogica[indiceFila + 1][indiceColumna - 1].jugador) {
                cantidad++;
                this.#fichas.push(this.#tableroLogica[indiceFila + 1][indiceColumna - 1]);
                if (cantidad == this.#casillaCantidad - 3) {
                    alert("Ganador: " + ficha.jugador.nombre);
                    return true;
                }
            } else {
                indiceFila = this.#tableroLogica.length - 1;
            }
            indiceFila++;
            indiceColumna--;
        }
        indiceFila = fila;
        indiceColumna = columna;
        while (indiceFila > 0 && indiceColumna < this.#tableroLogica[indiceFila].length - 1) {
            if (this.#tableroLogica[indiceFila - 1][indiceColumna + 1] instanceof Ficha && ficha.jugador == this.#tableroLogica[indiceFila - 1][indiceColumna + 1].jugador) {
                cantidad++;
                this.#fichas.push(this.#tableroLogica[indiceFila - 1][indiceColumna + 1]);
                if (cantidad == this.#casillaCantidad - 3) {
                    alert("Ganador: " + ficha.jugador.nombre);
                    return true;
                }
            } else {
                indiceFila = 0;
            }
            indiceFila--;
            indiceColumna++;
        }
        this.#fichas = [];
    }

    crearTableroLogica() {
        for (let y = 0; y < this.#casillaCantidad - 1; y++) {
            this.#tableroLogica[y] = [];
            for (let x = 0; x < this.#casillaCantidad; x++) {
                this.#tableroLogica[y][x] = null;
            }
        }
    }
}

export { Tablero };