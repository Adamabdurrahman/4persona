-- CreateEnum
CREATE TYPE "ElementType" AS ENUM ('API', 'AIR', 'ANGIN', 'TANAH');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "googleId" TEXT,
    "password" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "element" "ElementType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "targetType" "ElementType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scoreApi" INTEGER NOT NULL DEFAULT 0,
    "scoreAir" INTEGER NOT NULL DEFAULT 0,
    "scoreAngin" INTEGER NOT NULL DEFAULT 0,
    "scoreTanah" INTEGER NOT NULL DEFAULT 0,
    "personaPrimer" "ElementType" NOT NULL,
    "personaSekunder" "ElementType" NOT NULL,
    "surveySource" TEXT NOT NULL,
    "surveyRelate" TEXT,
    "feedbackRating" INTEGER,
    "feedbackText" TEXT,
    "reportToken" TEXT NOT NULL,
    "reportTokenExp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_metrics" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "manualSalesCount" INTEGER NOT NULL DEFAULT 0,
    "totalVisitors" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "system_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_templates" (
    "id" "ElementType" NOT NULL,
    "parfumName" TEXT NOT NULL,
    "descriptionPlus" TEXT NOT NULL,
    "descriptionMinus" TEXT NOT NULL,
    "backgroundImage" TEXT NOT NULL DEFAULT '',
    "shopeeLink" TEXT,
    "tiktokLink" TEXT,
    "instagramLink" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "test_results_reportToken_key" ON "test_results"("reportToken");

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
