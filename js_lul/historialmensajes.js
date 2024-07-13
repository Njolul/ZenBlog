document.addEventListener('DOMContentLoaded', function() {
    // Obtener el elemento del botón para el toggle de mensajes
    var toggleMensajes = document.getElementById('toggleMensajes');

    // Agregar un event listener para alternar la clase
    toggleMensajes.addEventListener('click', function() {
        var listaMensajes = document.getElementById('listaMensajes');

        // Alternar la clase 'collapsed' en el elemento listaMensajes
        listaMensajes.classList.toggle('collapsed');
    });

    // Cargar mensajes al cargar la página
    cargarMensajes();
});

function cargarMensajes() {
    fetch('php_lul/perfil.php')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al obtener el perfil del usuario');
            }
            return response.json();
        })
        .then(function(data) {
            if (Array.isArray(data.contactMessages)) {
                mostrarMensajes(data.contactMessages);
            } else {
                throw new Error('La lista de mensajes no es un array válido');
            }
        })
        .catch(function(error) {
            console.error('Error en la petición fetch:', error);
            alert('Hubo un error al obtener los datos del perfil');
        });
}

function mostrarMensajes(mensajes) {
    var mensajesContainer = document.getElementById('listaMensajes');

    if (!mensajesContainer) {
        console.error('No se encontró el contenedor para los mensajes');
        return;
    }

    mensajesContainer.innerHTML = '';

    mensajes.forEach(function(mensaje) {
        var mensajeHTML = `
            <div class="mensaje">
                <p><strong>De:</strong> ${mensaje.name} (${mensaje.email})</p>
                <p><strong>Asunto:</strong> ${mensaje.subject}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje.message}</p>
            </div>
        `;

        mensajesContainer.innerHTML += mensajeHTML;
    });
}
