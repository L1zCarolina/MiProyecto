// libros.js
document.addEventListener('DOMContentLoaded', () => {
  const generoNombre = document.getElementById('genero-nombre');
  const librosContainer = document.getElementById('libros-container');

  let generoSeleccionado = localStorage.getItem('generoSeleccionado') || 'Desconocido';
  generoNombre.textContent = generoSeleccionado;

  let libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];

  function renderizarLibros() {
      librosContainer.innerHTML = '';
      if (libros.length === 0) {
          librosContainer.innerHTML = '<p>No hay libros en este género todavía.</p>';
      } else {
          libros.forEach((libro, index) => {
              const libroElement = document.createElement('div');
              libroElement.className = 'card';
              libroElement.innerHTML = `
                  <div class="cover__card">
                      <img src="${libro.imagen || '/placeholder.svg'}" alt="${libro.titulo}">
                  </div>
                  <h2>${libro.titulo}</h2>
                  <p>${libro.resumen.substring(0, 100)}...</p>
                  <hr>
                  <div class="footer__card">
                      <h3 class="user__name">${libro.autor}</h3>
                      <i>Añadido el ${new Date().toLocaleDateString()}</i>
                  </div>
              `;
              libroElement.addEventListener('click', () => verDetalles(index));
              librosContainer.appendChild(libroElement);
          });
      }
  }

  function verDetalles(index) {
      const libro = libros[index];
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
          <div class="modal-content">
              <span class="close">&times;</span>
              <h2>${libro.titulo}</h2>
              <p><strong>Autor:</strong> ${libro.autor}</p>
              <img src="${libro.imagen || '/placeholder.svg'}" alt="${libro.titulo}" style="max-width: 200px; margin: 10px 0;">
              <p>${libro.resumen}</p>
          </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('.close');
      closeBtn.onclick = function() {
          modal.style.display = "none";
      }

      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
      }

      modal.style.display = "block";
  }

  generoNombre.addEventListener('click', () => {
      const generos = ['Romanaces', 'Fantasias', 'Reencarnaciones', 'Epocas', 'Novelas Web/Ligera', 'Mangas', 'Manhua', 'Manhwa', 'Fanfiction/Wattpad'];
      const selectElement = document.createElement('select');
      selectElement.className = 'genero-select';
      generos.forEach(genero => {
          const option = document.createElement('option');
          option.value = genero;
          option.textContent = genero;
          if (genero === generoSeleccionado) {
              option.selected = true;
          }
          selectElement.appendChild(option);
      });

      generoNombre.innerHTML = '';
      generoNombre.appendChild(selectElement);

      selectElement.addEventListener('change', (e) => {
          generoSeleccionado = e.target.value;
          localStorage.setItem('generoSeleccionado', generoSeleccionado);
          generoNombre.textContent = generoSeleccionado;
          libros = JSON.parse(localStorage.getItem(`libros_${generoSeleccionado}`)) || [];
          renderizarLibros();
      });

      selectElement.focus();
  });

  renderizarLibros();
});