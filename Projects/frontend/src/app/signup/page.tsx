"use client";

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { appName, serverURL } from '@/utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import Head from 'next/head';
import Image from 'next/image'; // Importing Image for logo

export default function SignUp() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem("token")) {
                window.location.href = "/home";
            }
        }
    }, []);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    // Validation Functions
    const validateName = (name: string) => {
        return name.trim().length > 0;
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org)$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8; // Basic validation
    };

    // Handle Sign Up
    const handleSignUp = async () => {
        setLoading(true);

        // Validate Inputs
        let valid = true;

        if (!validateName(name)) {
            setNameError("Full name is required.");
            valid = false;
        } else {
            setNameError("");
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 8 characters long.");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) {
            setLoading(false);
            return;
        }

        const config = {
            method: "POST",
            url: `${serverURL}/users/signup`,
            headers: {
                "Content-Type": `application/json`,
            },
            data: {
                "name": name,
                "email": email,
                "password": password,
            }
        };

        try {
            const response = await axios(config);
            toast.success("Account created!");
            setTimeout(() => {
                window.location.href = "/login"; // Redirect to login
            }, 1500);
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Something went wrong! Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>{`Sign Up - ${appName}`}</title>
                <meta name="description" content={`Create an account on ${appName} - AI-Powered Exam Sheet Evaluator. Enjoy seamless access to effortless evaluation.`} />
            </Head>
            <main className="min-h-screen flex flex-col md:flex-row bg-black"> {/* Changed background to black */}
                {/* Sidebar */}
                <div className="hidden md:flex md:w-1/2 lg:w-2/3 bg-gradient-to-br from-indigo-600 to-purple-600 items-center justify-center p-10">
                    <div className="text-white max-w-md">
                        <Link href="/">
                            <h1 className="text-5xl font-bold mb-4 flex items-center">
                                <Image 
                                    src="https://gradelab.io/wp-content/uploads/2024/10/GradeLab-white.png" // Updated logo
                                    alt="GradeLab logo" 
                                    width={200} 
                                    height={200} 
                                /> 
                            </h1>
                        </Link>
                        <p className="text-xl">
                            Seamless Access, Effortless Evaluation: Welcome to {appName}, Where Innovation Meets Intelligent Grading.
                        </p>
                    </div>
                </div>

                {/* Sign Up Form */}
                <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 bg-white p-8 md:p-12 lg:p-16">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h2>
                        <p className="text-gray-600">Already have an account? <Link href="/login"><span className="text-indigo-600 hover:underline">Login</span></Link></p>
                    </div>

                    {/* Full Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
                        <input 
                            id="name"
                            type="text"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <input 
                            id="email"
                            type="email"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        <p className="text-gray-500 text-sm mt-1">Please enter a valid email address (e.g., user@example.com)</p>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                        <input 
                            id="password"
                            type="password"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="mt-6">
                        <button 
                            onClick={handleSignUp} 
                            disabled={loading} 
                            className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                    <ToastContainer 
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </div>
            </main>
        </>
    );
}
