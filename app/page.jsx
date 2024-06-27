"use client"

import { useState } from "react";
import Link from "next/link"

const HomePage = () => {
  const [fileOfficer, setFileOfficer] = useState(null);
  const [fileClient, setFileClient] = useState(null);
  const [result,setresult] = useState({});
  const [mostrarResultado,setMostrarResultado] = useState(false);

  const handleFileOfficerChange = (e) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      setFileOfficer(text);
    };
    reader.readAsText(file);
  }

  const handleFileClientChange = (e) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      setFileClient(text);
    };

    reader.readAsText(file);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fileClient || !fileOfficer) return;
    const response = await fetch('/api/analyzer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileClient, fileOfficer }),
    });

    const bodyresponse = await response.json()
    console.log(bodyresponse);
    setresult(bodyresponse.data);
    setMostrarResultado(true);
  };

  return (
    <div className=" mx-auto bg-white rounded-lg overflow-hidden">
      <hr></hr>
      <div className="mt-3">
        <h2 className="text-xl font-bold mb-2">Subir Archivos</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file1">
                Archivo Funcionario
              </label>
              <input
                type="file"
                id="file1"
                accept=".txt"
                onChange={handleFileOfficerChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file2">
                Archivo Cliente
              </label>
              <input
                type="file"
                id="file2"
                accept=".txt"
                onChange={handleFileClientChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Procesar
              </button>
            </div>
          </div>

        </form>
      </div>
      <hr />
      {mostrarResultado ?  <div className="bg-white p-6 rounded-lg border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados</h2>
        <ol className=" list-inside space-y-2">
          <li>
            <span className="font-semibold">Experiencia de atención:</span>
            <ul className="list-disc list-inside pl-4 space-y-1">
            <li>{result.officer?.cumple ? "Experiencia cumplida ✅" : "Experiencia no cumplida ❌"}</li>
              <li>{result.officer?.mensaje}</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">Experiencia del cliente:</span>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li> <span>{result.client?.mensaje}</span> </li>
              <li><strong>Malas Palabras: </strong> <span>{result.client?.malas.join(', ')}</span> </li>
              <li><strong>Buenas Palabras: </strong> <span>{result.client?.buenas.join(', ')}</span> </li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">Listado de nuevas palabras</span>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Nuevas Palabras : </strong> <span>{result.newWords?.join(', ')}</span> </li>
              {  result.newWords?.length > 0  &&  <button className="bg-blue-500 hover:bg-blue-700 font-bold text-white rounded p-1"><Link href="/analizador">Ver Palabras</Link></button>  }
            </ul>
          </li>
        </ol>
      </div> : <span></span>}
      <hr />
    </div>
  );
}

export default HomePage