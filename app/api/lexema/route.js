import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
export const GET = async (params) => {
    const file = await fs.readFile(process.cwd() + '/data/words.json', 'utf8');
    const lexicalAnalytics = JSON.parse(file);
    // Filtar objeto por el valor, no es un array
    const bueno = Object.keys(lexicalAnalytics).filter(word => lexicalAnalytics[word] === "buena");
    const malo = Object.keys(lexicalAnalytics).filter(word => lexicalAnalytics[word] === "mala");
    const neutro = Object.keys(lexicalAnalytics).filter(word => lexicalAnalytics[word] === "neutro");
    return NextResponse.json({ message: "ok", data: {bueno,malo,neutro} });
  };