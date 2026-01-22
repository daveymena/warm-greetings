const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la petición');
    }

    return response.json();
};

export const loansApi = {
    getAll: () => apiFetch('/loans'),
    create: (loanData: any) => apiFetch('/loans', {
        method: 'POST',
        body: JSON.stringify(loanData),
    }),
};

export const authApi = {
    login: (credentials: any) => apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData: any) => apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
};
