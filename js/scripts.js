// Manejo del encabezado al hacer scroll
window.onscroll = function() {
    const scroll = document.documentElement.scrollTop; // Obtiene el valor del scroll vertical de la página
    const header = document.getElementById('header'); // Obtiene el encabezado (header)
  
    // Si el usuario ha hecho scroll más de 20 píxeles, añade la clase 'nav_mod' al header
    if (scroll > 20) {
        header.classList.add('nav_mod');
    } else {
        // Si el scroll es menor o igual a 20 píxeles, quita la clase 'nav_mod' del header
        header.classList.remove('nav_mod');
    }
  }
  
  // Función para mostrar/ocultar el menú en dispositivos móviles
  document.getElementById("btn_menu").addEventListener("click", function() {
    const menu = document.getElementById("header"); // Selecciona el header que contiene el menú
    const body = document.getElementById("container_all"); // Selecciona el contenedor principal
    const nav = document.getElementById("nav"); // Selecciona la barra de navegación
  
    // Al hacer clic en el botón del menú, alterna las clases 'move_content' y 'move_nav' para mostrar u ocultar el menú
    menu.classList.toggle('move_content');
    body.classList.toggle('move_content');
    nav.classList.toggle('move_nav');
  });
  
  // Restablecer el estado del menú al cambiar el tamaño de la ventana
  window.addEventListener("resize", function() {
    // Si el ancho de la ventana es mayor a 760 píxeles, elimina las clases que mueven el contenido y la navegación
    if (window.innerWidth > 760) {
        const menu = document.getElementById("header");
        const body = document.getElementById("container_all");
        const nav = document.getElementById("nav");
  
        menu.classList.remove('move_content');
        body.classList.remove('move_content');
        nav.classList.remove('move_nav');
    }
  });
  
  // Función Ver Más para redirigir a la página de libros
  function verMas(genero) {
      // Guarda el género seleccionado en localStorage para su uso posterior
      localStorage.setItem('generoSeleccionado', genero);
  
      // Redirige a la página 'libros.html'
      window.location.href = 'libros.html';
  }
  
  // Asegurarse de que la función verMas esté disponible globalmente
  window.verMas = verMas;
  
  // Recuperar el género seleccionado desde localStorage
  const generoSeleccionado = localStorage.getItem('generoSeleccionado');
  
  // Mostrar el título del género seleccionado en la página
  document.getElementById('titulo-genero').textContent = 'Libros de ' + generoSeleccionado;
  
  // Generar la lista de libros según el género seleccionado
  const listaLibros = librosPorGenero[generoSeleccionado] || []; // Obtiene la lista de libros del género o un array vacío si no hay libros
  const listaElement = document.getElementById('lista-libros'); // Selecciona el elemento donde se mostrará la lista de libros
  
  // Recorre la lista de libros y los añade como elementos de lista (<li>) al DOM
  listaLibros.forEach(libro => {
      const li = document.createElement('li'); // Crea un elemento <li> para cada libro
      li.textContent = libro; // Establece el texto del <li> como el nombre del libro
      listaElement.appendChild(li); // Añade el <li> al elemento de lista
  });
  
  // Biblioteca
  document.addEventListener("DOMContentLoaded", () => {
    const bookTableBody = document.getElementById("bookTableBody"); // Selecciona el cuerpo de la tabla de libros
    const addBookBtn = document.getElementById("addBookBtn"); // Selecciona el botón para añadir un nuevo libro
    const searchInput = document.getElementById("searchInput"); // Selecciona el campo de búsqueda
    const filterBtns = document.querySelectorAll(".filter-btn"); // Selecciona los botones de filtrado
  
    // Al hacer clic en el botón de añadir un nuevo libro, se añade una nueva fila a la tabla
    addBookBtn.addEventListener("click", () => {
        const newRow = document.createElement("tr"); // Crea una nueva fila de tabla
  
        // Define el contenido de la nueva fila con campos deshabilitados
        newRow.innerHTML = `
            <td><input type="text" placeholder="Nombre del Autor" class="disabled-input" disabled></td>
            <td><input type="text" placeholder="Nombre del Libro" class="disabled-input" disabled></td>
            <td>
                <select class="disabled-input" disabled>
                    <option value="seleccionar">Seleccionar...</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="leyendo">Leyendo</option>
                    <option value="completo">Completado</option>
                    <option value="abandonado">Abandonado</option>
                </select>
            </td>
            <td>
                <input type="number" min="0" max="10" value="0" class="disabled-input" disabled>
            </td>
            <td>
                <textarea class="disabled-input" placeholder="Escribe aquí tus citas favoritas..." disabled></textarea>
            </td>
            <td class="action-buttons">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
            </td>
        `;
  
        // Añade la nueva fila a la tabla
        bookTableBody.appendChild(newRow);
  
        const editButton = newRow.querySelector(".edit-btn"); // Selecciona el botón de editar de la nueva fila
        const deleteButton = newRow.querySelector(".delete-btn"); // Selecciona el botón de eliminar de la nueva fila
  
        // Añade funcionalidad de edición al botón de editar
        editButton.addEventListener("click", () => {
            const inputs = newRow.querySelectorAll("input, select, textarea"); // Selecciona todos los inputs y selects de la fila
  
            // Alterna entre el modo de edición y el modo de vista
            if (editButton.textContent === "Editar") {
                inputs.forEach(input => {
                    input.disabled = false; // Habilita los inputs para que se puedan editar
                    input.classList.remove('disabled-input'); // Quita la clase que deshabilita el estilo
                });
                editButton.textContent = "Guardar"; // Cambia el texto del botón a 'Guardar'
            } else {
                inputs.forEach(input => {
                    input.disabled = true; // Deshabilita los inputs después de editar
                    input.classList.add('disabled-input'); // Añade la clase que deshabilita el estilo
                });
                editButton.textContent = "Editar"; // Cambia el texto del botón de nuevo a 'Editar'
            }
        });
  
        // Añade funcionalidad de eliminación al botón de eliminar
        deleteButton.addEventListener("click", () => {
            newRow.remove(); // Elimina la fila de la tabla
        });
    });
  
    // Filtra la tabla de libros mientras el usuario escribe en el campo de búsqueda
    searchInput.addEventListener("input", () => {
        const filter = searchInput.value.toLowerCase(); // Convierte el texto de búsqueda a minúsculas
        const rows = bookTableBody.querySelectorAll("tr"); // Selecciona todas las filas de la tabla
  
        // Muestra u oculta las filas según el texto ingresado
        rows.forEach(row => {
            const author = row.cells[0].textContent.toLowerCase(); // Obtiene el nombre del autor en minúsculas
            const title = row.cells[1].textContent.toLowerCase(); // Obtiene el título del libro en minúsculas
            row.style.display = (author.includes(filter) || title.includes(filter)) ? "" : "none"; // Muestra la fila si coincide con la búsqueda
        });
    });
  
    // Filtra la tabla de libros según el estado seleccionado (Pendiente, Leyendo, etc.)
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter; // Obtiene el valor del filtro
            filterBtns.forEach(b => b.classList.remove("active")); // Elimina la clase 'active' de todos los botones
            btn.classList.add("active"); // Añade la clase 'active' al botón seleccionado
  
            const rows = bookTableBody.querySelectorAll("tr"); // Selecciona todas las filas de la tabla
            rows.forEach(row => {
                const status = row.querySelector("select").value; // Obtiene el valor del estado (select) en cada fila
                row.style.display = (filter === "all" || status === filter) ? "" : "none"; // Muestra u oculta filas según el filtro
            });
        });
    });
  });
  