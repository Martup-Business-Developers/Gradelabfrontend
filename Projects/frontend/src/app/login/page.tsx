"use client";
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { appName, serverURL } from '@/utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import Head from 'next/head';

export default function Home() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");

    // Timer state (for lockout logic if needed)
    const [lockoutTime, setLockoutTime] = useState<number | null>(null);
    const [remainingTime, setRemainingTime] = useState<number | null>(null);

    // Timer logic
    useEffect(() => {
        const lockoutEndTime = localStorage.getItem("lockoutEndTime");
        if (lockoutEndTime) {
            const lockoutTimestamp = parseInt(lockoutEndTime, 10);
            const now = new Date().getTime();
            if (lockoutTimestamp > now) {
                setLockoutTime(lockoutTimestamp);
                startCountdown(lockoutTimestamp - now);
            } else {
                localStorage.removeItem("lockoutEndTime");
            }
        }
    }, []);

    useEffect(() => {
        if (lockoutTime) {
            const interval = setInterval(() => {
                const now = new Date().getTime();
                if (lockoutTime && lockoutTime > now) {
                    setRemainingTime(lockoutTime - now);
                } else {
                    setRemainingTime(null);
                    setLockoutTime(null);
                    localStorage.removeItem("lockoutEndTime");
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [lockoutTime]);

    const startCountdown = (time: number) => {
        setRemainingTime(time);
        const lockoutEndTime = new Date().getTime() + time;
        localStorage.setItem("lockoutEndTime", lockoutEndTime.toString());
        setLockoutTime(lockoutEndTime);
    };

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org)$/;
        return re.test(String(email).toLowerCase());
    };

    const login = async () => {
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError("");

        const config = {
            method: "POST",
            url: `${serverURL}/users/login`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "email": email,
                "password": password,
            }
        };

        try {
            const response = await axios(config);
            toast.success("Logged In!");
            localStorage.setItem("token", response.data.token);
            window.location.href = response.data.user.type === 0 ? "/admin" : "/home";
        } catch (error) {
            if (error.response && error.response.status === 429) {
                // Start the 15-minute lockout countdown
                toast.error("Too many login attempts. Please try again after 15 minutes.");
                startCountdown(15 * 60 * 1000); // 15 minutes in milliseconds
            } else {
                toast.error(error.response?.data || "Something went wrong!");
            }
        }
    };

    return (
        <>
            <Head>
                <title>{`Login - ${appName}`}</title>
                <meta name="description" content={`Log in to ${appName} - AI-Powered Exam Sheet Evaluator. Seamless access to effortless evaluation.`} />
            </Head>
            <main className="flex items-center justify-center w-screen h-screen p-4 bg-gradient-to-r from-blue-400 to-indigo-600">
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="https://gradelab.io/wp-content/uploads/2024/09/gradelab-logo-black.png"
                        alt="GradeLab Logo"
                        className="h-32 opacity-20"
                    />
                </div>
                <div className='flex flex-col text-white p-10 max-w-md bg-gradient-to-b from-indigo-600 to-purple-500 rounded-lg shadow-lg z-10'>
                    <h1 className="text-2xl font-semibold mb-3 text-center">Login to {appName}</h1>
                    {remainingTime ? (
                        <p className="text-red-500 text-lg text-center">Too many attempts. Please try again in {formatTime(remainingTime)}.</p>
                    ) : (
                        <>
                            <p className="mb-3 text-center">Don&apos;t have an account? <Link href={'/signup'} className="font-bold underline">Sign up</Link></p>
                            <label className="text-sm mb-1">Email</label>
                            <input 
                                className={`input input-bordered mb-1 max-w-xs ${emailError ? 'input-error' : ''}`} 
                                placeholder="Email" 
                                type="text" 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                            />
                            {emailError && <p className="text-red-500 text-xs mb-2">{emailError}</p>}
                            <label className="text-sm mb-1">Password</label>
                            <input 
                                className="input input-bordered mb-5 max-w-xs" 
                                placeholder="Password" 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                            />
                            <button className="btn btn-primary w-full" onClick={login}>Login</button>
                        </>
                    )}
                </div>
                <ToastContainer />
            </main>
        </>
    );
}
