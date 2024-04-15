-- CreateTable
CREATE TABLE "ColorSwatch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ColorSwatch_pkey" PRIMARY KEY ("id")
);
