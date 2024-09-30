// listas.js
document.addEventListener('DOMContentLoaded', () => {
    const generoNombre = document.getElementById('genero-nombre');
    const listaLibros = document.getElementById('lista-libros');
    const libroForm = document.getElementById('libro-form');
    const tituloInput = document.getElementById('titulo');
    const autorInput = document.getElementById('autor');
    const resumenInput = document.getElementById('resumen');
    const imagenDispositivoInput = document.getElementById('imagen-dispositivo');
    const imagenDriveButton = document.getElementById('imagen-drive');
    const imagenUrlInput = document.getElementById('imagen-url');

    function handleImagenSeleccionada(imagenUrl) {
        if (imagenUrl) {
            agregarLibro(tituloInput.value.trim(), autorInput.value.trim(), resumenInput.value.trim(), imagenUrl);
            libroForm.reset();
        }
    }

    let generoSeleccionado = localStorage.getItem('generoSeleccionado') || 'Desconocido';
    generoNombre.textContent = generoSeleccionado;

    let libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];

    function renderizarLibros() {
        listaLibros.innerHTML = '';
        if (libros.length === 0) {
            listaLibros.innerHTML = '<li>No hay libros en este género todavía.</li>';
        } else {
            libros.forEach((libro, index) => {
                const li = document.createElement('li');
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
                listaLibros.appendChild(li);
            });
        }
    }

    function agregarLibro(titulo, autor, resumen, imagen) {
        const nuevoLibro = { titulo, autor, resumen, imagen, tachado: false };
        libros.push(nuevoLibro);
        localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
        renderizarLibros();
    }

    window.eliminarLibro = function(index) {
        libros.splice(index, 1);
        localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
        renderizarLibros();
    }

    window.tacharLibro = function(index) {
        libros[index].tachado = !libros[index].tachado;
        localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
        renderizarLibros();
    }

    window.editarLibro = function(index) {
        const libro = libros[index];
        const nuevoTitulo = prompt('Editar título:', libro.titulo);
        const nuevoAutor = prompt('Editar autor:', libro.autor);
        const nuevoResumen = prompt('Editar resumen:', libro.resumen);
        
        if (nuevoTitulo !== null && nuevoAutor !== null && nuevoResumen !== null) {
            libro.titulo = nuevoTitulo.trim();
            libro.autor = nuevoAutor.trim();
            libro.resumen = nuevoResumen.trim();
            localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
            renderizarLibros();
        }
    }

    window.cambiarImagen = function(index) {
        const libro = libros[index];
        const nuevaImagen = prompt('Ingrese la URL de la nueva imagen:', libro.imagen);
        if (nuevaImagen !== null) {
            libro.imagen = nuevaImagen.trim();
            localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
            renderizarLibros();
        }
    }

    function handleImagenSeleccionada(imagenUrl) {
        if (imagenUrl) {
            agregarLibro(tituloInput.value.trim(), autorInput.value.trim(), resumenInput.value.trim(), imagenUrl);
            libroForm.reset();
        }
    }

    libroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = tituloInput.value.trim();
        const autor = autorInput.value.trim();
        const resumen = resumenInput.value.trim();
        const fileDisp = imagenDispositivoInput.files[0];
        const urlImagen = imagenUrlInput.value.trim();

        if (titulo && autor && resumen) {
            if (fileDisp) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    handleImagenSeleccionada(e.target.result);
                };
                reader.readAsDataURL(fileDisp);
            } else if (urlImagen) {
                handleImagenSeleccionada(urlImagen);
            } else {
                agregarLibro(titulo, autor, resumen, '');
                libroForm.reset();
            }
        }
    });

    generoNombre.addEventListener('click', () => {
        const nuevoGenero = prompt('Ingrese el nuevo género:', generoSeleccionado);
        if (nuevoGenero && nuevoGenero.trim() !== '') {
            generoSeleccionado = nuevoGenero.trim();
            localStorage.setItem('generoSeleccionado', generoSeleccionado);
            generoNombre.textContent = generoSeleccionado;
            libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];
            renderizarLibros();
        }
    });
    
/* // Google Drive Picker API
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

    imagenDriveButton.addEventListener('click', loadGoogleDriveAPI); */

    renderizarLibros();
});