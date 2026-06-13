
export async function GET() {
  return Response.json({
    status: "ok",
    mode: process.env.GEMINI_API_KEY ? "live" : "simulation",
  });
}
