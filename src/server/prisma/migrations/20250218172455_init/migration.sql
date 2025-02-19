-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEW', 'PROCESSING', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "httpCode" INTEGER,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
