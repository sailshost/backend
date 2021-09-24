/*
  Warnings:

  - A unique constraint covering the columns `[origin]` on the table `Container` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Container.origin_unique" ON "Container"("origin");
