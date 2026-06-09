-- CreateIndex
CREATE INDEX "answer_options_questionId_idx" ON "answer_options"("questionId");

-- CreateIndex
CREATE INDEX "questions_element_isActive_idx" ON "questions"("element", "isActive");

-- CreateIndex
CREATE INDEX "test_results_userId_idx" ON "test_results"("userId");

-- CreateIndex
CREATE INDEX "test_results_personaPrimer_idx" ON "test_results"("personaPrimer");
