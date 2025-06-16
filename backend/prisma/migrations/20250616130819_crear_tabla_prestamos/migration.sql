-- CreateTable
CREATE TABLE "Prestamo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "plazo" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
