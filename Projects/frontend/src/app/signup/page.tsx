"use client";
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { appName, serverURL } from '@/utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import Head from 'next/head';

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

    const [verificationCodeSent, setVerificationCodeSent] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>("");

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
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    // Handle Sending Verification Code
    const sendVerificationCode = async () => {
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
            setPasswordError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
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
            url: `${serverURL}/users/send-verification-code`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "email": email
            }
        };

        try {
            const response = await axios(config);
            toast.success("Verification Code Sent!");
            setVerificationCodeSent(true);
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

    // Handle Email Verification
    const verifyEmail = async () => {
        setLoading(true);

        // Validate Verification Code
        if (verificationCode.trim() === "") {
            toast.error("Please enter the verification code!");
            setLoading(false);
            return;
        }

        const config = {
            method: "POST",
            url: `${serverURL}/users/verify-email`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "email": email,
                "code": verificationCode,
            }
        };

        try {
            const response = await axios(config);
            toast.success("Email verified!");
            signup();
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

    // Handle Sign Up
    const signup = async () => {
        setLoading(true);

        const config = {
            method: "POST",
            url: `${serverURL}/users/signup`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
                window.location.href = "/login";
            }, 1500);
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error(error.response.data);
            } else {
                toast.error("Something went wrong!");
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
            <main className="w-screen h-screen bg-base-100 flex p-2 overflow-hidden">
                {/* Sidebar */}
                <div className='flex flex-col text-white p-10 max-w-[30vw] bg-gradient-to-b to-purple-400 via-violet-500 from-indigo-600 h-full rounded-md'>
                    <Link href={"/"}><p className="mb-10 text-3xl">🤖 {appName} 📝</p></Link>
                    <p className="text-2xl font-semibold mb-2">
                        {appName} - AI Powered Exam Sheet Evaluator
                    </p>
                    <p className="opacity-80">Seamless Access, Effortless Evaluation: Welcome to {appName}, Where Innovation Meets Intelligent Grading.</p>
                </div>

                {/* Sign Up Form */}
                <div className="animate-fade-in-bottom flex flex-col w-full h-full ml-2 rounded-md p-10 overflow-y-auto">
                    <p className="font-bold text-2xl mb-3">Sign Up</p>
                    <p className="mb-5">Already have an account? <Link href={'/login'}><span className="btn btn-sm btn-outline">Login</span></Link></p>
                    
                    {/* Full Name */}
                    <div className="flex flex-col mb-4">
                        <label className="text-sm mb-1">Full Name</label>
                        <input 
                            className={`input input-bordered ${nameError ? 'input-error' : ''}`} 
                            placeholder="Full Name" 
                            type="text" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                        />
                        {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col mb-4">
                        <label className="text-sm mb-1">Email</label>
                        <input 
                            className={`input input-bordered ${emailError ? 'input-error' : ''}`} 
                            placeholder="Email" 
                            type="email" 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                        />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                        <p className="text-xs text-gray-500 mt-1">Please enter a valid email address (e.g., user@example.com)</p>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col mb-4">
                        <label className="text-sm mb-1">Password</label>
                        <input 
                            className={`input input-bordered ${passwordError ? 'input-error' : ''}`} 
                            placeholder="Password" 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                        />
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long and include uppercase, lowercase letters, numbers, and special characters.</p>
                    </div>

                    {/* Verification Code */}
                    {verificationCodeSent && (
                        <div className="flex flex-col mb-4">
                            <label className="text-sm mb-1">Verification Code</label>
                            <input 
                                className="input input-bordered" 
                                placeholder="Verification Code" 
                                type="text" 
                                onChange={(e) => setVerificationCode(e.target.value)} 
                                value={verificationCode} 
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex space-x-2">
                        {!verificationCodeSent && (
                            <button 
                                onClick={sendVerificationCode} 
                                disabled={loading} 
                                className={`btn btn-primary ${loading ? "loading" : ""}`}
                            >
                                Send Verification Code
                            </button>
                        )}

                        {verificationCodeSent && (
                            <button 
                                onClick={verifyEmail} 
                                disabled={loading} 
                                className={`btn btn-primary ${loading ? "loading" : ""}`}
                            >
                                Verify Email & Sign Up
                            </button>
                        )}
                    </div>
                    <ToastContainer />
                </div>
            </main>
        </>
    );
}
