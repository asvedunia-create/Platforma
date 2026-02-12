'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (isRegister) {
      const payload = {
        name: String(formData.get('name')),
        email,
        password,
        organization: {
          name: String(formData.get('orgName')),
          edrpou: String(formData.get('edrpou') || ''),
          industry: String(formData.get('industry')),
          size: String(formData.get('size'))
        }
      };
      const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) {
        setError('Помилка реєстрації');
        return;
      }
    }

    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) return setError('Невірні облікові дані');
    router.push('/dashboard');
  }

  return (
    <main className="mx-auto mt-16 max-w-lg rounded-lg bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold">{isRegister ? 'Реєстрація' : 'Вхід'} в GRC Lite</h1>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <form action={handleSubmit} className="mt-6 space-y-3">
        {isRegister && <input required name="name" className="w-full rounded border p-2" placeholder="Ваше імʼя" />}
        <input required name="email" type="email" className="w-full rounded border p-2" placeholder="Email" />
        <input required name="password" type="password" className="w-full rounded border p-2" placeholder="Пароль" />
        {isRegister && (
          <>
            <input required name="orgName" className="w-full rounded border p-2" placeholder="Назва компанії" />
            <input name="edrpou" className="w-full rounded border p-2" placeholder="ЄДРПОУ (optional)" />
            <input required name="industry" className="w-full rounded border p-2" placeholder="Сфера" />
            <select required name="size" className="w-full rounded border p-2">
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200+</option>
            </select>
          </>
        )}
        <button className="w-full rounded bg-slate-900 p-2 text-white">{isRegister ? 'Створити акаунт' : 'Увійти'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="mt-3 text-sm text-blue-700">
        {isRegister ? 'Уже є акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
      </button>
    </main>
  );
}
