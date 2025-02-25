-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "auth0Id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "defaultBpm" INTEGER NOT NULL DEFAULT 120,
    "metronomeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "tutorialSeen" BOOLEAN NOT NULL DEFAULT false,
    "volumeDefault" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "keyboardShortcutsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoSaveEnabled" BOOLEAN NOT NULL DEFAULT true,
    "preferredPadSize" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bpm" INTEGER NOT NULL DEFAULT 120,
    "maxUsers" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_users" (
    "sessionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'player',

    CONSTRAINT "session_users_pkey" PRIMARY KEY ("sessionId","userId")
);

-- CreateTable
CREATE TABLE "session_recordings" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "recordedBy" INTEGER NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "session_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pads" (
    "id" SERIAL NOT NULL,
    "nbKey" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "color" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "pads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pad_keys" (
    "id" SERIAL NOT NULL,
    "padId" INTEGER NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "pad_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sounds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_sounds" (
    "keyId" INTEGER NOT NULL,
    "soundId" INTEGER NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "effects" JSONB,

    CONSTRAINT "key_sounds_pkey" PRIMARY KEY ("keyId","soundId")
);

-- CreateTable
CREATE TABLE "presets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "bpm" INTEGER NOT NULL DEFAULT 120,
    "background" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preset_pads" (
    "presetId" INTEGER NOT NULL,
    "padId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "preset_pads_pkey" PRIMARY KEY ("presetId","padId")
);

-- CreateTable
CREATE TABLE "user_recordings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recordingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_users" ADD CONSTRAINT "session_users_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_users" ADD CONSTRAINT "session_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_recordings" ADD CONSTRAINT "session_recordings_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pads" ADD CONSTRAINT "pads_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pad_keys" ADD CONSTRAINT "pad_keys_padId_fkey" FOREIGN KEY ("padId") REFERENCES "pads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sounds" ADD CONSTRAINT "sounds_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_sounds" ADD CONSTRAINT "key_sounds_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "pad_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_sounds" ADD CONSTRAINT "key_sounds_soundId_fkey" FOREIGN KEY ("soundId") REFERENCES "sounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presets" ADD CONSTRAINT "presets_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preset_pads" ADD CONSTRAINT "preset_pads_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "presets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preset_pads" ADD CONSTRAINT "preset_pads_padId_fkey" FOREIGN KEY ("padId") REFERENCES "pads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_recordings" ADD CONSTRAINT "user_recordings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_recordings" ADD CONSTRAINT "user_recordings_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "session_recordings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
