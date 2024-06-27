'use client'
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'

const NuevaPalabra = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    word: '',
    level: '',
    type: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.level == "" || formData.word == "" || formData.type == "") {
      alert(`Existen campos vacios`);
    }
    const response = await fetch('/api/lexema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (responseBody.status === "ok") {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: responseBody.message,
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        router.push('/analizador');
    }, 1000);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: responseBody.message,
        footer: '<a href="/analizador">Verificar en el listado de lexemas</a>'
      });
    }

  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold mb-2">Nueva Palabra</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file1">
              Palabra o frase <span className="font-bold">Ejemplo:'Buenos dias'</span>
            </label>
            <input
              value={formData.word}
              onChange={handleChange}
              type="text"
              id="word"
              name="word"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="select1">
              Seleccione nivel
            </label>
            <select
              id="select1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.level}
              onChange={handleChange}
              name="level"

            >
              <option value="">Seleccione...</option>
              <option value="BUENA">POSITIVO</option>
              <option value="MALA">NEGATIVO</option>
              <option value="NEUTRO">NEUTRO</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="radio-group">
              Seleccionar grupo de la palabra
            </label>
            <div id="radio-group" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <div className="flex items-center mb-2">
                <input
                  checked={formData.type === 'SALUDO'}
                  onChange={handleChange}
                  type="radio"
                  id="SALUDO"
                  name="type"
                  className="mr-2 leading-tight"
                  value="SALUDO"
                />
                <label className="text-sm text-gray-700" htmlFor="option1">
                  SALUDO
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  checked={formData.type === 'DESPEDIDA'}
                  onChange={handleChange}
                  type="radio"
                  id="DESPEDIDA"
                  value="DESPEDIDA"
                  name="type"
                  className="mr-2 leading-tight"
                />
                <label className="text-sm text-gray-700" htmlFor="option2">
                  DESPEDIDA
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  checked={formData.type === 'IDENTIFICACION'}
                  onChange={handleChange}
                  type="radio"
                  id="IDENTIFICACION"
                  value="IDENTIFICACION"
                  name="type"
                  className="mr-2 leading-tight"
                />
                <label className="text-sm text-gray-700" htmlFor="option2">
                IDENTIFICACION
                </label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  checked={formData.type === 'otro'}
                  onChange={handleChange}
                  type="radio"
                  id="otro"
                  name="type"
                  value="otro"
                  className="mr-2 leading-tight"
                />
                <label className="text-sm text-gray-700" htmlFor="option3">
                  OTRO
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="bg-red-600 border-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-1"
            >
              <Link  href="/analizador">Atras</Link>
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NuevaPalabra