export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: string;
  company_id?: number;
  department_id?: number;
}

export const UserService = {
  getUsers: async (token: string) => {
    const res = await fetch('https://tu-api.com/users', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Error al obtener usuarios');
    return res.json();
  },

  getUserById: async (token: string, userId: number) => {
    const res = await fetch(`https://tu-api.com/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Error al obtener usuario');
    return res.json();
  },

  createUser: async (token: string, payload: UserPayload) => {
    const res = await fetch('https://tu-api.com/users', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Error al crear usuario');
    return res.json();
  },

  updateUser: async (token: string, userId: number, payload: UserPayload) => {
    const res = await fetch(`https://tu-api.com/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Error al actualizar usuario');
    return res.json();
  },

  deleteUser: async (token: string, userId: number) => {
    const res = await fetch(`https://tu-api.com/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Error al eliminar usuario');
    return res.json();
  },
};
