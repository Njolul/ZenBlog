document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contact-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe automáticamente
      
        // Obtener valores de los campos del formulario
        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var subject = document.getElementById('subject').value.trim();
        var message = document.getElementById('message').value.trim();

        // Validar que los campos no estén vacíos
        if (name === '' || email === '' || subject === '' || message === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Objeto con los datos del formulario a enviar al servidor
        var formData = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };

        // Hacer la solicitud al servidor usando fetch
        fetch('php_lul/guardarmensajes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
       .then(response => response.json()) // Get the response as JSON
       .then(data => {
            // Manejar la respuesta del servidor
            alert(data.message); // Muestra el mensaje de respuesta del servidor
            if (data.success) {
                form.reset(); // Limpiar el formulario si el envío fue exitoso
            }
        })
       .catch(error => {
            console.error('Error en la petición fetch:', error);
            alert('Hubo un error al enviar el formulario.');
        });
    });
});