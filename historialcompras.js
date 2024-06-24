document.addEventListener('DOMContentLoaded', function() {
    // Cargar historial de compras al cargar la página
    cargarHistorialCompras();
});

function cargarHistorialCompras() {
    fetch('perfil.php')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al obtener el perfil del usuario');
            }
            return response.json();
        })
        .then(function(data) {
            // Verificar que data.historialCompras exista y sea un array
            if (Array.isArray(data.historialCompras)) {
                mostrarHistorialCompras(data.historialCompras);
            } else {
                throw new Error('El historial de compras no es un array válido');
            }
        })
        .catch(function(error) {
            console.error('Error en la petición fetch:', error);
            alert('Hubo un error al obtener los datos del perfil');
        });
}

function mostrarHistorialCompras(historialCompras) {
    var historialContainer = document.getElementById('listaCompras'); // Cambia 'historialCompras' por 'listaCompras' si corresponde

    if (!historialContainer) {
        console.error('No se encontró el contenedor para el historial de compras');
        return;
    }

    historialContainer.innerHTML = '';

    historialCompras.forEach(function(compra) {
        var productosHTML = '';
        compra.productos.forEach(function(producto) {
            productosHTML += `<li>${producto.titulo} - Cantidad: ${producto.cantidad}, Precio: $${producto.precio}</li>`;
        });

        var compraHTML = `
            <div class="historial-compra">
                <p>Fecha: ${compra.fecha}</p>
                <ul>${productosHTML}</ul>
                <p>Total: $${compra.precio}</p>
            </div>
        `;

        historialContainer.innerHTML += compraHTML;
    });
}
