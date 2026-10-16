-- CreateEnum
CREATE TYPE "ParentStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "HearingDeviceType" AS ENUM ('HEARING_AID', 'COCHLEAR_IMPLANT', 'OTHER', 'NONE', 'PREFER_NOT_TO_SAY');
CREATE TYPE "StartingAbility" AS ENUM ('STARTING_SOUND_AWARENESS', 'FREQUENT_SOUND_AWARENESS', 'EARLY_SOUND_DISCRIMINATION');
CREATE TYPE "SoundCategory" AS ENUM ('ANIMALS', 'VEHICLES', 'HOME', 'FAMILY', 'MUSIC', 'OTHER');
CREATE TYPE "Skill" AS ENUM ('SOUND_DETECTION', 'SOUND_DISCRIMINATION', 'SOUND_ASSOCIATION');
CREATE TYPE "LearningState" AS ENUM ('NOT_FOCUSED', 'EXPLORING', 'PRACTICING', 'BECOMING_CONSISTENT');
CREATE TYPE "StimulusType" AS ENUM ('ENVIRONMENTAL_SOUND', 'ANIMAL_SOUND', 'HOUSEHOLD_SOUND', 'MUSICAL_SOUND', 'EARLY_SPEECH_SOUND');
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE');
CREATE TYPE "ContrastLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'INCOMPLETE');
CREATE TYPE "TrialType" AS ENUM ('DETECTION_SOUND', 'DETECTION_SILENT', 'DISCRIMINATION', 'ASSOCIATION');
CREATE TYPE "DiscriminationRelation" AS ENUM ('SAME', 'DIFFERENT');
CREATE TYPE "TrialResultType" AS ENUM ('INDEPENDENT_RESPONSE', 'PROMPTED_RESPONSE', 'NO_RESPONSE', 'FALSE_RESPONSE', 'TECHNICAL_ERROR');
CREATE TYPE "ParentObservationType" AS ENUM ('OFTEN_RESPONDED_INDEPENDENTLY', 'RESPONDED_AFTER_REPETITION', 'NEEDED_FREQUENT_ASSISTANCE', 'DIFFICULTY_MAINTAINING_ATTENTION');

