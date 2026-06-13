import { NextRequest } from "next/server";
import { explainCode } from "../../utils/explainer";

export async function POST(request: NextRequest) {
  try {
    const { code, language, targetLanguage = "id" } = await request.json();

    if (!code || !language) {
      return Response.json(
        { error: "Both 'code' and 'language' are required." },
        { status: 400 }
      );
    }

    const result = await explainCode(code, language, targetLanguage);
    return Response.json(result);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[ByteMind API] Error:", errorMessage);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
