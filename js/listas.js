// Espera a que todo el contenido de la página se cargue antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', () => {

    // Obtiene las referencias a varios elementos del DOM usando sus IDs.
    const generoNombre = document.getElementById('genero-nombre'); // Elemento que muestra el nombre del género seleccionado.
    const listaLibros = document.getElementById('lista-libros'); // Contenedor donde se mostrarán los libros.
    const libroForm = document.getElementById('libro-form'); // Formulario para añadir un nuevo libro.
    const tituloInput = document.getElementById('titulo'); // Campo de entrada para el título del libro.
    const autorInput = document.getElementById('autor'); // Campo de entrada para el autor del libro.
    const resumenInput = document.getElementById('resumen'); // Campo de entrada para el resumen del libro.
    const imagenDispositivoInput = document.getElementById('imagen-dispositivo'); // Input para subir una imagen desde el dispositivo.
    const imagenDriveButton = document.getElementById('imagen-drive'); // Botón para seleccionar una imagen desde Google Drive.
    const imagenUrlInput = document.getElementById('imagen-url'); // Campo de entrada para ingresar una URL de imagen.

    // Función que maneja la imagen seleccionada y agrega el libro a la lista.
    function handleImagenSeleccionada(imagenUrl) {
        if (imagenUrl) {
            agregarLibro(tituloInput.value.trim(), autorInput.value.trim(), resumenInput.value.trim(), imagenUrl);
            libroForm.reset(); // Resetea el formulario después de agregar el libro.
        }
    }

    // Recupera el género seleccionado desde el almacenamiento local, o usa 'Desconocido' si no hay ninguno.
    let generoSeleccionado = localStorage.getItem('generoSeleccionado') || 'Desconocido';
    generoNombre.textContent = generoSeleccionado; // Muestra el género seleccionado en la página.

    // Recupera la lista de libros asociados con el género seleccionado desde el almacenamiento local.
    let libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];

    // Función que renderiza los libros en la lista, mostrando la información de cada uno.
    function renderizarLibros() {
        listaLibros.innerHTML = ''; // Limpia la lista de libros antes de volver a generarla.
        if (libros.length === 0) {
            listaLibros.innerHTML = '<li>No hay libros en este género todavía.</li>'; // Muestra un mensaje si no hay libros.
        } else {
            libros.forEach((libro, index) => { // Itera sobre la lista de libros.
                const li = document.createElement('li'); // Crea un elemento <li> para cada libro.
                li.innerHTML = `
                    <div class="libro-info ${libro.tachado ? 'tachado' : ''}">
                        <img src="${libro.imagen || '/placeholder.svg'}" alt="${libro.titulo}" style="width: 50px; height: 70px; object-fit: cover;">
                        <h3>${libro.titulo}</h3>
                        <p><strong>Autor:</strong> ${libro.autor}</p>
                        <p><strong>Resumen:</strong> ${libro.resumen}</p>
                    </div>
                    <div class="libro-acciones">
                        <button onclick="editarLibro(${index})"><i class="fas fa-edit"></i></button>
                        <button onclick="cambiarImagen(${index})"><i class="fas fa-image"></i></button>
                        <button onclick="tacharLibro(${index})"><i class="fas fa-check"></i></button>
                        <button onclick="eliminarLibro(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                listaLibros.appendChild(li); // Añade el <li> a la lista de libros en el DOM.
            });
        }
    }

    // Función que agrega un nuevo libro a la lista y lo guarda en el almacenamiento local.
    function agregarLibro(titulo, autor, resumen, imagen) {
        const nuevoLibro = { titulo, autor, resumen, imagen, tachado: false }; // Crea un nuevo objeto libro.
        libros.push(nuevoLibro); // Añade el nuevo libro a la lista.
        localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros)); // Guarda la lista de libros en el almacenamiento local.
        renderizarLibros(); // Vuelve a renderizar la lista de libros.
    }

    // Función que elimina un libro de la lista.
    window.eliminarLibro = function(index) {
        libros.splice(index, 1); // Elimina el libro en la posición especificada.
        localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros)); // Actualiza el almacenamiento local.
        renderizarLibros(); // Vuelve a renderizar la lista.
    }

    // Función que marca o desmarca un libro como tachado.
    window.tacharLibro = function(index) {
        libros[index].tachado = !libros[index].tachado; // Cambia el estado tachado del libro.
        localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros)); // Actualiza el almacenamiento local.
        renderizarLibros(); // Vuelve a renderizar la lista.
    }

    // Función que permite editar los detalles de un libro.
    window.editarLibro = function(index) {
        const libro = libros[index];
        const nuevoTitulo = prompt('Editar título:', libro.titulo); // Pide un nuevo título.
        const nuevoAutor = prompt('Editar autor:', libro.autor); // Pide un nuevo autor.
        const nuevoResumen = prompt('Editar resumen:', libro.resumen); // Pide un nuevo resumen.
        
        if (nuevoTitulo !== null && nuevoAutor !== null && nuevoResumen !== null) {
            libro.titulo = nuevoTitulo.trim(); // Actualiza el título.
            libro.autor = nuevoAutor.trim(); // Actualiza el autor.
            libro.resumen = nuevoResumen.trim(); // Actualiza el resumen.
            localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros)); // Guarda los cambios en el almacenamiento local.
            renderizarLibros(); // Vuelve a renderizar la lista.
        }
    }

    // Función que permite cambiar la imagen de un libro.
    window.cambiarImagen = function(index) {
        const libro = libros[index];
        const nuevaImagen = prompt('Ingrese la URL de la nueva imagen:', libro.imagen); // Pide una nueva URL de imagen.
        if (nuevaImagen !== null) {
            libro.imagen = nuevaImagen.trim(); // Actualiza la imagen del libro.
            localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros)); // Guarda los cambios en el almacenamiento local.
            renderizarLibros(); // Vuelve a renderizar la lista.
        }
    }

    // Manejador para el envío del formulario de libros.
    libroForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previene el envío del formulario por defecto.
        const titulo = tituloInput.value.trim(); // Obtiene el valor del campo de título.
        const autor = autorInput.value.trim(); // Obtiene el valor del campo de autor.
        const resumen = resumenInput.value.trim(); // Obtiene el valor del campo de resumen.
        const fileDisp = imagenDispositivoInput.files[0]; // Obtiene el archivo de imagen subido desde el dispositivo.
        const urlImagen = imagenUrlInput.value.trim(); // Obtiene la URL de la imagen.

        if (titulo && autor && resumen) { // Si los campos de título, autor y resumen están llenos...
            if (fileDisp) {
                const reader = new FileReader(); // Crea un nuevo lector de archivos.
                reader.onload = function(e) {
                    handleImagenSeleccionada(e.target.result); // Manejador para la imagen seleccionada.
                };
                reader.readAsDataURL(fileDisp); // Lee la imagen como una URL de datos.
            } else if (urlImagen) {
                handleImagenSeleccionada(urlImagen); // Usa la URL proporcionada.
            } else {
                agregarLibro(titulo, autor, resumen, ''); // Agrega el libro sin imagen si no se proporcionó una.
                libroForm.reset(); // Resetea el formulario.
            }
        }
    });

    // Permite cambiar el género actual y actualizar la lista de libros.
    generoNombre.addEventListener('click', () => {
        const nuevoGenero = prompt('Ingrese el nuevo género:', generoSeleccionado); // Pide un nuevo nombre de género.
        if (nuevoGenero && nuevoGenero.trim() !== '') {
            generoSeleccionado = nuevoGenero.trim(); // Actualiza el género seleccionado.
            localStorage.setItem('generoSeleccionado', generoSeleccionado); // Guarda el nuevo género en el almacenamiento local.
            generoNombre.textContent = generoSeleccionado; // Actualiza el nombre del género en la página.
            libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || []; // Carga los libros del nuevo género.
            renderizarLibros(); // Vuelve a renderizar la lista de libros.
        }
    });

    // (Comentario) Este bloque de código está preparado para usar la API de Google Drive Picker,
    // para seleccionar imágenes directamente desde Google Drive, pero está comentado.

    /* 
    // Google Drive Picker API
    function loadGoogleDriveAPI() {
        gapi.load('auth', {'callback': onAuthApiLoad});
        gapi.load('picker', {'callback': onPickerApiLoad});
    }

    function onAuthApiLoad() {
        window.gapi.auth.authorize(
            {
                'client_id': 'YOUR_GOOGLE_DRIVE_CLIENT_ID',
                'scope': ['https://www.googleapis.com/auth/drive.readonly'],
                'immediate': false
            },
            handleAuthResult
        );
    }

    function onPickerApiLoad() {
        pickerApiLoaded = true;
        createPicker();
    }

    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            oauthToken = authResult.access_token;
            createPicker();
        }
    }

    function createPicker() {
        if (pickerApiLoaded && oauthToken) {
            var picker = new google.picker.PickerBuilder()
                .addView(google.picker.ViewId.DOCS_IMAGES)
                .setOAuthToken(oauthToken)
                .setDeveloperKey('YOUR_GOOGLE_DRIVE_API_KEY')
                .setCallback(pickerCallback)
                .build();
            picker.setVisible(true);
        }
    }

    function pickerCallback(data) {
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            var fileId = data.docs[0].id;
            handleImagenSeleccionada('https://drive.google.com/uc?id=' + fileId);
        }
    }

    imagenDriveButton.addEventListener('click', loadGoogleDriveAPI);
    */

    // Llama a la función para renderizar los libros la primera vez que se carga la página.
    renderizarLibros();
});
