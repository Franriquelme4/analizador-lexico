import { NextResponse } from "next/server";
import { promises as fs } from "fs";

export const POST = async (request) => {
  const { word } = await request.json();
  const file = await fs.readFile(process.cwd() + "/data/words.json", "utf8");
  const lexicalAnalytics = JSON.parse(file);
  if (!lexicalAnalytics.hasOwnProperty(word)) {
    return NextResponse.json({
      status: "error",
      message: "La palabra/frase no existe",
    });
  }
  const words = lexicalAnalytics[word];
  return NextResponse.json({status:"ok", message: "El lexema fue eliminado correctamente", data: { word: words } });
}