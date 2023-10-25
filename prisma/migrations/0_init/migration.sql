-- CreateTable
CREATE TABLE "repos" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "url" TEXT,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "data" JSON,

    CONSTRAINT "repos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signups" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "signup_datetime" DATE,

    CONSTRAINT "signups_pkey" PRIMARY KEY ("id")
);

