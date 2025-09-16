export interface DocumentUploadPayload {
  title: string;
  department_id: number;
  doc_type_id: number;
  uploaded_by: number;
  company_id: number;
  file: File;
}
export const DocumentService = {
  getDocuments: async (token: string) => {
    const res = await fetch('http://localhost:8000/documents/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('No se pudieron obtener los documentos');
    return res.json();
  },

  getDocumentJson: async (token: string, document_id: number) => {
    const res = await fetch(`http://localhost:8000/documents/${document_id}/extract`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('No se pudo obtener el JSON del documento');
    return res.json(); // 👈 Aquí recibes las tablas en JSON
  },

  uploadDocument: async (token: string, payload: DocumentUploadPayload) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('department_id', payload.department_id.toString());
    formData.append('doc_type_id', payload.doc_type_id.toString());
    formData.append('uploaded_by', payload.uploaded_by.toString());
    formData.append('company_id', payload.company_id.toString());
    formData.append('file', payload.file);

    const res = await fetch('http://localhost:8000/documents/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error('Error al subir el documento');
    return res.json();
  },

  deleteDocument: async (token: string, documentId: number) => {
    const res = await fetch(`http://localhost:8000/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Error al eliminar el documento');
    return res.json();
  },
};
