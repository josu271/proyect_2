-- =========================================================
-- BASE DE DATOS: Sistema de Generación de Horarios Académicos
-- Roles: ADMIN / DOCENTE / ESTUDIANTE
-- PostgreSQL / pgAdmin
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- LIMPIEZA PARA DESARROLLO
-- CUIDADO: elimina tablas, vistas, funciones y datos existentes.
-- =========================================================

DROP VIEW IF EXISTS vw_horario_estudiante CASCADE;
DROP VIEW IF EXISTS vw_horario_docente CASCADE;
DROP VIEW IF EXISTS vw_secciones_publicadas CASCADE;
DROP VIEW IF EXISTS vw_cursos_asignados_docente CASCADE;

DROP FUNCTION IF EXISTS fn_validar_usuario_docente() CASCADE;
DROP FUNCTION IF EXISTS fn_validar_usuario_estudiante() CASCADE;
DROP FUNCTION IF EXISTS fn_validar_seccion_docente_asignado() CASCADE;
DROP FUNCTION IF EXISTS fn_validar_bloque_horario() CASCADE;
DROP FUNCTION IF EXISTS fn_publicar_seccion_automaticamente() CASCADE;
DROP FUNCTION IF EXISTS fn_validar_eliminar_bloque_horario() CASCADE;
DROP FUNCTION IF EXISTS fn_revertir_seccion_sin_horario() CASCADE;
DROP FUNCTION IF EXISTS fn_validar_matricula_detalle() CASCADE;

DROP TABLE IF EXISTS matricula_detalle CASCADE;
DROP TABLE IF EXISTS matriculas CASCADE;
DROP TABLE IF EXISTS historial_academico CASCADE;
DROP TABLE IF EXISTS bloques_horario CASCADE;
DROP TABLE IF EXISTS disponibilidad_estudiante CASCADE;
DROP TABLE IF EXISTS disponibilidad_docente CASCADE;
DROP TABLE IF EXISTS secciones CASCADE;
DROP TABLE IF EXISTS docente_curso_asignado CASCADE;
DROP TABLE IF EXISTS curso_prerequisitos CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS aulas CASCADE;
DROP TABLE IF EXISTS estudiantes CASCADE;
DROP TABLE IF EXISTS docentes CASCADE;
DROP TABLE IF EXISTS bloques_academicos CASCADE;
DROP TABLE IF EXISTS semestres_academicos CASCADE;
DROP TABLE IF EXISTS programas_academicos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =========================================================
-- 1. USUARIOS
-- =========================================================

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'DOCENTE', 'ESTUDIANTE')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. DATOS ACADÉMICOS BASE
-- =========================================================

CREATE TABLE programas_academicos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE semestres_academicos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PLANIFICACION'
        CHECK (estado IN ('PLANIFICACION', 'ACTIVO', 'CERRADO')),
    CHECK (fecha_fin > fecha_inicio)
);

-- Cada curso del proyecto se maneja en bloques fijos de 90 minutos.
CREATE TABLE bloques_academicos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    turno VARCHAR(20) NOT NULL CHECK (turno IN ('MANANA', 'TARDE', 'NOCHE')),
    UNIQUE (hora_inicio, hora_fin),
    CHECK (hora_fin > hora_inicio),
    CHECK (hora_fin = (hora_inicio + INTERVAL '90 minutes')::time)
);

INSERT INTO bloques_academicos (nombre, hora_inicio, hora_fin, turno) VALUES
('Bloque 1', '08:00', '09:30', 'MANANA'),
('Bloque 2', '09:30', '11:00', 'MANANA'),
('Bloque 3', '11:00', '12:30', 'MANANA'),
('Bloque 4', '14:00', '15:30', 'TARDE'),
('Bloque 5', '15:30', '17:00', 'TARDE'),
('Bloque 6', '17:00', '18:30', 'TARDE'),
('Bloque 7', '18:30', '20:00', 'NOCHE'),
('Bloque 8', '20:00', '21:30', 'NOCHE');

-- =========================================================
-- 3. DOCENTES Y ESTUDIANTES
-- =========================================================

