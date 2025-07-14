export default function fetchWithAuth (url, options={}) {
    const token = localStorage.getItem('token');

    if (!token) {
        return Promise.reject('No token found. User not authenticated.');
    }

    const authHeaders = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type' : 'application/json'
    };

    return fetch(url, {
        ...options,
        headers: authHeaders
    })
}