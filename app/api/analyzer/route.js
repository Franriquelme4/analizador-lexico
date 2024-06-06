import { NextResponse } from "next/server";
import fsPromises from "fs/promises";
import path from "path";
import { cleanText, processData } from "@/app/lib/wordsUtils";

const dataFilePath = path.join(process.cwd(), "data/userData.json");

export const GET = async (params) => {
  return NextResponse.json({ message: "Hello World" });
};

export const POST = async (request) => {
  const { fileClient, fileOfficer } = await request.json();
  const clientWords = await cleanText(fileClient);
  const officerWords = await cleanText(fileOfficer);
  console.log("Cliente => ",clientWords);
    console.log("office -> " ,officerWords);

const processDataResponse = await processData(officerWords, clientWords);


  // const jsonData = JSON.stringify(words);
  // await fsPromises.writeFile(dataFilePath, jsonData);
  return NextResponse.json({ message: "Hello World", data: processDataResponse});
};



