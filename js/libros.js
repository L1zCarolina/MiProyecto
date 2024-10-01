// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', () => {

  // Obtiene los elementos del DOM que van a ser manipulados.
  const generoNombre = document.getElementById('genero-nombre'); // Elemento que muestra el nombre del género seleccionado.
  const librosContainer = document.getElementById('libros-container'); // Contenedor donde se van a renderizar los libros.

  // Recupera el género seleccionado del almacenamiento local o usa 'Desconocido' como valor por defecto.
  let generoSeleccionado = localStorage.getItem('generoSeleccionado') || 'Desconocido';
  generoNombre.textContent = generoSeleccionado; // Muestra el género seleccionado en la interfaz.

  // Recupera los libros asociados con el género seleccionado desde el almacenamiento local.
  let libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];

  // Función para renderizar los libros en la página.
  function renderizarLibros() {
      librosContainer.innerHTML = ''; // Limpia el contenido actual del contenedor de libros.

      // Si no hay libros en el género seleccionado, muestra un mensaje.
      if (libros.length === 0) {
          librosContainer.innerHTML = '<p>No hay libros en este género todavía.</p>';
      } else {
          // Itera sobre la lista de libros y genera las tarjetas de cada uno.
          libros.forEach((libro, index) => {
              // Crea un nuevo div para la tarjeta del libro.
              const libroElement = document.createElement('div');
              libroElement.className = 'card'; // Le añade la clase 'card'.

              // Define el contenido HTML de la tarjeta, incluyendo la imagen, el título y un resumen abreviado.
              libroElement.innerHTML = `
                  <div class="cover__card">
                      <img src="${libro.imagen || '/placeholder.svg'}" alt="${libro.titulo}">
                  </div>
                  <h2>${libro.titulo}</h2>
                  <p>${libro.resumen.substring(0, 100)}...</p>
                  <hr>
                  <div class="footer__card">
                      <h3 class="user__name">${libro.autor}</h3>
                      <i>Añadido el ${new Date().toLocaleDateString()}</i> <!-- Muestra la fecha de hoy como la fecha de adición. -->
                  </div>
              `;

              // Añade un manejador de evento para mostrar detalles del libro al hacer clic en la tarjeta.
              libroElement.addEventListener('click', () => verDetalles(index));

              // Añade la tarjeta del libro al contenedor de libros.
              librosContainer.appendChild(libroElement);
          });
      }
  }

  // Función que muestra los detalles de un libro en un modal.
  function verDetalles(index) {
      const libro = libros[index]; // Recupera el libro seleccionado basado en su índice.
      
      // Crea un div para el modal.
      const modal = document.createElement('div');
      modal.className = 'modal'; // Le añade la clase 'modal'.

      // Define el contenido HTML del modal, que incluye el título, autor, imagen y resumen completo del libro.
      modal.innerHTML = `
          <div class="modal-content">
              <span class="close">&times;</span> <!-- Botón para cerrar el modal. -->
              <h2>${libro.titulo}</h2>
              <p><strong>Autor:</strong> ${libro.autor}</p>
              <img src="${libro.imagen || '/placeholder.svg'}" alt="${libro.titulo}" style="max-width: 200px; margin: 10px 0;">
              <p>${libro.resumen}</p>
          </div>
      `;

      // Añade el modal al body del documento.
      document.body.appendChild(modal);

      // Maneja el clic en el botón de cerrar el modal.
      const closeBtn = modal.querySelector('.close');
      closeBtn.onclick = function() {
          modal.style.display = "none"; // Esconde el modal.
      }

      // Maneja el cierre del modal si se hace clic fuera de él.
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none"; // Esconde el modal si el clic fue fuera de su contenido.
          }
      }

      modal.style.display = "block"; // Muestra el modal.
  }

  // Añade un evento de clic al nombre del género para permitir cambiarlo.
  generoNombre.addEventListener('click', () => {
      // Define una lista de géneros disponibles.
      const generos = ['Romanaces', 'Fantasias', 'Reencarnaciones', 'Epocas', 'Novelas Web/Ligera', 'Mangas', 'Manhua', 'Manhwa', 'Fanfiction/Wattpad'];

      // Crea un elemento de selección (dropdown) para que el usuario elija un nuevo género.
      const selectElement = document.createElement('select');
      selectElement.className = 'genero-select'; // Le añade la clase 'genero-select'.

      // Añade opciones al dropdown basadas en la lista de géneros.
      generos.forEach(genero => {
          const option = document.createElement('option');
          option.value = genero; // Establece el valor de la opción como el género.
          option.textContent = genero; // Muestra el nombre del género.
          
          // Marca la opción correspondiente al género seleccionado como la opción por defecto.
          if (genero === generoSeleccionado) {
              option.selected = true;
          }
          selectElement.appendChild(option); // Añade la opción al dropdown.
      });

      // Limpia el contenido del nombre del género y añade el dropdown para seleccionar un nuevo género.
      generoNombre.innerHTML = '';
      generoNombre.appendChild(selectElement);

      // Añade un manejador de cambio para actualizar el género seleccionado.
      selectElement.addEventListener('change', (e) => {
          generoSeleccionado = e.target.value; // Actualiza el género seleccionado.
          localStorage.setItem('generoSeleccionado', generoSeleccionado); // Guarda el nuevo género en el almacenamiento local.
          generoNombre.textContent = generoSeleccionado; // Muestra el nuevo género en la interfaz.

          // Recupera los libros del nuevo género seleccionado y vuelve a renderizarlos.
          libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];
          renderizarLibros(); // Vuelve a generar la lista de libros.
      });

      selectElement.focus(); // Coloca el foco en el dropdown para que el usuario pueda interactuar inmediatamente.
  });

  // Llama a la función de renderizado para mostrar los libros al cargar la página.
  renderizarLibros();
});