CREATE TABLE docentes (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    codigo_docente VARCHAR(30) NOT NULL UNIQUE,
    dni VARCHAR(15) UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    especialidad VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estudiantes (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    programa_id BIGINT NOT NULL REFERENCES programas_academicos(id),
    codigo_estudiante VARCHAR(30) NOT NULL UNIQUE,
    dni VARCHAR(15) UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    ciclo SMALLINT CHECK (ciclo BETWEEN 1 AND 12),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Validar que el usuario asociado a docente tenga rol DOCENTE.
CREATE OR REPLACE FUNCTION fn_validar_usuario_docente()
RETURNS TRIGGER AS $$
DECLARE
    v_rol VARCHAR(20);
BEGIN
    SELECT rol INTO v_rol
    FROM usuarios
    WHERE id = NEW.usuario_id;

    IF v_rol <> 'DOCENTE' THEN
        RAISE EXCEPTION 'El usuario asociado debe tener rol DOCENTE.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_usuario_docente
BEFORE INSERT OR UPDATE ON docentes
FOR EACH ROW
EXECUTE FUNCTION fn_validar_usuario_docente();

-- Validar que el usuario asociado a estudiante tenga rol ESTUDIANTE.
CREATE OR REPLACE FUNCTION fn_validar_usuario_estudiante()
RETURNS TRIGGER AS $$
DECLARE
    v_rol VARCHAR(20);
BEGIN
    SELECT rol INTO v_rol
    FROM usuarios
    WHERE id = NEW.usuario_id;

    IF v_rol <> 'ESTUDIANTE' THEN
        RAISE EXCEPTION 'El usuario asociado debe tener rol ESTUDIANTE.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_usuario_estudiante
BEFORE INSERT OR UPDATE ON estudiantes
FOR EACH ROW
EXECUTE FUNCTION fn_validar_usuario_estudiante();

-- =========================================================
-- 4. AULAS Y CURSOS
-- =========================================================

CREATE TABLE aulas (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE, -- Ejemplo: G103
    nombre VARCHAR(100),
    tipo_aula VARCHAR(30) NOT NULL DEFAULT 'TEORICA'
        CHECK (tipo_aula IN ('TEORICA', 'LABORATORIO', 'AUDITORIO', 'VIRTUAL')),
    capacidad INT NOT NULL CHECK (capacidad > 0),
    ubicacion VARCHAR(150),
    activa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE cursos (
    id BIGSERIAL PRIMARY KEY,
    programa_id BIGINT NOT NULL REFERENCES programas_academicos(id),
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    creditos INT NOT NULL CHECK (creditos BETWEEN 1 AND 6),
    ciclo SMALLINT CHECK (ciclo BETWEEN 1 AND 12),
    tipo_aula_requerida VARCHAR(30) NOT NULL DEFAULT 'CUALQUIERA'
        CHECK (tipo_aula_requerida IN ('CUALQUIERA', 'TEORICA', 'LABORATORIO', 'VIRTUAL')),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE curso_prerequisitos (
    id BIGSERIAL PRIMARY KEY,
    curso_id BIGINT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    prerequisito_curso_id BIGINT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE (curso_id, prerequisito_curso_id),
    CHECK (curso_id <> prerequisito_curso_id)
);

-- =========================================================
-- 5. ASIGNACIÓN DEL ADMIN: CURSO A DOCENTE
-- =========================================================

CREATE TABLE docente_curso_asignado (
    id BIGSERIAL PRIMARY KEY,
    docente_id BIGINT NOT NULL REFERENCES docentes(id),
    curso_id BIGINT NOT NULL REFERENCES cursos(id),
    semestre_id BIGINT NOT NULL REFERENCES semestres_academicos(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'ASIGNADO'
        CHECK (estado IN ('ASIGNADO', 'RETIRADO')),
    fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_docente_curso_semestre_activo
ON docente_curso_asignado (docente_id, curso_id, semestre_id)
WHERE estado = 'ASIGNADO';

-- =========================================================
-- 6. SECCIONES / NRC
-- =========================================================
-- La sección representa la oferta académica.
-- NO es lo mismo que aula.
--
-- Ejemplo:
-- NRC: 10235
-- Curso: Base de Datos I
-- Docente: Juan Pérez
-- Aula: G103
-- Día: Lunes
-- Hora: 08:00 - 09:30
--
-- El aula, día y hora se guardan en bloques_horario.
-- =========================================================

CREATE TABLE secciones (
    id BIGSERIAL PRIMARY KEY,
    nrc VARCHAR(30) NOT NULL,
    curso_id BIGINT NOT NULL REFERENCES cursos(id),
    docente_id BIGINT NOT NULL REFERENCES docentes(id),
    semestre_id BIGINT NOT NULL REFERENCES semestres_academicos(id),
    cupo_max INT NOT NULL CHECK (cupo_max > 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR'
        CHECK (estado IN ('BORRADOR', 'PROPUESTA', 'PUBLICADA', 'CERRADA', 'CANCELADA')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (semestre_id, nrc)
);

-- La sección solo puede crearse si el ADMIN asignó antes ese curso al docente.
CREATE OR REPLACE FUNCTION fn_validar_seccion_docente_asignado()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM docente_curso_asignado dca
        WHERE dca.docente_id = NEW.docente_id
          AND dca.curso_id = NEW.curso_id
          AND dca.semestre_id = NEW.semestre_id
          AND dca.estado = 'ASIGNADO'
    ) THEN
        RAISE EXCEPTION 'No se puede crear la sección. El docente no tiene asignado este curso en el semestre seleccionado.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_seccion_docente_asignado
BEFORE INSERT OR UPDATE ON secciones
FOR EACH ROW
EXECUTE FUNCTION fn_validar_seccion_docente_asignado();

-- =========================================================
-- 7. DISPONIBILIDAD
-- =========================================================
-- Opcional, pero útil para el proyecto.
-- El docente puede registrar en qué bloques puede dictar.
-- El estudiante puede registrar en qué bloques está disponible.
-- =========================================================

CREATE TABLE disponibilidad_docente (
    id BIGSERIAL PRIMARY KEY,
    docente_id BIGINT NOT NULL REFERENCES docentes(id) ON DELETE CASCADE,
    semestre_id BIGINT NOT NULL REFERENCES semestres_academicos(id) ON DELETE CASCADE,
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 6),
    bloque_academico_id BIGINT NOT NULL REFERENCES bloques_academicos(id),
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (docente_id, semestre_id, dia_semana, bloque_academico_id)
);

CREATE TABLE disponibilidad_estudiante (
    id BIGSERIAL PRIMARY KEY,
    estudiante_id BIGINT NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    semestre_id BIGINT NOT NULL REFERENCES semestres_academicos(id) ON DELETE CASCADE,
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 6),
    bloque_academico_id BIGINT NOT NULL REFERENCES bloques_academicos(id),
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (estudiante_id, semestre_id, dia_semana, bloque_academico_id)
);

-- =========================================================
-- 8. HORARIO REAL DE LA SECCIÓN
-- =========================================================
-- Aquí el docente elige:
-- aula + día + bloque.
--
-- Para tu PMV: cada sección tiene un solo bloque de 90 minutos.
-- =========================================================

CREATE TABLE bloques_horario (
    id BIGSERIAL PRIMARY KEY,
    seccion_id BIGINT NOT NULL UNIQUE REFERENCES secciones(id) ON DELETE CASCADE,
    aula_id BIGINT NOT NULL REFERENCES aulas(id),
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 6),
    bloque_academico_id BIGINT NOT NULL REFERENCES bloques_academicos(id),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 9. HISTORIAL ACADÉMICO
-- =========================================================
-- Permite validar:
-- - curso ya aprobado
-- - prerrequisitos
-- =========================================================

CREATE TABLE historial_academico (
    id BIGSERIAL PRIMARY KEY,
    estudiante_id BIGINT NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    curso_id BIGINT NOT NULL REFERENCES cursos(id),
    semestre_id BIGINT REFERENCES semestres_academicos(id),
    nota NUMERIC(4,2) CHECK (nota BETWEEN 0 AND 20),
    estado VARCHAR(20) NOT NULL
        CHECK (estado IN ('APROBADO', 'DESAPROBADO', 'RETIRADO', 'CONVALIDADO')),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (estudiante_id, curso_id, semestre_id)
);

-- =========================================================
-- 10. MATRÍCULA DEL ESTUDIANTE
-- =========================================================

CREATE TABLE matriculas (
    id BIGSERIAL PRIMARY KEY,
    estudiante_id BIGINT NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    semestre_id BIGINT NOT NULL REFERENCES semestres_academicos(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR'
        CHECK (estado IN ('BORRADOR', 'CONFIRMADA', 'ANULADA')),
    fecha_matricula TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (estudiante_id, semestre_id)
);

CREATE TABLE matricula_detalle (
    id BIGSERIAL PRIMARY KEY,
    matricula_id BIGINT NOT NULL REFERENCES matriculas(id) ON DELETE CASCADE,
    seccion_id BIGINT NOT NULL REFERENCES secciones(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'RETIRADO')),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (matricula_id, seccion_id)
);

-- =========================================================
-- 11. VALIDACIÓN DEL BLOQUE HORARIO
-- =========================================================
-- Valida:
-- - aula disponible
-- - docente disponible
-- - capacidad del aula
-- - tipo de aula
-- - no cruce de aula
-- - no cruce de docente
-- - disponibilidad docente, si fue registrada
-- =========================================================

CREATE OR REPLACE FUNCTION fn_validar_bloque_horario()
RETURNS TRIGGER AS $$
DECLARE
    v_docente_id BIGINT;
    v_curso_id BIGINT;
    v_semestre_id BIGINT;
    v_cupo_max INT;
    v_estado_seccion VARCHAR(20);
    v_tipo_requerido VARCHAR(30);
    v_capacidad_aula INT;
    v_tipo_aula VARCHAR(30);
    v_hora_inicio TIME;
    v_hora_fin TIME;
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF EXISTS (
            SELECT 1
            FROM matricula_detalle md
            INNER JOIN matriculas m ON m.id = md.matricula_id
            WHERE md.seccion_id = OLD.seccion_id
              AND md.estado = 'ACTIVO'
              AND m.estado <> 'ANULADA'
        ) THEN
            RAISE EXCEPTION 'No se puede modificar el horario porque la sección ya tiene estudiantes matriculados.';
        END IF;
    END IF;

    SELECT 
        s.docente_id,
        s.curso_id,
        s.semestre_id,
        s.cupo_max,
        s.estado,
        c.tipo_aula_requerida
    INTO 
        v_docente_id,
        v_curso_id,
        v_semestre_id,
        v_cupo_max,
        v_estado_seccion,
        v_tipo_requerido
    FROM secciones s
    INNER JOIN cursos c ON c.id = s.curso_id
    WHERE s.id = NEW.seccion_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La sección indicada no existe.';
    END IF;

    IF v_estado_seccion IN ('CERRADA', 'CANCELADA') THEN
        RAISE EXCEPTION 'No se puede asignar horario a una sección cerrada o cancelada.';
    END IF;

    SELECT capacidad, tipo_aula
    INTO v_capacidad_aula, v_tipo_aula
    FROM aulas
    WHERE id = NEW.aula_id
      AND activa = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El aula indicada no existe o está inactiva.';
    END IF;

    IF v_capacidad_aula < v_cupo_max THEN
        RAISE EXCEPTION 'El aula no tiene capacidad suficiente para el cupo máximo de la sección.';
    END IF;

    IF v_tipo_requerido = 'LABORATORIO' AND v_tipo_aula <> 'LABORATORIO' THEN
        RAISE EXCEPTION 'El curso requiere laboratorio. El aula seleccionada no es laboratorio.';
    END IF;

    IF v_tipo_requerido = 'TEORICA' AND v_tipo_aula NOT IN ('TEORICA', 'AUDITORIO') THEN
        RAISE EXCEPTION 'El curso requiere aula teórica o auditorio.';
    END IF;

    IF v_tipo_requerido = 'VIRTUAL' AND v_tipo_aula <> 'VIRTUAL' THEN
        RAISE EXCEPTION 'El curso requiere aula virtual.';
    END IF;

    SELECT hora_inicio, hora_fin
    INTO v_hora_inicio, v_hora_fin
    FROM bloques_academicos
    WHERE id = NEW.bloque_academico_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El bloque académico indicado no existe.';
    END IF;

    -- Si el docente registró disponibilidad, debe respetarse.
    IF EXISTS (
        SELECT 1
        FROM disponibilidad_docente dd
        WHERE dd.docente_id = v_docente_id
          AND dd.semestre_id = v_semestre_id
    ) AND NOT EXISTS (
        SELECT 1
        FROM disponibilidad_docente dd
        WHERE dd.docente_id = v_docente_id
          AND dd.semestre_id = v_semestre_id
          AND dd.dia_semana = NEW.dia_semana
          AND dd.bloque_academico_id = NEW.bloque_academico_id
          AND dd.disponible = TRUE
    ) THEN
        RAISE EXCEPTION 'El docente no tiene disponibilidad en el día y bloque seleccionados.';
    END IF;

    -- Validar cruce de aula en el mismo semestre.
    IF EXISTS (
        SELECT 1
        FROM bloques_horario bh
        INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
        INNER JOIN secciones s2 ON s2.id = bh.seccion_id
        WHERE bh.id <> COALESCE(NEW.id, 0)
          AND s2.semestre_id = v_semestre_id
          AND bh.aula_id = NEW.aula_id
          AND bh.dia_semana = NEW.dia_semana
          AND s2.estado <> 'CANCELADA'
          AND v_hora_inicio < ba.hora_fin
          AND v_hora_fin > ba.hora_inicio
    ) THEN
        RAISE EXCEPTION 'El aula ya está ocupada en ese día y bloque horario.';
    END IF;

    -- Validar cruce de docente en el mismo semestre.
    IF EXISTS (
        SELECT 1
        FROM bloques_horario bh
        INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
        INNER JOIN secciones s2 ON s2.id = bh.seccion_id
        WHERE bh.id <> COALESCE(NEW.id, 0)
          AND s2.semestre_id = v_semestre_id
          AND s2.docente_id = v_docente_id
          AND bh.dia_semana = NEW.dia_semana
          AND s2.estado <> 'CANCELADA'
          AND v_hora_inicio < ba.hora_fin
          AND v_hora_fin > ba.hora_inicio
    ) THEN
        RAISE EXCEPTION 'El docente ya tiene otra sección asignada en ese día y bloque horario.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_bloque_horario
BEFORE INSERT OR UPDATE ON bloques_horario
FOR EACH ROW
EXECUTE FUNCTION fn_validar_bloque_horario();

-- =========================================================
-- 12. PUBLICACIÓN AUTOMÁTICA DE SECCIÓN
-- =========================================================
-- Cuando el docente registra aula + día + bloque,
-- el sistema publica automáticamente la sección.
-- =========================================================

CREATE OR REPLACE FUNCTION fn_publicar_seccion_automaticamente()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE secciones
    SET estado = 'PUBLICADA'
    WHERE id = NEW.seccion_id
      AND estado IN ('BORRADOR', 'PROPUESTA');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_publicar_seccion_automaticamente
AFTER INSERT OR UPDATE ON bloques_horario
FOR EACH ROW
EXECUTE FUNCTION fn_publicar_seccion_automaticamente();

-- Evita eliminar horario si ya hay estudiantes matriculados.
CREATE OR REPLACE FUNCTION fn_validar_eliminar_bloque_horario()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM matricula_detalle md
        INNER JOIN matriculas m ON m.id = md.matricula_id
        WHERE md.seccion_id = OLD.seccion_id
          AND md.estado = 'ACTIVO'
          AND m.estado <> 'ANULADA'
    ) THEN
        RAISE EXCEPTION 'No se puede eliminar el horario porque la sección ya tiene estudiantes matriculados.';
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_eliminar_bloque_horario
BEFORE DELETE ON bloques_horario
FOR EACH ROW
EXECUTE FUNCTION fn_validar_eliminar_bloque_horario();

-- Si se elimina el horario y no hay matrícula, la sección vuelve a BORRADOR.
CREATE OR REPLACE FUNCTION fn_revertir_seccion_sin_horario()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM bloques_horario
        WHERE seccion_id = OLD.seccion_id
    ) THEN
        UPDATE secciones
        SET estado = 'BORRADOR'
        WHERE id = OLD.seccion_id
          AND estado = 'PUBLICADA';
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_revertir_seccion_sin_horario
AFTER DELETE ON bloques_horario
FOR EACH ROW
EXECUTE FUNCTION fn_revertir_seccion_sin_horario();

-- =========================================================
-- 13. VALIDACIÓN DE MATRÍCULA
-- =========================================================
-- Valida:
-- - sección publicada
-- - mismo semestre
-- - mismo programa académico
-- - no repetir curso
-- - no llevar curso ya aprobado
-- - cumplir prerrequisitos
-- - no cruce horario
-- - no superar 22 créditos
-- - cupos disponibles
-- - disponibilidad del estudiante, si fue registrada
-- =========================================================

CREATE OR REPLACE FUNCTION fn_validar_matricula_detalle()
RETURNS TRIGGER AS $$
DECLARE
    v_estudiante_id BIGINT;
    v_programa_estudiante_id BIGINT;
    v_semestre_matricula_id BIGINT;
    v_estado_matricula VARCHAR(20);

    v_curso_id BIGINT;
    v_programa_curso_id BIGINT;
    v_semestre_seccion_id BIGINT;
    v_creditos INT;
    v_cupo_max INT;
    v_estado_seccion VARCHAR(20);

    v_creditos_actuales INT;
    v_cupos_ocupados INT;
BEGIN
    IF NEW.estado <> 'ACTIVO' THEN
        RETURN NEW;
    END IF;

    SELECT
        m.estudiante_id,
        e.programa_id,
        m.semestre_id,
        m.estado,
        s.curso_id,
        c.programa_id,
        s.semestre_id,
        c.creditos,
        s.cupo_max,
        s.estado
    INTO
        v_estudiante_id,
        v_programa_estudiante_id,
        v_semestre_matricula_id,
        v_estado_matricula,
        v_curso_id,
        v_programa_curso_id,
        v_semestre_seccion_id,
        v_creditos,
        v_cupo_max,
        v_estado_seccion
    FROM matriculas m
    INNER JOIN estudiantes e ON e.id = m.estudiante_id
    INNER JOIN secciones s ON s.id = NEW.seccion_id
    INNER JOIN cursos c ON c.id = s.curso_id
    WHERE m.id = NEW.matricula_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La matrícula o sección indicada no existe.';
    END IF;

    IF v_estado_matricula = 'ANULADA' THEN
        RAISE EXCEPTION 'No se puede agregar cursos a una matrícula anulada.';
    END IF;

    IF v_estado_seccion <> 'PUBLICADA' THEN
        RAISE EXCEPTION 'El estudiante solo puede matricularse en secciones publicadas.';
    END IF;

    IF v_semestre_matricula_id <> v_semestre_seccion_id THEN
        RAISE EXCEPTION 'La sección no pertenece al mismo semestre de la matrícula.';
    END IF;

    IF v_programa_estudiante_id <> v_programa_curso_id THEN
        RAISE EXCEPTION 'El curso no pertenece al programa académico del estudiante.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM bloques_horario bh
        WHERE bh.seccion_id = NEW.seccion_id
    ) THEN
        RAISE EXCEPTION 'La sección no tiene horario asignado.';
    END IF;

    -- No repetir el mismo curso dentro de la misma matrícula.
    IF EXISTS (
        SELECT 1
        FROM matricula_detalle md
        INNER JOIN secciones s2 ON s2.id = md.seccion_id
        WHERE md.matricula_id = NEW.matricula_id
          AND md.estado = 'ACTIVO'
          AND s2.curso_id = v_curso_id
          AND md.id <> COALESCE(NEW.id, 0)
    ) THEN
        RAISE EXCEPTION 'El estudiante no puede matricularse dos veces en el mismo curso.';
    END IF;

    -- No llevar curso ya aprobado o convalidado.
    IF EXISTS (
        SELECT 1
        FROM historial_academico ha
        WHERE ha.estudiante_id = v_estudiante_id
          AND ha.curso_id = v_curso_id
          AND ha.estado IN ('APROBADO', 'CONVALIDADO')
    ) THEN
        RAISE EXCEPTION 'El estudiante ya aprobó o convalidó este curso.';
    END IF;

    -- Validar prerrequisitos.
    IF EXISTS (
        SELECT 1
        FROM curso_prerequisitos cp
        WHERE cp.curso_id = v_curso_id
          AND NOT EXISTS (
              SELECT 1
              FROM historial_academico ha
              WHERE ha.estudiante_id = v_estudiante_id
                AND ha.curso_id = cp.prerequisito_curso_id
                AND ha.estado IN ('APROBADO', 'CONVALIDADO')
          )
    ) THEN
        RAISE EXCEPTION 'El estudiante no cumple los prerrequisitos del curso.';
    END IF;

    -- Validar disponibilidad del estudiante, si fue registrada.
    IF EXISTS (
        SELECT 1
        FROM disponibilidad_estudiante de
        WHERE de.estudiante_id = v_estudiante_id
          AND de.semestre_id = v_semestre_matricula_id
    ) AND EXISTS (
        SELECT 1
        FROM bloques_horario bh
        WHERE bh.seccion_id = NEW.seccion_id
          AND NOT EXISTS (
              SELECT 1
              FROM disponibilidad_estudiante de
              WHERE de.estudiante_id = v_estudiante_id
                AND de.semestre_id = v_semestre_matricula_id
                AND de.dia_semana = bh.dia_semana
                AND de.bloque_academico_id = bh.bloque_academico_id
                AND de.disponible = TRUE
          )
    ) THEN
        RAISE EXCEPTION 'La sección seleccionada no coincide con la disponibilidad registrada del estudiante.';
    END IF;

    -- Validar cruce horario con otros cursos seleccionados.
    IF EXISTS (
        SELECT 1
        FROM bloques_horario bh_nuevo
        INNER JOIN bloques_academicos ba_nuevo ON ba_nuevo.id = bh_nuevo.bloque_academico_id
        INNER JOIN matricula_detalle md ON md.matricula_id = NEW.matricula_id
        INNER JOIN bloques_horario bh_existente ON bh_existente.seccion_id = md.seccion_id
        INNER JOIN bloques_academicos ba_existente ON ba_existente.id = bh_existente.bloque_academico_id
        WHERE bh_nuevo.seccion_id = NEW.seccion_id
          AND md.estado = 'ACTIVO'
          AND md.id <> COALESCE(NEW.id, 0)
          AND bh_nuevo.dia_semana = bh_existente.dia_semana
          AND ba_nuevo.hora_inicio < ba_existente.hora_fin
          AND ba_nuevo.hora_fin > ba_existente.hora_inicio
    ) THEN
        RAISE EXCEPTION 'No se puede matricular. Existe cruce de horario con otro curso seleccionado.';
    END IF;

    -- Validar máximo 22 créditos.
    SELECT COALESCE(SUM(c2.creditos), 0)
    INTO v_creditos_actuales
    FROM matricula_detalle md
    INNER JOIN secciones s2 ON s2.id = md.seccion_id
    INNER JOIN cursos c2 ON c2.id = s2.curso_id
    WHERE md.matricula_id = NEW.matricula_id
      AND md.estado = 'ACTIVO'
      AND md.id <> COALESCE(NEW.id, 0);

    IF v_creditos_actuales + v_creditos > 22 THEN
        RAISE EXCEPTION 'No se puede matricular. Se supera el límite máximo de 22 créditos.';
    END IF;

    -- Validar cupo disponible.
    SELECT COUNT(*)
    INTO v_cupos_ocupados
    FROM matricula_detalle md
    INNER JOIN matriculas m2 ON m2.id = md.matricula_id
    WHERE md.seccion_id = NEW.seccion_id
      AND md.estado = 'ACTIVO'
      AND m2.estado <> 'ANULADA'
      AND md.id <> COALESCE(NEW.id, 0);

    IF v_cupos_ocupados >= v_cupo_max THEN
        RAISE EXCEPTION 'No se puede matricular. La sección ya no tiene cupos disponibles.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_matricula_detalle
BEFORE INSERT OR UPDATE ON matricula_detalle
FOR EACH ROW
EXECUTE FUNCTION fn_validar_matricula_detalle();

-- =========================================================
-- 14. ÍNDICES
-- =========================================================

CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_docentes_usuario ON docentes(usuario_id);
CREATE INDEX idx_estudiantes_usuario ON estudiantes(usuario_id);
CREATE INDEX idx_estudiantes_programa ON estudiantes(programa_id);
CREATE INDEX idx_cursos_programa ON cursos(programa_id);
CREATE INDEX idx_secciones_semestre ON secciones(semestre_id);
CREATE INDEX idx_secciones_curso_docente ON secciones(curso_id, docente_id);
CREATE INDEX idx_bloques_horario_aula_dia ON bloques_horario(aula_id, dia_semana, bloque_academico_id);
CREATE INDEX idx_matriculas_estudiante_semestre ON matriculas(estudiante_id, semestre_id);
CREATE INDEX idx_detalle_matricula ON matricula_detalle(matricula_id, seccion_id);
CREATE INDEX idx_historial_estudiante_curso ON historial_academico(estudiante_id, curso_id);

-- =========================================================
-- 15. VISTAS PARA EL FRONTEND
-- =========================================================

-- Cursos asignados al docente por el ADMIN.
CREATE VIEW vw_cursos_asignados_docente AS
SELECT
    dca.id AS asignacion_id,
    d.id AS docente_id,
    d.nombre_completo AS docente,
    c.id AS curso_id,
    c.codigo AS curso_codigo,
    c.nombre AS curso,
    c.creditos,
    sem.id AS semestre_id,
    sem.codigo AS semestre,
    dca.estado,
    dca.fecha_asignacion
FROM docente_curso_asignado dca
INNER JOIN docentes d ON d.id = dca.docente_id
INNER JOIN cursos c ON c.id = dca.curso_id
INNER JOIN semestres_academicos sem ON sem.id = dca.semestre_id
WHERE dca.estado = 'ASIGNADO';

-- Secciones publicadas que el estudiante puede ver.
CREATE VIEW vw_secciones_publicadas AS
SELECT
    s.id AS seccion_id,
    s.nrc,
    sem.id AS semestre_id,
    sem.codigo AS semestre,
    c.id AS curso_id,
    c.codigo AS curso_codigo,
    c.nombre AS curso,
    c.creditos,
    d.id AS docente_id,
    d.nombre_completo AS docente,
    a.id AS aula_id,
    a.codigo AS aula,
    a.tipo_aula,
    bh.dia_semana,
    CASE bh.dia_semana
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
    END AS dia_nombre,
    ba.id AS bloque_academico_id,
    ba.nombre AS bloque,
    ba.hora_inicio,
    ba.hora_fin,
    ba.turno,
    s.cupo_max,
    COUNT(md.id) FILTER (WHERE m.id IS NOT NULL) AS cupos_ocupados,
    s.cupo_max - COUNT(md.id) FILTER (WHERE m.id IS NOT NULL) AS cupos_disponibles,
    s.estado
FROM secciones s
INNER JOIN semestres_academicos sem ON sem.id = s.semestre_id
INNER JOIN cursos c ON c.id = s.curso_id
INNER JOIN docentes d ON d.id = s.docente_id
INNER JOIN bloques_horario bh ON bh.seccion_id = s.id
INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
INNER JOIN aulas a ON a.id = bh.aula_id
LEFT JOIN matricula_detalle md ON md.seccion_id = s.id AND md.estado = 'ACTIVO'
LEFT JOIN matriculas m ON m.id = md.matricula_id AND m.estado <> 'ANULADA'
WHERE s.estado = 'PUBLICADA'
GROUP BY
    s.id, s.nrc, sem.id, sem.codigo,
    c.id, c.codigo, c.nombre, c.creditos,
    d.id, d.nombre_completo,
    a.id, a.codigo, a.tipo_aula,
    bh.dia_semana,
    ba.id, ba.nombre, ba.hora_inicio, ba.hora_fin, ba.turno,
    s.cupo_max, s.estado;

-- Horario individual del estudiante.
CREATE VIEW vw_horario_estudiante AS
SELECT
    e.id AS estudiante_id,
    e.codigo_estudiante,
    e.nombre_completo AS estudiante,
    m.id AS matricula_id,
    sem.codigo AS semestre,
    s.nrc,
    c.codigo AS curso_codigo,
    c.nombre AS curso,
    c.creditos,
    d.nombre_completo AS docente,
    a.codigo AS aula,
    bh.dia_semana,
    CASE bh.dia_semana
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
    END AS dia_nombre,
    ba.hora_inicio,
    ba.hora_fin,
    ba.turno,
    md.estado AS estado_detalle
FROM matriculas m
INNER JOIN estudiantes e ON e.id = m.estudiante_id
INNER JOIN semestres_academicos sem ON sem.id = m.semestre_id
INNER JOIN matricula_detalle md ON md.matricula_id = m.id
INNER JOIN secciones s ON s.id = md.seccion_id
INNER JOIN cursos c ON c.id = s.curso_id
INNER JOIN docentes d ON d.id = s.docente_id
INNER JOIN bloques_horario bh ON bh.seccion_id = s.id
INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
INNER JOIN aulas a ON a.id = bh.aula_id
WHERE md.estado = 'ACTIVO'
  AND m.estado <> 'ANULADA';

-- Horario del docente.
CREATE VIEW vw_horario_docente AS
SELECT
    d.id AS docente_id,
    d.codigo_docente,
    d.nombre_completo AS docente,
    sem.codigo AS semestre,
    s.nrc,
    c.codigo AS curso_codigo,
    c.nombre AS curso,
    a.codigo AS aula,
    bh.dia_semana,
    CASE bh.dia_semana
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
    END AS dia_nombre,
    ba.hora_inicio,
    ba.hora_fin,
    ba.turno,
    s.estado AS estado_seccion
FROM secciones s
INNER JOIN docentes d ON d.id = s.docente_id
INNER JOIN cursos c ON c.id = s.curso_id
INNER JOIN semestres_academicos sem ON sem.id = s.semestre_id
INNER JOIN bloques_horario bh ON bh.seccion_id = s.id
INNER JOIN bloques_academicos ba ON ba.id = bh.bloque_academico_id
INNER JOIN aulas a ON a.id = bh.aula_id
WHERE s.estado <> 'CANCELADA';

-- =========================================================
-- 16. DATOS DE PRUEBA
-- Puedes borrar esta parte si quieres iniciar la BD vacía.
-- Contraseña para todos: 123456
-- =========================================================

INSERT INTO usuarios (correo, contrasena_hash, rol) VALUES
('admin@demo.com', crypt('123456', gen_salt('bf')), 'ADMIN'),
('docente@demo.com', crypt('123456', gen_salt('bf')), 'DOCENTE'),
('estudiante@demo.com', crypt('123456', gen_salt('bf')), 'ESTUDIANTE');

INSERT INTO programas_academicos (codigo, nombre) VALUES
('ISI', 'Ingeniería de Sistemas e Informática');

INSERT INTO semestres_academicos (codigo, nombre, fecha_inicio, fecha_fin, estado) VALUES
('2026-I', 'Semestre Académico 2026-I', '2026-03-01', '2026-07-31', 'ACTIVO');

INSERT INTO docentes (usuario_id, codigo_docente, dni, nombre_completo, especialidad)
SELECT id, 'DOC001', '40000001', 'Juan Pérez Torres', 'Base de Datos'
FROM usuarios
WHERE correo = 'docente@demo.com';

INSERT INTO estudiantes (usuario_id, programa_id, codigo_estudiante, dni, nombre_completo, ciclo)
SELECT 
    u.id,
    p.id,
    'EST001',
    '70000001',
    'Luis Ramos Quispe',
    5
FROM usuarios u
CROSS JOIN programas_academicos p
WHERE u.correo = 'estudiante@demo.com'
  AND p.codigo = 'ISI';

INSERT INTO aulas (codigo, nombre, tipo_aula, capacidad, ubicacion) VALUES
('G103', 'Aula G103', 'TEORICA', 40, 'Pabellón G'),
('LAB201', 'Laboratorio 201', 'LABORATORIO', 30, 'Pabellón de Laboratorios'),
('VIR001', 'Aula Virtual 001', 'VIRTUAL', 100, 'Plataforma virtual');

INSERT INTO cursos (programa_id, codigo, nombre, creditos, ciclo, tipo_aula_requerida)
SELECT id, 'BD101', 'Base de Datos I', 4, 5, 'TEORICA'
FROM programas_academicos
WHERE codigo = 'ISI';

-- ADMIN asigna curso al docente.
INSERT INTO docente_curso_asignado (docente_id, curso_id, semestre_id)
SELECT d.id, c.id, s.id
FROM docentes d
INNER JOIN cursos c ON c.codigo = 'BD101'
INNER JOIN semestres_academicos s ON s.codigo = '2026-I'
WHERE d.codigo_docente = 'DOC001';

-- Crear sección/NRC.
INSERT INTO secciones (nrc, curso_id, docente_id, semestre_id, cupo_max)
SELECT 'NRC1001', c.id, d.id, s.id, 35
FROM cursos c
INNER JOIN docentes d ON d.codigo_docente = 'DOC001'
INNER JOIN semestres_academicos s ON s.codigo = '2026-I'
WHERE c.codigo = 'BD101';

-- Docente registra disponibilidad.
INSERT INTO disponibilidad_docente (docente_id, semestre_id, dia_semana, bloque_academico_id, disponible)
SELECT d.id, s.id, 1, b.id, TRUE
FROM docentes d
INNER JOIN semestres_academicos s ON s.codigo = '2026-I'
INNER JOIN bloques_academicos b ON b.hora_inicio = '08:00' AND b.hora_fin = '09:30'
WHERE d.codigo_docente = 'DOC001';

-- Docente elige aula + día + bloque.
-- Al insertar esto, la sección pasa automáticamente a PUBLICADA.
INSERT INTO bloques_horario (seccion_id, aula_id, dia_semana, bloque_academico_id)
SELECT sec.id, a.id, 1, b.id
FROM secciones sec
INNER JOIN aulas a ON a.codigo = 'G103'
INNER JOIN bloques_academicos b ON b.hora_inicio = '08:00' AND b.hora_fin = '09:30'
WHERE sec.nrc = 'NRC1001';

-- Crear matrícula del estudiante.
INSERT INTO matriculas (estudiante_id, semestre_id)
SELECT e.id, s.id
FROM estudiantes e
INNER JOIN semestres_academicos s ON s.codigo = '2026-I'
WHERE e.codigo_estudiante = 'EST001';

-- Estudiante se matricula en la sección publicada.
INSERT INTO matricula_detalle (matricula_id, seccion_id)
SELECT m.id, sec.id
FROM matriculas m
INNER JOIN estudiantes e ON e.id = m.estudiante_id
INNER JOIN secciones sec ON sec.nrc = 'NRC1001'
WHERE e.codigo_estudiante = 'EST001';

-- =========================================================
-- 17. CONSULTAS DE PRUEBA
-- =========================================================

-- Ver secciones publicadas disponibles:
-- SELECT * FROM vw_secciones_publicadas;

-- Ver horario del estudiante:
-- SELECT * FROM vw_horario_estudiante WHERE codigo_estudiante = 'EST001';

-- Ver horario del docente:
-- SELECT * FROM vw_horario_docente WHERE codigo_docente = 'DOC001';

-- Ver cursos asignados al docente:
-- SELECT * FROM vw_cursos_asignados_docente WHERE docente_id = 1;

ALTER TABLE secciones
ADD COLUMN IF NOT EXISTS aula_id BIGINT REFERENCES aulas(id);


CREATE INDEX IF NOT EXISTS idx_secciones_aula
ON secciones(aula_id);