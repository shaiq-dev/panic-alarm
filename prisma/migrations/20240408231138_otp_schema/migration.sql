-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "validationId" TEXT NOT NULL,
    "validationPayload" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "resends" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_validationId_key" ON "Otp"("validationId");
