"use client";
import React from 'react';
import { Context } from '@/context/context';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<Context>{children}<ToastContainer /></Context>)
}
