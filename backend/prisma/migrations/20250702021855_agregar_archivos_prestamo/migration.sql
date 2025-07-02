-- CreateTable
CREATE TABLE "ArchivoPrestamo" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "prestamoId" INTEGER NOT NULL,

    CONSTRAINT "ArchivoPrestamo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArchivoPrestamo" ADD CONSTRAINT "ArchivoPrestamo_prestamoId_fkey" FOREIGN KEY ("prestamoId") REFERENCES "Prestamo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
