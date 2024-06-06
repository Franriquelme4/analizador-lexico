"use client"

import { useState } from "react";

const HomePage = () => {
  const [fileOfficer,setFileOfficer] = useState(null);
  const [fileClient,setFileClient] = useState(null);

  const handleFileOfficerChange = (e)=>{
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      setFileOfficer(text);
    };
    reader.readAsText(file);
  }

  const handleFileClientChange = (e)=>{
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
      body: JSON.stringify({fileClient,fileOfficer}),
    });

    console.log(await response.json());
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold mb-2">Subir Archivos</h2>
        <form onSubmit={handleSubmit}>
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomePage