import React, { useState, useEffect } from 'react';
import Input from  '../../components/Input';
import Button from '../../components/Button';
import './Documents.css';

interface Document {
  id: string;
  name: string;
  department: string;
  uploadDate: string;
  type: string;
}

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    // Simular carga de documentos
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dummyDocuments: Document[] = [
          { id: '1', name: 'Contrato A.pdf', department: 'Legal', uploadDate: '2023-10-26', type: 'Contrato' },
          { id: '2', name: 'Informe Q3.pdf', department: 'Finanzas', uploadDate: '2023-09-15', type: 'Informe' },
          { id: '3', name: 'Manual Operaciones.pdf', department: 'Operaciones', uploadDate: '2023-08-01', type: 'Manual' },
          { id: '4', name: 'Factura Proveedor.pdf', department: 'Compras', uploadDate: '2023-10-20', type: 'Factura' },
          { id: '5', name: 'Política Privacidad.pdf', department: 'Legal', uploadDate: '2023-10-05', type: 'Política' },
          { id: '6', name: 'Reporte Anual.pdf', department: 'Finanzas', uploadDate: '2023-07-01', type: 'Informe' },
        ];
        setDocuments(dummyDocuments);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Error al cargar los documentos.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === '' || doc.department === filterDepartment) &&
    (filterType === '' || doc.type === filterType)
  );

  return (
    <div className="document-list-page container">
      <h1 className="page-title">Gestión de Documentos</h1>

      <div className="filters-section card">
        <div className="filter-group">
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="select-input"
          >
            <option value="">Todos los Departamentos</option>
            {/* Aquí deberías cargar los departamentos dinámicamente de tu API */}
            <option value="Legal">Legal</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Operaciones">Operaciones</option>
            <option value="Compras">Compras</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select-input"
          >
            <option value="">Todos los Tipos</option>
            {/* Aquí deberías cargar los tipos de documento dinámicamente */}
            <option value="Contrato">Contrato</option>
            <option value="Informe">Informe</option>
            <option value="Manual">Manual</option>
            <option value="Factura">Factura</option>
            <option value="Política">Política</option>
          </select>
        </div>
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
                {filteredDocuments.map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.name}</td>
                    <td>{doc.department}</td>
                    <td>{doc.uploadDate}</td>
                    <td>{doc.type}</td>
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