-- CreateTable
CREATE TABLE "Parent" ("id" UUID NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "status" "ParentStatus" NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Parent_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AuthSession" ("id" UUID NOT NULL, "parentId" UUID NOT NULL, "tokenHash" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Child" ("id" UUID NOT NULL, "parentId" UUID NOT NULL, "nickname" TEXT NOT NULL, "birthYear" INTEGER NOT NULL, "hearingDeviceType" "HearingDeviceType" NOT NULL, "startingAbility" "StartingAbility" NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Child_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ChildFamiliarSoundCategory" ("id" UUID NOT NULL, "childId" UUID NOT NULL, "category" "SoundCategory" NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ChildFamiliarSoundCategory_pkey" PRIMARY KEY ("id"));
CREATE TABLE "LearningProgress" ("id" UUID NOT NULL, "childId" UUID NOT NULL, "skill" "Skill" NOT NULL, "state" "LearningState" NOT NULL, "recentValidTrials" INTEGER NOT NULL DEFAULT 0, "independentResponses" INTEGER NOT NULL DEFAULT 0, "promptedResponses" INTEGER NOT NULL DEFAULT 0, "noResponses" INTEGER NOT NULL DEFAULT 0, "falseResponses" INTEGER NOT NULL DEFAULT 0, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "LearningProgress_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ProgressHistory" ("id" UUID NOT NULL, "childId" UUID NOT NULL, "skill" "Skill" NOT NULL, "previousState" "LearningState", "newState" "LearningState" NOT NULL, "independentRate" DECIMAL(5,4), "validTrialCount" INTEGER NOT NULL, "triggerSessionId" UUID, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ProgressHistory_pkey" PRIMARY KEY ("id"));
CREATE TABLE "VisualAsset" ("id" UUID NOT NULL, "name" TEXT NOT NULL, "assetPath" TEXT NOT NULL, "category" "SoundCategory" NOT NULL, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "VisualAsset_pkey" PRIMARY KEY ("id"));
CREATE TABLE "LearningStimulus" ("id" UUID NOT NULL, "name" TEXT NOT NULL, "assetPath" TEXT NOT NULL, "stimulusType" "StimulusType" NOT NULL, "category" "SoundCategory" NOT NULL, "difficulty" "Difficulty" NOT NULL, "durationMs" INTEGER, "isActive" BOOLEAN NOT NULL DEFAULT true, "correctVisualAssetId" UUID, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "LearningStimulus_pkey" PRIMARY KEY ("id"));
CREATE TABLE "StimulusContrast" ("id" UUID NOT NULL, "stimulusAId" UUID NOT NULL, "stimulusBId" UUID NOT NULL, "contrastLevel" "ContrastLevel" NOT NULL, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "StimulusContrast_pkey" PRIMARY KEY ("id"));
CREATE TABLE "LearningSession" ("id" UUID NOT NULL, "childId" UUID NOT NULL, "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS', "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "completedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "LearningSession_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SessionActivity" ("id" UUID NOT NULL, "sessionId" UUID NOT NULL, "skill" "Skill" NOT NULL, "sequence" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SessionActivity_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Trial" ("id" UUID NOT NULL, "activityId" UUID NOT NULL, "sequence" INTEGER NOT NULL, "trialType" "TrialType" NOT NULL, "stimulusId" UUID, "stimulusBId" UUID, "discriminationRelation" "DiscriminationRelation", "correctOptionId" UUID, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Trial_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AssociationOption" ("id" UUID NOT NULL, "trialId" UUID NOT NULL, "visualAssetId" UUID NOT NULL, "sequence" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AssociationOption_pkey" PRIMARY KEY ("id"));
CREATE TABLE "TrialResult" ("id" UUID NOT NULL, "trialId" UUID NOT NULL, "resultType" "TrialResultType" NOT NULL, "responded" BOOLEAN, "promptLevel" INTEGER, "selectedOptionId" UUID, "selectedRelation" "DiscriminationRelation", "isCorrect" BOOLEAN, "responseTimeMs" INTEGER, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "TrialResult_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ParentObservation" ("id" UUID NOT NULL, "sessionId" UUID NOT NULL, "observationType" "ParentObservationType" NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ParentObservation_pkey" PRIMARY KEY ("id"));

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");
CREATE INDEX "AuthSession_parentId_expiresAt_idx" ON "AuthSession"("parentId", "expiresAt");
CREATE INDEX "Child_parentId_idx" ON "Child"("parentId");
CREATE UNIQUE INDEX "ChildFamiliarSoundCategory_childId_category_key" ON "ChildFamiliarSoundCategory"("childId", "category");
CREATE UNIQUE INDEX "LearningProgress_childId_skill_key" ON "LearningProgress"("childId", "skill");
CREATE INDEX "ProgressHistory_childId_skill_createdAt_idx" ON "ProgressHistory"("childId", "skill", "createdAt");
CREATE INDEX "VisualAsset_category_isActive_idx" ON "VisualAsset"("category", "isActive");
CREATE INDEX "LearningStimulus_category_difficulty_isActive_idx" ON "LearningStimulus"("category", "difficulty", "isActive");
CREATE UNIQUE INDEX "StimulusContrast_stimulusAId_stimulusBId_key" ON "StimulusContrast"("stimulusAId", "stimulusBId");
CREATE INDEX "StimulusContrast_contrastLevel_isActive_idx" ON "StimulusContrast"("contrastLevel", "isActive");
CREATE INDEX "LearningSession_childId_startedAt_idx" ON "LearningSession"("childId", "startedAt");
CREATE INDEX "LearningSession_childId_status_idx" ON "LearningSession"("childId", "status");
CREATE UNIQUE INDEX "SessionActivity_sessionId_sequence_key" ON "SessionActivity"("sessionId", "sequence");
CREATE INDEX "SessionActivity_sessionId_idx" ON "SessionActivity"("sessionId");
CREATE UNIQUE INDEX "Trial_activityId_sequence_key" ON "Trial"("activityId", "sequence");
CREATE INDEX "Trial_activityId_idx" ON "Trial"("activityId");
CREATE UNIQUE INDEX "AssociationOption_trialId_visualAssetId_key" ON "AssociationOption"("trialId", "visualAssetId");
CREATE UNIQUE INDEX "AssociationOption_trialId_sequence_key" ON "AssociationOption"("trialId", "sequence");
CREATE UNIQUE INDEX "TrialResult_trialId_key" ON "TrialResult"("trialId");
CREATE INDEX "TrialResult_createdAt_idx" ON "TrialResult"("createdAt");
CREATE UNIQUE INDEX "ParentObservation_sessionId_key" ON "ParentObservation"("sessionId");

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChildFamiliarSoundCategory" ADD CONSTRAINT "ChildFamiliarSoundCategory_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProgressHistory" ADD CONSTRAINT "ProgressHistory_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningStimulus" ADD CONSTRAINT "LearningStimulus_correctVisualAssetId_fkey" FOREIGN KEY ("correctVisualAssetId") REFERENCES "VisualAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StimulusContrast" ADD CONSTRAINT "StimulusContrast_stimulusAId_fkey" FOREIGN KEY ("stimulusAId") REFERENCES "LearningStimulus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StimulusContrast" ADD CONSTRAINT "StimulusContrast_stimulusBId_fkey" FOREIGN KEY ("stimulusBId") REFERENCES "LearningStimulus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SessionActivity" ADD CONSTRAINT "SessionActivity_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LearningSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "SessionActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_stimulusId_fkey" FOREIGN KEY ("stimulusId") REFERENCES "LearningStimulus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_stimulusBId_fkey" FOREIGN KEY ("stimulusBId") REFERENCES "LearningStimulus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AssociationOption" ADD CONSTRAINT "AssociationOption_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "Trial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AssociationOption" ADD CONSTRAINT "AssociationOption_visualAssetId_fkey" FOREIGN KEY ("visualAssetId") REFERENCES "VisualAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TrialResult" ADD CONSTRAINT "TrialResult_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "Trial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ParentObservation" ADD CONSTRAINT "ParentObservation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LearningSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
