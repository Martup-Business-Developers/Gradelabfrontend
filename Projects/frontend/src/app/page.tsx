"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null; // This component doesn't render anything
}
