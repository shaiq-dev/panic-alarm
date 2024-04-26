-- CreateTable
CREATE TABLE "Notifier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "watchAssociationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifier" ADD CONSTRAINT "Notifier_watchAssociationId_fkey" FOREIGN KEY ("watchAssociationId") REFERENCES "WatchAssociation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
