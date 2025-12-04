import { useEffect, useState } from 'react';
import type { User } from '../types';


export function useLocalAuth() {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
const stored = localStorage.getItem('wellguard_user');
if (stored) {
try {
setUser(JSON.parse(stored));
} catch (e) {
localStorage.removeItem('wellguard_user');
}
}
setLoading(false);
}, []);


function saveUser(u: User | null) {
setUser(u);
if (u) localStorage.setItem('wellguard_user', JSON.stringify(u));
else localStorage.removeItem('wellguard_user');
}


return { user, loading, saveUser };
}