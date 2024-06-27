import { NextResponse } from "next/server";
import { cleanText, processData } from "@/app/lib/wordsUtils";


export const POST = async (request) => {
  const { fileClient, fileOfficer } = await request.json();
  const clientWords = await cleanText(fileClient);
  const officerWords = await cleanText(fileOfficer);

  console.log(clientWords);
  console.log(officerWords);


  const {officer,client,newWords} = await processData(officerWords, clientWords);

  console.log(officer);
  console.log(client);
  console.log(newWords);

  const officerResponse = {
    cumple:false,
    mensaje:""
  }

  if(officer.greeting.length > 0 && officer.farewell.length > 0 && officer.id.length > 0){
    officerResponse.cumple = true;
    officerResponse.mensaje = "El funcionario cumple con las palabras de saludo, despedida e identificación ";
  }else{
    // Verificar cual es el que tiene 0
    if(officer.greeting.length == 0){
      officerResponse.mensaje = "El cliente no cumple con las palabras de saludo";
    }else if(officer.farewell.length == 0){
      officerResponse.mensaje = "El cliente no cumple con las palabras de despedida";
    }else if(officer.id.length == 0){
      officerResponse.mensaje = "El cliente no cumple con las palabras de identificación";
      }
  }

  const negativeL = client.negative.length;
  const positiveL = client.positive.length;


  const clientResponse = {
    buenas:client.positive,
    malas:client.negative,
    mensaje: positiveL > negativeL ? "La experiencia del cliente es positiva ✅" : "La experiencia del cliente es negativa ❌"
  }

  if(positiveL == negativeL) clientResponse.mensaje = "La experiencia del cliente es neutral 🟡";

  const processDataResponse = {
    officer: officerResponse,
    client: clientResponse,
    newWords: newWords
  }
  return NextResponse.json({ message: "Procesamiento terminado", data: processDataResponse});
};



