
--
-- Base de datos: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id_genero` int(11) NOT NULL,
  `nombre_genero` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`id_genero`, `nombre_genero`) VALUES
(1, 'Romanaces/Fantasias'),
(2, 'Reencarnaciones'),
(3, 'Epocas'),
(4, 'Novelas Web/Ligera'),
(5, 'Mangas/Manhua/Manhwa'),
(6, 'Fanfiction/Wattpad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id_libro` int(11) NOT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `autor` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumen` text COLLATE utf8mb4_unicode_ci,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completado` tinyint(1) DEFAULT '0',
  `id_genero` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id_libro`, `titulo`, `autor`, `resumen`, `imagen`, `completado`, `id_genero`, `fecha_creacion`) VALUES
(1, 'El nombre del viento', 'Patrick Rothfuss', 'En una posada en tierra de nadie, un hombre se dispone a relatar, por primera vez, la auténtica historia de su vida. Una historia que únicamente él conoce y que ha quedado diluida tras los rumores, las conjeturas y los cuentos de taberna que le han convertido en un personaje legendario a quien todos daban ya por muerto: Kvothe... músico, mendigo, ladrón, estudiante, mago, héroe y asesino.', '/images/el-nombre-del-viento.jpg', 1, 1, '2024-10-10 17:00:00'),
(2, 'La reencarnación de la princesa', 'Anónimo', 'Una princesa que muere trágicamente renace en un mundo de fantasía con todos sus recuerdos intactos. Ahora debe navegar por su nueva vida, evitando los errores del pasado y cambiando su destino.', '/images/reencarnacion-princesa.jpg', 0, 2, '2024-10-10 17:05:00');

-- --------------------------------------------------------

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id_genero`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id_libro`),
  ADD KEY `id_genero` (`id_genero`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id_genero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id_libro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`id_genero`) REFERENCES `generos` (`id_genero`) ON DELETE SET NULL ON UPDATE CASCADE;
