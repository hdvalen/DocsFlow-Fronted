import React, { useState, useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import './Documents.css';
import Modal from '../../components/Modal'; 
import Select from '../../components/Select'; 

interface Document {
  id: number;
  title: string;
  department_id: number;
  department: string; 
  uploaded_by: number;
  uploadDate: string; 
  doc_type: string; 
  doc_type_id: number; 
  company_id: number; 
}

interface Department {
  id: number;
  name: string;
}

interface DocType {
  id: number;
  name: string;
}

interface DocumentFromApi {
  id: number;
  title: string;
  department_id: number;
  uploaded_by: number;
  created_at: string;
  doc_type_id: number;
  company_id: number;
}

interface SelectOption {
  value: string | number;
  label: string;
}

const DocumentList: React.FC = () => {
  const { token, user } = useAuth(); 

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  // Modal subir documento
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadDepartmentId, setUploadDepartmentId] = useState<string>('');
  const [uploadDocTypeId, setUploadDocTypeId] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const departments: Department[] = [
    { id: 1, name: "Legal" },
    { id: 2, name: "Finanzas" },
    { id: 3, name: "Operaciones" },
    { id: 4, name: "Compras" },
  ];

  const docTypes: DocType[] = [
    { id: 1, name: "Contrato" },
    { id: 2, name: "Informe" },
    { id: 3, name: "Manual" },
    { id: 4, name: "Factura" },
    { id: 5, name: "Política" },
  ];

  const departmentFilterOptions: SelectOption[] = [
    { value: '', label: 'Todos los Departamentos' },
    ...departments.map(dept => ({ value: dept.name, label: dept.name }))
  ];

  const docTypeFilterOptions: SelectOption[] = [
    { value: '', label: 'Todos los Tipos' },
    ...docTypes.map(type => ({ value: type.name, label: type.name }))
  ];

  const departmentUploadOptions: SelectOption[] = departments.map(dept => ({
    value: dept.id.toString(),
    label: dept.name
  }));

  const docTypeUploadOptions: SelectOption[] = docTypes.map(type => ({
    value: type.id.toString(),
    label: type.name
  }));

  const getDepartmentName = (departmentId: number): string => {
    const department = departments.find(d => d.id === departmentId);
    return department?.name || `Dept ID: ${departmentId}`;
  };

  const getDocTypeName = (docTypeId: number): string => {
    const docType = docTypes.find(dt => dt.id === docTypeId);
    return docType?.name || `Type ID: ${docTypeId}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const fetchDocuments = async (): Promise<void> => {
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

      const data: { documents: DocumentFromApi[] } = await res.json();
      const formattedDocuments: Document[] = data.documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        department_id: doc.department_id,
        department: getDepartmentName(doc.department_id),
        uploaded_by: doc.uploaded_by,
        uploadDate: formatDate(doc.created_at),
        doc_type: getDocTypeName(doc.doc_type_id),
        doc_type_id: doc.doc_type_id,
        company_id: doc.company_id,
      }));

      setDocuments(formattedDocuments);
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, [token]);

  const handleUploadDocument = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadError(null);

    if (!uploadFile || !uploadTitle.trim() || !uploadDepartmentId || !uploadDocTypeId || !user) {
      setUploadError("Todos los campos son obligatorios.");
      setUploadLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle);
    formData.append('department_id', uploadDepartmentId);
    formData.append('uploaded_by', user.id.toString());
    formData.append('doc_type_id', uploadDocTypeId);
    formData.append('company_id', user.company_id ? user.company_id.toString() : '0');

    try {
      const res = await fetch("http://localhost:8000/documents/", {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.detail || 'Error desconocido');
      }

      setUploadTitle('');
      setUploadDepartmentId('');
      setUploadDocTypeId('');
      setUploadFile(null);
      setShowUploadModal(false);
      await fetchDocuments();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setUploadError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: number): Promise<void> => {
    if (!window.confirm("¿Seguro que deseas eliminar este documento?")) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/documents/${documentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error desconocido');
      }
      await fetchDocuments();
    } catch (err: unknown) {
      console.error("Delete error:", err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setUploadFile(files ? files[0] : null);
  };

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
        <Select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          options={departmentFilterOptions}
          placeholder="Todos los Departamentos"
        />
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          options={docTypeFilterOptions}
          placeholder="Todos los Tipos"
        />
        <Button onClick={() => { setSearchTerm(''); setFilterDepartment(''); setFilterType(''); }}>
          Limpiar Filtros
        </Button>
      </div>

      <div className="document-actions card">
        <Button onClick={() => setShowUploadModal(true)}>Subir Nuevo Documento</Button>
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
                      <Button variant="danger" onClick={() => handleDeleteDocument(doc.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showUploadModal && (
        <Modal title="Subir Nuevo Documento" onClose={() => setShowUploadModal(false)}>
          <form onSubmit={handleUploadDocument} className="upload-form">
            <Input
              label="Título del Documento"
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              required
            />
            <Select
              label="Departamento"
              value={uploadDepartmentId}
              onChange={(e) => setUploadDepartmentId(e.target.value)}
              options={departmentUploadOptions}
              placeholder="Selecciona un Departamento"
              required
            />
            <Select
              label="Tipo de Documento"
              value={uploadDocTypeId}
              onChange={(e) => setUploadDocTypeId(e.target.value)}
              options={docTypeUploadOptions}
              placeholder="Selecciona un Tipo"
              required
            />
            <Input
              label="Archivo (PDF)"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            {uploadError && <p className="error-message">{uploadError}</p>}
            <Button type="submit" disabled={uploadLoading}>
              {uploadLoading ? 'Subiendo...' : 'Subir Documento'}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DocumentList;
