import React, { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext'; 
import './Documents.css';

interface Document {
  id: number;
  title: string;
  department_id: number;
  department: string;
  uploaded_by: number;
  uploadDate: string;
  doc_type: string;
}

const DocumentList: React.FC = () => {
  const { token } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("No estás autenticado");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/documents/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al cargar documentos");

        const data = await res.json();
        setDocuments(data.documents);
      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [token]);

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment === '' || doc.department === filterDepartment) &&
      (filterType === '' || doc.doc_type === filterType)
  );

  return (
    <div className="document-list-page container">
      <h1 className="page-title">Gestión de Documentos</h1>

      <div className="filters-section card">
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="select-input"
        >
          <option value="">Todos los Departamentos</option>
          <option value="Legal">Legal</option>
          <option value="Finanzas">Finanzas</option>
          <option value="Operaciones">Operaciones</option>
          <option value="Compras">Compras</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="select-input"
        >
          <option value="">Todos los Tipos</option>
          <option value="Contrato">Contrato</option>
          <option value="Informe">Informe</option>
          <option value="Manual">Manual</option>
          <option value="Factura">Factura</option>
          <option value="Política">Política</option>
        </select>
        <Button onClick={() => { setSearchTerm(''); setFilterDepartment(''); setFilterType(''); }}>
          Limpiar Filtros
        </Button>
      </div>

      <div className="document-actions card">
        <Button>Subir Nuevo Documento</Button>
      </div>

      {loading ? (
        <p className="loading-message">Cargando documentos...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="document-table-container card">
          {filteredDocuments.length === 0 ? (
            <p className="no-results-message">No se encontraron documentos.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Departamento</th>
                  <th>Fecha de Subida</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.title}</td>
                    <td>{doc.department}</td>
                    <td>{doc.uploadDate}</td>
                    <td>{doc.doc_type}</td>
                    <td>
                      <Button variant="secondary" style={{ marginRight: '10px' }}>Ver</Button>
                      <Button variant="danger">Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
