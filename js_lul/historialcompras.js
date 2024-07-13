document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento de la flecha para el toggle
    var toggleHistorial = document.getElementById('toggleHistorial');

    // Agregar un event listener para alternar la clase
    toggleHistorial.addEventListener('click', function() {
        var listaCompras = document.getElementById('listaCompras');

        // Alternar la clase 'collapsed' en el elemento listaCompras
        listaCompras.classList.toggle('collapsed');
    });

    // Cargar historial de compras al cargar la página
    cargarHistorialCompras();
});

function cargarHistorialCompras() {
    fetch('php_lul/perfil.php')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al obtener el perfil del usuario');
            }
            return response.json();
        })
        .then(function(data) {
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
    var historialContainer = document.getElementById('listaCompras');

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
