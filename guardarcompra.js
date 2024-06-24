document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el botón de Pagar
    var btnPagar = document.querySelector('.btn-pagar');

    // Agregar un listener para el evento click
    btnPagar.addEventListener('click', function() {
        // Aquí deberías obtener los detalles de los productos comprados y su precio
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
                throw new Error('Error al guardar la compra');
            }
            return response.json();
        })
        .then(function(data) {
            // Manejar la respuesta del servidor si es necesario
            console.log('Compra guardada correctamente:', data);
            // Aquí podrías redirigir a una página de confirmación o realizar otras acciones
        })
        .catch(function(error) {
            console.error('Error en la petición fetch:', error);
        });
    });

    // Función para obtener los productos del carrito
    function obtenerProductosDelCarrito() {
        var productos = [];
        var itemsCarrito = document.querySelectorAll('.carrito-item');

        itemsCarrito.forEach(function(item) {
            var titulo = item.querySelector('.carrito-item-titulo').innerText;
            var precioTexto = item.querySelector('.carrito-item-precio').innerText;
            var precio = parseFloat(precioTexto.replace('$', '').replace(',', ''));
            productos.push({ titulo: titulo, precio: precio });
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
            total += precio;
        });

        return total;
    }
});
