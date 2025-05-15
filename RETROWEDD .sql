-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-04-2025 a las 18:18:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `retrowedd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alergenos`
--

CREATE TABLE `alergenos` (
  `id` int(11) NOT NULL,
  `nombre_alergeno` varchar(500) NOT NULL COMMENT 'Gluten, Frutos secos, Lactosa, etc.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alergenos`
--

INSERT INTO `alergenos` (`id`, `nombre_alergeno`) VALUES
(37, 'Gluten'),
(38, 'Frutos secos'),
(39, 'Lactosa'),
(40, 'mani'),
(42, 'chuches'),
(50, 'Pescado'),
(51, 'Soya'),
(52, 'caramelos'),
(53, 'mayonesa'),
(54, 'nueces'),
(55, 'maiz'),
(56, 'conejo'),
(58, 'crustaceos'),
(59, 'a ti');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invitados`
--

CREATE TABLE `invitados` (
  `id` int(11) NOT NULL,
  `nombre_inv` varchar(50) NOT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `asistencia` tinyint(1) DEFAULT NULL COMMENT 'NULL=no respondió, TRUE=asiste, FALSE=no asiste',
  `transporte` tinyint(1) DEFAULT 0,
  `num_ninos` int(11) DEFAULT 0,
  `menu_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `invitados`
--

INSERT INTO `invitados` (`id`, `nombre_inv`, `apellidos`, `email`, `asistencia`, `transporte`, `num_ninos`, `menu_id`) VALUES
(231, 'Alicia', 'Olmos', '1@ola.com', 1, 1, 1, 1),
(232, 'Juan', 'Pérez', 'juan.perez@email.com', 1, 1, 0, 2),
(237, 'eva', '', 'eva@1.com', 1, 0, 0, 4),
(243, 'Juan', 'Pérez', 'juan.perez@ejemplo.com', 1, 1, 2, 1),
(244, 'Juan', 'Pérez', 'juan.perez@ejemplo.com', 1, 1, 2, 1),
(247, 'Alicia', 'Olmos', 'ivan@hola.com', 1, 0, 0, 1),
(249, 'Juan', 'Pérez', 'juan.perez@ejemplo.com', 1, 1, 2, 1),
(250, 'Maria', 'sierra', 'mariasierra@hola.com', 1, 1, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invitado_alergenos`
--

CREATE TABLE `invitado_alergenos` (
  `invitado_id` int(11) NOT NULL,
  `alergeno_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `invitado_alergenos`
--

INSERT INTO `invitado_alergenos` (`invitado_id`, `alergeno_id`) VALUES
(231, 38),
(231, 39),
(231, 53),
(237, 37),
(237, 39),
(237, 56),
(247, 38),
(247, 58),
(249, 37),
(249, 39),
(250, 39),
(250, 58);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menus`
--

CREATE TABLE `menus` (
  `menu_id` int(11) NOT NULL,
  `nombre_menu` varchar(50) NOT NULL COMMENT 'Vegano, Vegetariano, Clásico, Embarazada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menus`
--

INSERT INTO `menus` (`menu_id`, `nombre_menu`) VALUES
(1, 'Vegano'),
(2, 'Vegetariano'),
(3, 'Clásico'),
(4, 'Embarazada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sugerencias_canciones`
--

CREATE TABLE `sugerencias_canciones` (
  `id` int(11) NOT NULL,
  `nombre_cancion` varchar(255) NOT NULL,
  `artista` varchar(255) DEFAULT NULL,
  `invitado_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sugerencias_canciones`
--

INSERT INTO `sugerencias_canciones` (`id`, `nombre_cancion`, `artista`, `invitado_id`) VALUES
(211, 'Shape of You', 'Ed Sheeran', 249),
(212, 'Blinding Lights', 'The Weeknd', 249),
(213, 'op', 'hola', 250);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alergenos`
--
ALTER TABLE `alergenos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indices de la tabla `invitado_alergenos`
--
ALTER TABLE `invitado_alergenos`
  ADD PRIMARY KEY (`invitado_id`,`alergeno_id`),
  ADD KEY `alergeno_id` (`alergeno_id`);

--
-- Indices de la tabla `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indices de la tabla `sugerencias_canciones`
--
ALTER TABLE `sugerencias_canciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_invitado_id` (`invitado_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alergenos`
--
ALTER TABLE `alergenos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `invitados`
--
ALTER TABLE `invitados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=252;

--
-- AUTO_INCREMENT de la tabla `menus`
--
ALTER TABLE `menus`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `sugerencias_canciones`
--
ALTER TABLE `sugerencias_canciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=215;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD CONSTRAINT `invitados_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`menu_id`);

--
-- Filtros para la tabla `invitado_alergenos`
--
ALTER TABLE `invitado_alergenos`
  ADD CONSTRAINT `invitado_alergenos_ibfk_1` FOREIGN KEY (`invitado_id`) REFERENCES `invitados` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invitado_alergenos_ibfk_2` FOREIGN KEY (`alergeno_id`) REFERENCES `alergenos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sugerencias_canciones`
--
ALTER TABLE `sugerencias_canciones`
  ADD CONSTRAINT `fk_invitado_id` FOREIGN KEY (`invitado_id`) REFERENCES `invitados` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
