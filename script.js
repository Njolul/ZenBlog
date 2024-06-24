var url = 'perfil.php'; 


fetch(url)
    .then(response => response.json())
    .then(data => {
        
        document.getElementById("nombreUsuario").textContent = data.nombreUsuario;
        document.getElementById("correoUsuario").textContent = data.correoUsuario;
    })
    .catch(error => console.error('Error al obtener los datos del usuario:', error))