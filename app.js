// Variable que mantiene el estado visible del carrito
var carritoVisible = false;

// Esperamos a que todos los elementos de la página carguen para ejecutar el script
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    // Agregremos funcionalidad a los botones eliminar del carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    // Agrego funcionalidad al boton sumar cantidad
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    // Agrego funcionalidad al buton restar cantidad
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    // Agregamos funcionalidad al boton "Agregar al carrito"
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    // Agregamos funcionalidad al botón "Pagar"
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}

// Función para hacer visible el carrito
function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

// Función para agregar un item al carrito
function agregarItemAlCarrito(titulo, precio) {
    var item = document.createElement('div');
    item.classList.add('item');

    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    // Controlamos que el item que intenta ingresar no se encuentre en el carrito
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText == titulo) {
            alert("El item ya se encuentra en el carrito");
            return;
        }
    }

    var itemCarritoContenido = `
        <div class="carrito-item">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="bi bi-dash restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="bi bi-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;

    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    // Agregamos la funcionalidad eliminar al nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    // Agregamos la funcionalidad restar cantidad del nuevo item
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

    // Agregamos la funcionalidad sumar cantidad del nuevo item
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    // Actualizamos total
    actualizarTotalCarrito();
}

// Función para aumentar en uno la cantidad del elemento seleccionado
function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}

// Función para restar en uno la cantidad del elemento seleccionado
function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

// Función para eliminar el item seleccionado del carrito
function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

// Función para controlar si hay elementos en el carrito. Si no hay, oculta el carrito.
function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

// Función para actualizar el total del carrito
function actualizarTotalCarrito() {
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;

    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        var precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = parseInt(cantidadItem.value);
        total += precio * cantidad;
    }

    total = Math.round(total * 100) / 100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";
}

// Función para manejar el click en el botón "Pagar"
function pagarClicked() {
    // Obtener los detalles de los productos del carrito y el precio total
    var productos = obtenerProductosDelCarrito();
    var precioTotal = calcularPrecioTotal();

    // Objeto con los datos a enviar al servidor
    var datosCompra = {
        productos: productos,
        precioTotal: precioTotal
    };

    // Hacer la solicitud al servidor usando fetch
    fetch('guardarcompras.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosCompra)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Error al guardar los productos');
        }
        return response.json();
    })
    .then(function(data) {
        // Manejar la respuesta del servidor si es necesario
        console.log('Productos guardados correctamente:', data);
        // Aquí podrías redirigir a una página de confirmación o realizar otras acciones
        alert('Compra realizada con éxito');
        vaciarCarrito(); // Opcional: Vaciar el carrito después de realizar la compra
    })
    .catch(function(error) {
        console.error('Error en la petición fetch:', error);
        //alert('Hubo un error al procesar la compra');
    });
}

// Función para obtener los productos del carrito
function obtenerProductosDelCarrito() {
    var productos = [];
    var itemsCarrito = document.querySelectorAll('.carrito-item');

    itemsCarrito.forEach(function(item) {
        var titulo = item.querySelector('.carrito-item-titulo').innerText;
        var precioTexto = item.querySelector('.carrito-item-precio').innerText;
        var precio = parseFloat(precioTexto.replace('$', '').replace(',', ''));
        var cantidadItem = item.querySelector('.carrito-item-cantidad').value;
        productos.push({ titulo: titulo, precio: precio, cantidad: cantidadItem });
    });

    return productos;
}

// Función para calcular el precio total
function calcularPrecioTotal() {
    var total = 0;
    var itemsCarrito = document.querySelectorAll('.carrito-item');

    itemsCarrito.forEach(function(item) {
        var precioTexto = item.querySelector('.carrito-item-precio').innerText;
        var precio = parseFloat(precioTexto.replace('$', '').replace(',', ''));
        var cantidadItem = item.querySelector('.carrito-item-cantidad').value;
        total += precio * cantidadItem;
    });

    return total;
}

// Función para vaciar el carrito después de realizar la compra (opcional)
function vaciarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

// Función para controlar el click en el botón "Agregar al carrito"
function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.querySelector('.titulo-item').innerText;
    var precio = item.querySelector('.precio-item').innerText;

    agregarItemAlCarrito(titulo, precio);
    hacerVisibleCarrito();
}
