// Variable que mantiene el estado visible del carrito
var carritoVisible = false;

// Esperamos a que todos los elementos de la página carguen para ejecutar el script
document.addEventListener('DOMContentLoaded', function() {
    // Agregamos funcionalidad a los botones eliminar del carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        botonesEliminarItem[i].addEventListener('click', eliminarItemCarrito);
    }

    // Agrego funcionalidad al boton sumar cantidad
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        botonesSumarCantidad[i].addEventListener('click', sumarCantidad);
    }

    // Agrego funcionalidad al botón restar cantidad
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        botonesRestarCantidad[i].addEventListener('click', restarCantidad);
    }

    // Agregamos funcionalidad al botón "Agregar al carrito"
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        botonesAgregarAlCarrito[i].addEventListener('click', agregarAlCarritoClicked);
    }

    // Agregamos funcionalidad al botón "Pagar"
    var botonPagar = document.querySelector('.btn-pagar');
    if (botonPagar) {
        botonPagar.addEventListener('click', function() {
            verificarTarjeta();
        });
    } else {
        console.error('Elemento "btn-pagar" no encontrado en el DOM');
    }
});

// Función para verificar la tarjeta del usuario y proceder con la compra
function verificarTarjeta() {
    fetch('php_lul/verificar_tarjeta.php', {
      method: 'GET', // o 'POST' dependiendo de tu implementación
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Respuesta:', response);
      if (!response.ok) {
        throw new Error('Error al verificar la tarjeta');
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos:', data);
      if (data.success && data.tarjetaRegistrada) {
        console.log('Tarjeta registrada, realizando la compra');
        realizarCompra();
      } else {
        console.log('Tarjeta no registrada, redirigiendo a guardartarjeta.html');
        window.location.href = 'guardartarjeta.html'; // O cualquier URL de tu formulario
      }
    })
    .catch(error => {
      console.error('Error al verificar tarjeta:', error);
      // Manejar errores como falta de conexión o problemas del servidor
    });
  }

// Función para realizar la compra
function realizarCompra() {
    // Obtener los detalles de los productos del carrito y el precio total
    var productos = obtenerProductosDelCarrito();
    var precioTotal = calcularPrecioTotal();

    // Objeto con los datos a enviar al servidor
    var datosCompra = {
        productos: productos,
        precioTotal: precioTotal
    };

    // Hacer la solicitud al servidor usando fetch
    fetch('php_lul/guardarcompras.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosCompra)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar los productos');
        }
        return response.json();
    })
    .then(data => {
        // Manejar la respuesta del servidor si es necesario
        console.log('Productos guardados correctamente:', data);
        // Aquí podrías redirigir a una página de confirmación o realizar otras acciones
        alert('Compra realizada con éxito');
        vaciarCarrito(); // Opcional: Vaciar el carrito después de realizar la compra
    })
    .catch(error => {
        console.error('Error en la petición fetch:', error);
        
    });
}

// Función para hacer visible el carrito
function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.querySelector('.carrito');
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.querySelector('.contenedor-items');
    items.style.width = '60%';
}

// Función para agregar un item al carrito
function agregarItemAlCarrito(titulo, precio) {
    var item = document.createElement('div');
    item.classList.add('item');

    var itemsCarrito = document.querySelector('.carrito-items');

    // Controlamos que el item que intenta ingresar no se encuentre en el carrito
    var nombresItemsCarrito = itemsCarrito.querySelectorAll('.carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText === titulo) {
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
    itemsCarrito.appendChild(item);

    // Agregamos la funcionalidad eliminar al nuevo item
    item.querySelector('.btn-eliminar').addEventListener('click', eliminarItemCarrito);

    // Agregamos la funcionalidad restar cantidad del nuevo item
    item.querySelector('.restar-cantidad').addEventListener('click', restarCantidad);

    // Agregamos la funcionalidad sumar cantidad del nuevo item
    item.querySelector('.sumar-cantidad').addEventListener('click', sumarCantidad);

    // Actualizamos total
    actualizarTotalCarrito();
}

// Función para aumentar en uno la cantidad del elemento seleccionado
function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.querySelector('.carrito-item-cantidad').value);
    cantidadActual++;
    selector.querySelector('.carrito-item-cantidad').value = cantidadActual;
    actualizarTotalCarrito();
}

// Función para restar en uno la cantidad del elemento seleccionado
function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.querySelector('.carrito-item-cantidad').value);
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.querySelector('.carrito-item-cantidad').value = cantidadActual;
        actualizarTotalCarrito();
    }
}

// Función para eliminar el item seleccionado del carrito
function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.closest('.carrito-item').remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

// Función para controlar si hay elementos en el carrito. Si no hay, oculta el carrito.
function ocultarCarrito() {
    var carritoItems = document.querySelector('.carrito-items');
    if (carritoItems.children.length === 0) {
        var carrito = document.querySelector('.carrito');
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        var items = document.querySelector('.contenedor-items');
        items.style.width = '100%';
    }
}

// Función para actualizar el total del carrito
function actualizarTotalCarrito() {
    var carritoItems = document.querySelectorAll('.carrito-item');
    var total = 0;

    carritoItems.forEach(function(item) {
        var precio = parseFloat(item.querySelector('.carrito-item-precio').innerText.replace('$', '').replace(',', ''));
        var cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
        total += precio * cantidad;
    });

    total = Math.round(total * 100) / 100;

    document.querySelector('.carrito-precio-total').innerText = '$' + total.toLocaleString("es") + ",00";
}

// Función para obtener los productos del carrito
function obtenerProductosDelCarrito() {
    var productos = [];
    var itemsCarrito = document.querySelectorAll('.carrito-item');

    itemsCarrito.forEach(function(item) {
        var titulo = item.querySelector('.carrito-item-titulo').innerText;
        var precio = parseFloat(item.querySelector('.carrito-item-precio').innerText.replace('$', '').replace(',', ''));
        var cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
        productos.push({ titulo: titulo, precio: precio, cantidad: cantidad });
    });

    return productos;
}

// Función para calcular el precio total
function calcularPrecioTotal() {
    var total = 0;
    var itemsCarrito = document.querySelectorAll('.carrito-item');

    itemsCarrito.forEach(function(item) {
        var precio = parseFloat(item.querySelector('.carrito-item-precio').innerText.replace('$', '').replace(',', ''));
        var cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
        total += precio * cantidad;
    });

    return total;
}

// Función para vaciar el carrito después de realizar la compra (opcional)
function vaciarCarrito() {
    var carritoItems = document.querySelector('.carrito-items');
    while (carritoItems.firstChild) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

// Función para controlar el click en el botón "Agregar al carrito"
function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.closest('.item');
    var titulo = item.querySelector('.titulo-item').innerText;
    var precio = item.querySelector('.precio-item').innerText;

    agregarItemAlCarrito(titulo, precio);
    hacerVisibleCarrito();
}
