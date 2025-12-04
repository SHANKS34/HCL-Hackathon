import { API_BASE_URL } from './constants';


export async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
try {
const options: RequestInit = {
method,
headers: {
'Content-Type': 'application/json',
},
};
if (body) options.body = JSON.stringify(body);


const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
const data = await res.json();
if (!res.ok) throw new Error(data.msg || data.error || 'API Request Failed');
return data;
} catch (err) {
console.error('API Error:', err);
throw err;
}
}