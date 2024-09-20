"use client";
import React from 'react';
import Home from './home';
import { ToastContainer } from 'react-toastify';
import { Context } from '@/context/context';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<Context><Home>{children}</Home><ToastContainer /></Context>)
}
