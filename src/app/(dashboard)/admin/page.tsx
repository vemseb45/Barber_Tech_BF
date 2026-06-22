"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/frontend/layouts/AdminLayout';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Verificamos si existe el token al cargar la página
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AdminLayout />;
}