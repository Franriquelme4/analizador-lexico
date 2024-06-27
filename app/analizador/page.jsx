
"use client"

import TableWords from "@/components/TableWords";
import Link from "next/link"
import { useEffect, useState } from "react";


const AnalizadorPage = () => {

  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchLexema = async () => {
      try {
        // Obtener los datos del cliente
        let response = await fetch('/api/lexema', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const value = await response.json();
        // Actualizar el estado con los datos del cliente
        setWords(value.data.response);
      } catch (error) {
        console.error("Error al obtener los datos del cliente:", error);
      }
    };
    fetchLexema();
  }, [])


  return (
    <div className="mt-8 ">
      <div className="flex justify-between my-2">
        <h1 className="text-3xl font-bold ">Lexemas</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/palabra/nuevo">Agregar nueva palabra</Link></button>
      </div>
      <hr></hr>

      <div className="mt-2">
        <h1 className="text-2xl font-bold mb-4">Neutrales</h1>
        <TableWords data={words.neutral} />
      </div>
      
      <div className="mt-2">
        <h1 className="text-2xl font-bold mb-4">Compuestas</h1>
        <TableWords data={words.compound} />
      </div>

      <div className="mt-2">
        <h1 className="text-2xl font-bold mb-4">Positivas</h1>
        <TableWords data={words.positive} />
      </div>


      <div className="mt-2">
        <h1 className="text-2xl font-bold mb-4">Negativas</h1>
        <TableWords data={words.negative} />
      </div>

    </div>


  )
}

export default AnalizadorPage