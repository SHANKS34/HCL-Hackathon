import React, { useState } from 'react';
import type { UserRole } from '../types';


interface Props { onLogin(formData: any, role: UserRole, isRegistering: boolean): Promise<void> }


export const Auth: React.FC<Props> = ({ onLogin }) => {
const [isRegistering, setIsRegistering] = useState(false);
const [role, setRole] = useState<UserRole>('patient');
const [formData, setFormData] = useState({ name: '', email: '', password: '' });
const [consent, setConsent] = useState(false);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);


const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (isRegistering && !consent) { setError('You must consent to data usage.'); return; }
setLoading(true); setError('');
try { await onLogin(formData, role, isRegistering); }
catch (err: any) { setError(err.message || 'Authentication failed.'); }
finally { setLoading(false); }
};


return (
<div className="max-w-full mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100"> ... </div>
);
};