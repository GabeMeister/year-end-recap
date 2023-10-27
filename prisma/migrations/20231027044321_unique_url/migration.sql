/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `repos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "repos_url_key" ON "repos"("url");
