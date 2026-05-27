-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('Cliente', 'Barbero', 'Admin');

-- CreateEnum
CREATE TYPE "estado_usuario" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "metodo_pago_enum" AS ENUM ('Nequi', 'Daviplata', 'PSE', 'Tarjeta_credito', 'Efectivo');

-- CreateEnum
CREATE TYPE "estado_pago_enum" AS ENUM ('Pendiente', 'Aprobado', 'Rechazado', 'Fallido');

-- CreateEnum
CREATE TYPE "dia_semana_enum" AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');

-- CreateTable
CREATE TABLE "tb_barberias" (
    "id_barberia" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "tb_barberias_pkey" PRIMARY KEY ("id_barberia")
);

-- CreateTable
CREATE TABLE "tb_especialidades" (
    "id_especialidad" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "tb_especialidades_pkey" PRIMARY KEY ("id_especialidad")
);

-- CreateTable
CREATE TABLE "tb_usuarios" (
    "cedula" VARCHAR(11) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "rol" "rol_usuario" NOT NULL DEFAULT 'Cliente',
    "estado" "estado_usuario" NOT NULL DEFAULT 'Activo',
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_usuarios_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "tb_barbero_detalle" (
    "cedula" VARCHAR(11) NOT NULL,
    "id_barberia" INTEGER NOT NULL,
    "id_especialidad" INTEGER,

    CONSTRAINT "tb_barbero_detalle_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "tb_servicios" (
    "id_servicio" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "precio" DECIMAL(10,2) NOT NULL,
    "duracion_minutos" INTEGER NOT NULL,
    "imagen" VARCHAR(255),
    "id_barberia" INTEGER,
    "id_especialidad" INTEGER,

    CONSTRAINT "tb_servicios_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "tb_agenda_barbero" (
    "cedula_barbero" VARCHAR(11) NOT NULL,
    "dia" "dia_semana_enum" NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,

    CONSTRAINT "tb_agenda_barbero_pkey" PRIMARY KEY ("cedula_barbero","dia")
);

-- CreateTable
CREATE TABLE "tb_citas" (
    "id_cita" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENT',
    "cedula_cliente" VARCHAR(11),
    "cedula_barbero" VARCHAR(11),
    "id_servicio" INTEGER,
    "recordatorio_enviado" BOOLEAN DEFAULT false,
    "encuesta_enviada" BOOLEAN DEFAULT false,

    CONSTRAINT "tb_citas_pkey" PRIMARY KEY ("id_cita")
);

-- CreateTable
CREATE TABLE "tb_pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_cita" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "metodo_pago" "metodo_pago_enum" NOT NULL,
    "referencia_externa" VARCHAR(255),
    "estado" "estado_pago_enum" NOT NULL DEFAULT 'Pendiente',
    "fecha_pago" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "tb_calificaciones" (
    "id_calificacion" SERIAL NOT NULL,
    "id_cita" INTEGER NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_calificaciones_pkey" PRIMARY KEY ("id_calificacion")
);

-- CreateTable
CREATE TABLE "tb_token_recuperacion" (
    "id_token" SERIAL NOT NULL,
    "usuario_id" VARCHAR(11) NOT NULL,
    "token" UUID NOT NULL,
    "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_token_recuperacion_pkey" PRIMARY KEY ("id_token")
);

-- CreateIndex
CREATE INDEX "tb_barberias_nombre_idx" ON "tb_barberias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tb_especialidades_nombre_key" ON "tb_especialidades"("nombre");

-- CreateIndex
CREATE INDEX "tb_especialidades_nombre_idx" ON "tb_especialidades"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuarios_telefono_key" ON "tb_usuarios"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuarios_email_key" ON "tb_usuarios"("email");

-- CreateIndex
CREATE INDEX "tb_usuarios_email_idx" ON "tb_usuarios"("email");

-- CreateIndex
CREATE INDEX "tb_usuarios_rol_idx" ON "tb_usuarios"("rol");

-- CreateIndex
CREATE INDEX "tb_usuarios_estado_idx" ON "tb_usuarios"("estado");

-- CreateIndex
CREATE INDEX "tb_usuarios_nombre_apellidos_idx" ON "tb_usuarios"("nombre", "apellidos");

-- CreateIndex
CREATE INDEX "tb_barbero_detalle_id_barberia_idx" ON "tb_barbero_detalle"("id_barberia");

-- CreateIndex
CREATE INDEX "tb_barbero_detalle_id_especialidad_idx" ON "tb_barbero_detalle"("id_especialidad");

-- CreateIndex
CREATE INDEX "tb_servicios_id_barberia_idx" ON "tb_servicios"("id_barberia");

-- CreateIndex
CREATE INDEX "tb_servicios_id_especialidad_idx" ON "tb_servicios"("id_especialidad");

-- CreateIndex
CREATE INDEX "tb_servicios_nombre_idx" ON "tb_servicios"("nombre");

-- CreateIndex
CREATE INDEX "tb_citas_cedula_barbero_idx" ON "tb_citas"("cedula_barbero");

-- CreateIndex
CREATE INDEX "tb_citas_cedula_cliente_idx" ON "tb_citas"("cedula_cliente");

-- CreateIndex
CREATE INDEX "tb_citas_fecha_idx" ON "tb_citas"("fecha");

-- CreateIndex
CREATE INDEX "tb_citas_estado_idx" ON "tb_citas"("estado");

-- CreateIndex
CREATE INDEX "tb_citas_fecha_cedula_barbero_idx" ON "tb_citas"("fecha", "cedula_barbero");

-- CreateIndex
CREATE UNIQUE INDEX "tb_citas_fecha_hora_cedula_barbero_key" ON "tb_citas"("fecha", "hora", "cedula_barbero");

-- CreateIndex
CREATE INDEX "tb_pagos_estado_idx" ON "tb_pagos"("estado");

-- CreateIndex
CREATE INDEX "tb_pagos_id_cita_idx" ON "tb_pagos"("id_cita");

-- CreateIndex
CREATE INDEX "tb_pagos_fecha_pago_idx" ON "tb_pagos"("fecha_pago");

-- CreateIndex
CREATE UNIQUE INDEX "tb_calificaciones_id_cita_key" ON "tb_calificaciones"("id_cita");

-- CreateIndex
CREATE INDEX "tb_calificaciones_puntuacion_idx" ON "tb_calificaciones"("puntuacion");

-- CreateIndex
CREATE INDEX "tb_calificaciones_id_cita_idx" ON "tb_calificaciones"("id_cita");

-- CreateIndex
CREATE UNIQUE INDEX "tb_token_recuperacion_token_key" ON "tb_token_recuperacion"("token");

-- CreateIndex
CREATE INDEX "tb_token_recuperacion_usuario_id_idx" ON "tb_token_recuperacion"("usuario_id");

-- CreateIndex
CREATE INDEX "tb_token_recuperacion_token_idx" ON "tb_token_recuperacion"("token");

-- CreateIndex
CREATE INDEX "tb_token_recuperacion_usado_creado_en_idx" ON "tb_token_recuperacion"("usado", "creado_en");

-- AddForeignKey
ALTER TABLE "tb_barbero_detalle" ADD CONSTRAINT "tb_barbero_detalle_cedula_fkey" FOREIGN KEY ("cedula") REFERENCES "tb_usuarios"("cedula") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_barbero_detalle" ADD CONSTRAINT "tb_barbero_detalle_id_barberia_fkey" FOREIGN KEY ("id_barberia") REFERENCES "tb_barberias"("id_barberia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_barbero_detalle" ADD CONSTRAINT "tb_barbero_detalle_id_especialidad_fkey" FOREIGN KEY ("id_especialidad") REFERENCES "tb_especialidades"("id_especialidad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_servicios" ADD CONSTRAINT "tb_servicios_id_barberia_fkey" FOREIGN KEY ("id_barberia") REFERENCES "tb_barberias"("id_barberia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_servicios" ADD CONSTRAINT "tb_servicios_id_especialidad_fkey" FOREIGN KEY ("id_especialidad") REFERENCES "tb_especialidades"("id_especialidad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_agenda_barbero" ADD CONSTRAINT "tb_agenda_barbero_cedula_barbero_fkey" FOREIGN KEY ("cedula_barbero") REFERENCES "tb_usuarios"("cedula") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_citas" ADD CONSTRAINT "tb_citas_cedula_cliente_fkey" FOREIGN KEY ("cedula_cliente") REFERENCES "tb_usuarios"("cedula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_citas" ADD CONSTRAINT "tb_citas_cedula_barbero_fkey" FOREIGN KEY ("cedula_barbero") REFERENCES "tb_usuarios"("cedula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_citas" ADD CONSTRAINT "tb_citas_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "tb_servicios"("id_servicio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pagos" ADD CONSTRAINT "tb_pagos_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "tb_citas"("id_cita") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_calificaciones" ADD CONSTRAINT "tb_calificaciones_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "tb_citas"("id_cita") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_token_recuperacion" ADD CONSTRAINT "tb_token_recuperacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuarios"("cedula") ON DELETE CASCADE ON UPDATE CASCADE;
