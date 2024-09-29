document.addEventListener('DOMContentLoaded', () => {
  const generoNombre = document.getElementById('genero-nombre');
  const listaLibros = document.getElementById('lista-libros');
  const libroForm = document.getElementById('libro-form');
  const tituloInput = document.getElementById('titulo');
  const autorInput = document.getElementById('autor');
  const resumenInput = document.getElementById('resumen');

  // Recuperar el género seleccionado
  const generoSeleccionado = localStorage.getItem('generoSeleccionado') || 'Desconocido';
  generoNombre.textContent = generoSeleccionado;

  // Cargar libros del localStorage
  let libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];

  // Función para renderizar la lista de libros
  function renderizarLibros() {
      listaLibros.innerHTML = '';
      if (libros.length === 0) {
          listaLibros.innerHTML = '<li>No hay libros en este género todavía.</li>';
      } else {
          libros.forEach((libro, index) => {
              const li = document.createElement('li');
              li.innerHTML = `
                  <div class="libro-info ${libro.tachado ? 'tachado' : ''}">
                      <h3>${libro.titulo}</h3>
                      <p><strong>Autor:</strong> ${libro.autor}</p>
                      <p><strong>Resumen:</strong> ${libro.resumen}</p>
                  </div>
                  <div class="libro-acciones">
                      <button onclick="editarLibro(${index})"><i class="fas fa-edit"></i></button>
                      <button onclick="tacharLibro(${index})"><i class="fas fa-check"></i></button>
                      <button onclick="eliminarLibro(${index})"><i class="fas fa-trash"></i></button>
                  </div>
              `;
              listaLibros.appendChild(li);
          });
      }
  }

  // Función para agregar un nuevo libro
  function agregarLibro(titulo, autor, resumen) {
      libros.push({ titulo, autor, resumen, tachado: false });
      localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
      renderizarLibros();
  }

  // Función para eliminar un libro
  window.eliminarLibro = function(index) {
      libros.splice(index, 1);
      localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
      renderizarLibros();
  }

  // Función para tachar un libro
  window.tacharLibro = function(index) {
      libros[index].tachado = !libros[index].tachado;
      localStorage.setItem(`libros_${generoSeleccionado}`, JSON.stringify(libros));
      renderizarLibros();
  }

  // Función para editar un libro
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

  // Event listener para el formulario de agregar libro
  libroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titulo = tituloInput.value.trim();
      const autor = autorInput.value.trim();
      const resumen = resumenInput.value.trim();
      if (titulo && autor && resumen) {
          agregarLibro(titulo, autor, resumen);
          tituloInput.value = '';
          autorInput.value = '';
          resumenInput.value = '';
      }
  });

  // Renderizar libros al cargar la página
  renderizarLibros();
});