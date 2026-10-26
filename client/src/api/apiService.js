const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth
  auth: {
    register: (userData) =>
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(handleResponse),

    login: (credentials) =>
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }).then(handleResponse),

    getMe: () =>
      fetch(`${API_BASE}/users/me`, {
        headers: getAuthHeaders()
      }).then(handleResponse),

    updateMe: (profileData) =>
      fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(profileData)
      }).then(handleResponse),

    getUserProfile: (id) =>
      fetch(`${API_BASE}/users/${id}`, {
        headers: getAuthHeaders()
      }).then(handleResponse)
  },

  // Localities
  localities: {
    getAll: () =>
      fetch(`${API_BASE}/localities`).then(handleResponse)
  },

  // Items
  items: {
    getItems: (params = {}) => {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.append('q', params.q);
      if (params.category && params.category !== 'All') searchParams.append('category', params.category);
      if (params.available) searchParams.append('available', 'true');
      if (params.page) searchParams.append('page', params.page);
      if (params.limit) searchParams.append('limit', params.limit);

      const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return fetch(`${API_BASE}/items${qs}`, {
        headers: getAuthHeaders()
      }).then(handleResponse);
    },

    getItemById: (id) =>
      fetch(`${API_BASE}/items/${id}`, {
        headers: getAuthHeaders()
      }).then(handleResponse),

    createItem: (itemData) =>
      fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(itemData)
      }).then(handleResponse),

    updateItem: (id, itemData) =>
      fetch(`${API_BASE}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(itemData)
      }).then(handleResponse),

    deleteItem: (id) =>
      fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).then(handleResponse),

    getMyListings: () =>
      fetch(`${API_BASE}/items/my/listings`, {
        headers: getAuthHeaders()
      }).then(handleResponse)
  },

  // Loans
  loans: {
    requestLoan: (loanData) =>
      fetch(`${API_BASE}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(loanData)
      }).then(handleResponse),

    getLoans: (role) => {
      const qs = role ? `?role=${role}` : '';
      return fetch(`${API_BASE}/loans${qs}`, {
        headers: getAuthHeaders()
      }).then(handleResponse);
    },

    approveLoan: (id) =>
      fetch(`${API_BASE}/loans/${id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      }).then(handleResponse),

    declineLoan: (id) =>
      fetch(`${API_BASE}/loans/${id}/decline`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      }).then(handleResponse),

    cancelLoan: (id) =>
      fetch(`${API_BASE}/loans/${id}/cancel`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      }).then(handleResponse),

    markReturned: (id) =>
      fetch(`${API_BASE}/loans/${id}/return`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      }).then(handleResponse),

    addRating: (id, ratingData) =>
      fetch(`${API_BASE}/loans/${id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(ratingData)
      }).then(handleResponse),

    getRatings: (id) =>
      fetch(`${API_BASE}/loans/${id}/ratings`, {
        headers: getAuthHeaders()
      }).then(handleResponse)
  },

  // Admin
  admin: {
    getStats: () =>
      fetch(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders()
      }).then(handleResponse),

    getAllUsers: () =>
      fetch(`${API_BASE}/admin/users`, {
        headers: getAuthHeaders()
      }).then(handleResponse),

    updateUserStatus: (id, status) =>
      fetch(`${API_BASE}/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      }).then(handleResponse),

    removeItem: (id) =>
      fetch(`${API_BASE}/admin/items/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).then(handleResponse),

    createLocality: (data) =>
      fetch(`${API_BASE}/admin/localities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(data)
      }).then(handleResponse),

    updateLocality: (id, data) =>
      fetch(`${API_BASE}/admin/localities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(data)
      }).then(handleResponse)
  }
};
