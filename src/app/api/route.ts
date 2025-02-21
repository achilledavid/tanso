import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "BeatFlow API",
    version: "1.0.0",
    endpoints: {
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
        logout: "POST /api/auth/logout",
      },
      users: {
        list: "GET /api/users",
        create: "POST /api/users",
        get: "GET /api/users/:id",
        update: "PUT /api/users/:id",
        delete: "DELETE /api/users/:id",
      },
      sessions: {
        list: "GET /api/sessions",
        create: "POST /api/sessions",
        get: "GET /api/sessions/:id",
        update: "PUT /api/sessions/:id",
        delete: "DELETE /api/sessions/:id",
        users: {
          add: "POST /api/sessions/:id/users",
          remove: "DELETE /api/sessions/:id/users/:userId",
        },
      },
      sounds: {
        list: "GET /api/sounds",
        upload: "POST /api/sounds",
        get: "GET /api/sounds/:id",
        delete: "DELETE /api/sounds/:id",
      },
      pads: {
        list: "GET /api/pads",
        create: "POST /api/pads",
        get: "GET /api/pads/:id",
        update: "PUT /api/pads/:id",
        delete: "DELETE /api/pads/:id",
      },
      presets: {
        list: "GET /api/presets",
        create: "POST /api/presets",
        get: "GET /api/presets/:id",
        update: "PUT /api/presets/:id",
        delete: "DELETE /api/presets/:id",
      },
    },
  });
}
