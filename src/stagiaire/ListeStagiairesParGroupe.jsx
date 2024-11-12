import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'; 

function ListeStagiairesParGroupe() {
  const [stagiaires, setStagiaires] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        const response = await fetch('http://localhost:5001/stagiaires');
        if (!response.ok) {
          throw new Error(`Erreur réseau : ${response.status}`);
        }
        const data = await response.json();
        setStagiaires(Array.isArray(data) ? data : data.stagiaires || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Impossible de récupérer les données. Vérifiez l'API.");
        setStagiaires([]);
      }
    };

    fetchStagiaires();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des Stagiaires", 10, 10);
    stagiaires.forEach((stagiaire, index) => {
      doc.text(
        `${stagiaire.cef} - ${stagiaire.nom} ${stagiaire.prenom} - ${stagiaire.email}`,
        10,
        20 + index * 10
      );
    });
    doc.save('stagiaires.pdf');
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stagiaires);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stagiaires');
    XLSX.writeFile(wb, 'stagiaires.xlsx');
  };

  return (
    <div className="container mx-auto mt-8 p-4" style={{ fontFamily: 'Georgia, serif'}}>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-bold text-gray-800">Liste des Stagiaires</h5>
        <div className="flex space-x-2"> 
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center space-x-2"
            onClick={handleDownloadPDF}>
            <FaFilePdf /> 
            <span>Download PDF</span>
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2"
            onClick={handleDownloadExcel}>
            <FaFileExcel /> 
            <span>Download Excel</span>
          </button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      <div className="overflow-x-auto shadow-2xl rounded-lg border-2 border-gray-200">
        <Table bordered hover responsive className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-teal-400 to-teal-600 text-white">
            <tr>
              <th className="px-6 py-3 font-semibold">Cef</th>
              <th className="px-6 py-3 font-semibold">Nom</th>
              <th className="px-6 py-3 font-semibold">Prénom</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Année</th>
              <th className="px-6 py-3 font-semibold">Niveau</th>
            </tr>
          </thead>
          <tbody>
            {stagiaires.length > 0 ? (
              stagiaires.map((stagiaire) => (
                <tr key={stagiaire.cef} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{stagiaire.cef}</td>
                  <td className="px-6 py-3">{stagiaire.nom}</td>
                  <td className="px-6 py-3">{stagiaire.prenom}</td>
                  <td className="px-6 py-3">{stagiaire.email}</td>
                  <td className="px-6 py-3">{stagiaire.annee}</td>
                  <td className="px-6 py-3">{stagiaire.niveau}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  {error ? 'Erreur lors de la récupération des données' : 'Aucun stagiaire trouvé.'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ListeStagiairesParGroupe;
