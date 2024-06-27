import { NextResponse } from "next/server";
import { promises as fs } from "fs";
export const GET = async (params) => {
  const file = await fs.readFile(process.cwd() + "/data/words.json", "utf8");
  const lexema = Object.entries(JSON.parse(file));
  const positive = [];
  const negative = [];
  const neutral = [];
  const compound = [];
  lexema.map((word) => {
    if (word[1].compound === "true") {
      compound.push(word);
    } else if (word[1].qualification === "BUENA") {
      positive.push(word);
    } else if (word[1].qualification === "MALA") {
      negative.push(word);
    } else {
      neutral.push(word);
    }
  });
  const response = {
    positive,
    negative,
    neutral,
    compound,
  };
  // Filtar objeto por el valor, no es un array
  return NextResponse.json({ message: "ok", data: { response } });
};

export const POST = async (request) => {
  const { word, level, type } = await request.json();
  console.log(word, level, type);
  const wordNormalize = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
  const file = await fs.readFile(process.cwd() + "/data/words.json", "utf8");
  const lexicalAnalytics = JSON.parse(file);
  if (lexicalAnalytics.hasOwnProperty(wordNormalize.replace(/\s+/g, '_'))) {
    return NextResponse.json({
      status: "error",
      message: "La palabra/frase ya existe",
      data: { response: lexicalAnalytics[wordNormalize] },
    });
  }
  const esCompuesto = /\s/;
  const newLexema = { word: wordNormalize,qualification: level};
  if (esCompuesto.test(wordNormalize)) {
    newLexema.compound = "true";
    // Actualizar listado de palabras compuestas
    const fileCompound = await fs.readFile(process.cwd() + "/data/compoundWords.json", "utf8");
    const compoundWords = JSON.parse(fileCompound);
    compoundWords.push(wordNormalize);
    await fs.writeFile(
      process.cwd() + "/data/compoundWords.json",
      JSON.stringify(compoundWords)
    );
  } else {
    newLexema.compound = "false";
  }

  if (type === "otro") {
    switch (level) {
      case 'BUENA':
        newLexema.type = "POSITIVO";
      break;
      case 'MALA':
        newLexema.type = "NEGATIVO";
      break;
      default:
        newLexema.type = "NEUTRO";
    }
  }else{
    newLexema.type = type;
  }
  lexicalAnalytics[wordNormalize.replace(/\s+/g, '_')] = newLexema;
  await fs.writeFile(
    process.cwd() + "/data/words.json",
    JSON.stringify(lexicalAnalytics)
  );
  return NextResponse.json({status:"ok", message: "El nuevo lexema fue agregado correctamente", data: { response: lexicalAnalytics } });
};


export const PUT = async (request) => {
  const { word, level, type } = await request.json();
  const wordNormalize = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
  const file = await fs.readFile(process.cwd() + "/data/words.json", "utf8");
  const lexicalAnalytics = JSON.parse(file);
  if (!lexicalAnalytics.hasOwnProperty(wordNormalize.replace(/\s+/g, '_'))) {
    return NextResponse.json({
      status: "error",
      message: "La palabra/frase no existe",
    });
  }
  const esCompuesto = /\s/;
  const newLexema = { word: wordNormalize,qualification: level};
  if (esCompuesto.test(wordNormalize)) {
    newLexema.compound = "true";
    // Actualizar listado de palabras compuestas
    const fileCompound = await fs.readFile(process.cwd() + "/data/compoundWords.json", "utf8");
    const compoundWords = JSON.parse(fileCompound);
    compoundWords.push(wordNormalize);
    await fs.writeFile(
      process.cwd() + "/data/compoundWords.json",
      JSON.stringify(compoundWords)
    );
  } else {
    newLexema.compound = "false";
  }
  if (type === "otro") {
    switch (level) {
      case 'BUENA':
        newLexema.type = "POSITIVO";
      break;
      case 'MALA':
        newLexema.type = "NEGATIVO";
      break;
      default:
        newLexema.type = "NEUTRO";
    }
  }else{
    newLexema.type = type;
  }
  lexicalAnalytics[wordNormalize.replace(/\s+/g, '_')] = newLexema;
  await fs.writeFile(
    process.cwd() + "/data/words.json",
    JSON.stringify(lexicalAnalytics)
  );
  return NextResponse.json({status:"ok", message: "El lexema fue actualizado correctamente", data: { response: lexicalAnalytics } });
}

export const DELETE = async (request) => {
  const { word } = await request.json();
  const wordNormalize = word;
  const file = await fs.readFile(process.cwd() + "/data/words.json", "utf8");
  const lexicalAnalytics = JSON.parse(file);
  if (!lexicalAnalytics.hasOwnProperty(wordNormalize.replace(/\s+/g, '_'))) {
    return NextResponse.json({
      status: "error",
      message: "La palabra/frase no existe",
    });
  }
  delete lexicalAnalytics[wordNormalize];
  await fs.writeFile(
    process.cwd() + "/data/words.json",
    JSON.stringify(lexicalAnalytics)
  );

  // eliminar tambien de palabras compuestas
  const fileCompound = await fs.readFile(process.cwd() + "/data/compoundWords.json", "utf8");
  const compoundWords = JSON.parse(fileCompound);
  const index = compoundWords.indexOf(wordNormalize);
  console.log(wordNormalize, index);
  let newArray = compoundWords.filter(word => word !== wordNormalize.replace('_',' '));

  console.log(newArray);

  await fs.writeFile(
    process.cwd() + "/data/compoundWords.json",
    JSON.stringify(newArray)
  );
  
  return NextResponse.json({status:"ok", message: "El lexema fue eliminado correctamente", data: { response: lexicalAnalytics } });
}