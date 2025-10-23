-- Script de inicialización de la base de datos castillo_db
-- Creado por Jesús Imanol Castillo Avendaño

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS castillo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE castillo_db;

-- Crear tabla post_couple
CREATE TABLE IF NOT EXISTS post_couple (
    id_post BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    nombre_anonimo VARCHAR(100) NOT NULL,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    categoria VARCHAR(100) NOT NULL DEFAULT 'General',
    etiquetas JSON NOT NULL,
    num_me_gusta BIGINT NOT NULL DEFAULT 0,
    INDEX idx_fecha (fecha_publicacion),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO post_couple (titulo, contenido, nombre_anonimo, fecha_publicacion, categoria, etiquetas, num_me_gusta) VALUES
('Primera publicación', 'Este es mi primer post en CouplesApp creado por Jesús Imanol Castillo Avendaño', 'Anónimo1', NOW(), 'Personal', '["inicio", "bienvenida"]', 5),
('Viaje a la playa', 'Increíble día en la playa con mi pareja. El sol, la arena y las olas hicieron de este día algo especial.', 'Viajero123', NOW(), 'Viajes', '["playa", "viaje", "aventura"]', 12),
('Cena romántica', 'Una velada perfecta con velas, música suave y una cena deliciosa. Los momentos simples son los mejores.', 'Romántico', NOW(), 'Romance', '["cena", "romance", "amor"]', 8);

-- Verificar que los datos se insertaron
SELECT 'Base de datos castillo_db inicializada correctamente' AS mensaje;
SELECT COUNT(*) AS total_posts FROM post_couple;
