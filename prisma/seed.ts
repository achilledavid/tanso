import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Création d'utilisateurs tests
  const user1 = await prisma.user.create({
    data: {
      auth0Id: "auth0|testuser1",
      username: "testuser1",
      email: "test1@example.com",
      profile: {
        create: {
          language: "fr",
          theme: "dark",
          defaultBpm: 120,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      auth0Id: "auth0|testuser2",
      username: "testuser2",
      email: "test2@example.com",
      profile: {
        create: {
          language: "en",
          theme: "light",
          defaultBpm: 100,
        },
      },
    },
  });

  // Création d'une session test
  const session = await prisma.session.create({
    data: {
      name: "Test Session",
      createdBy: user1.id,
      bpm: 120,
      users: {
        create: [
          {
            userId: user1.id,
            role: "admin",
          },
          {
            userId: user2.id,
            role: "player",
          },
        ],
      },
    },
  });

  // Création de sons tests
  const sound1 = await prisma.sound.create({
    data: {
      name: "Kick",
      url: "/sounds/kick.wav",
      createdBy: user1.id,
    },
  });

  const sound2 = await prisma.sound.create({
    data: {
      name: "Snare",
      url: "/sounds/snare.wav",
      createdBy: user1.id,
    },
  });

  // Création d'un pad test
  const pad = await prisma.pad.create({
    data: {
      name: "Drum Pad",
      nbKey: 4,
      sessionId: session.id,
      color: "#FF0000",
      createdBy: user1.id,
      keys: {
        create: [
          {
            positionX: 0,
            positionY: 0,
            type: "touch",
            color: "#FF0000",
            sounds: {
              create: {
                soundId: sound1.id,
                volume: 1.0,
                effects: { reverb: 0.5 },
              },
            },
          },
          {
            positionX: 1,
            positionY: 0,
            type: "touch",
            color: "#00FF00",
            sounds: {
              create: {
                soundId: sound2.id,
                volume: 0.8,
                effects: { delay: 0.3 },
              },
            },
          },
        ],
      },
    },
  });

  // Création d'un preset test
  const preset = await prisma.preset.create({
    data: {
      name: "Basic Drums",
      createdBy: user1.id,
      bpm: 120,
      pads: {
        create: {
          padId: pad.id,
          position: 0,
        },
      },
    },
  });

  console.log({
    users: [user1, user2],
    session,
    sounds: [sound1, sound2],
    pad,
    preset,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
