export interface TableItem {
  id: number;
  [key: string]: any;
}

export const TableService = {
  getTableData: async (token: string, tableName: string) => {
    const res = await fetch(`https://tu-api.com/tables/${tableName}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Error al obtener datos de la tabla');
    return res.json() as Promise<TableItem[]>;
  },

  createTableItem: async (token: string, tableName: string, item: TableItem) => {
    const res = await fetch(`https://tu-api.com/tables/${tableName}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(item),
    });

    if (!res.ok) throw new Error('Error al crear item');
    return res.json();
  },

  updateTableItem: async (token: string, tableName: string, id: number, item: TableItem) => {
    const res = await fetch(`https://tu-api.com/tables/${tableName}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(item),
    });

    if (!res.ok) throw new Error('Error al actualizar item');
    return res.json();
  },

  deleteTableItem: async (token: string, tableName: string, id: number) => {
    const res = await fetch(`https://tu-api.com/tables/${tableName}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Error al eliminar item');
    return res.json();
  },
};
