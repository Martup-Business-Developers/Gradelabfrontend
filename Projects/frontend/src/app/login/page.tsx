"use client";
import axios from 'axios';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { appName, serverURL } from '@/utils/utils';
import { ToastContainer, toast } from 'react-toastify';
import Head from 'next/head';
import { FiCheck, FiX } from 'react-icons/fi';

export default function Home() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem("token")) {
                window.location.href = "/home";
            }
        }
    }, []);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org)$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        const isLongEnough = password.length >= 8;

        return { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, isLongEnough };
    };

    const login = async () => {
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError("");

        const passwordValidation = validatePassword(password);
        if (!Object.values(passwordValidation).every(Boolean)) {
            setPasswordError("Password does not meet all requirements");
            return;
        }
        setPasswordError("");

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
            toast.error(error.response?.data || "Something went wrong!");
        }
    };

    const PasswordStrengthIndicator = ({ validation }: { validation: ReturnType<typeof validatePassword> }) => {
        const Indicator = ({ met, text }: { met: boolean, text: string }) => (
            <div className={`flex items-center ${met ? 'text-green-500' : 'text-red-500'}`}>
                {met ? <FiCheck /> : <FiX />}
                <span className="ml-2">{text}</span>
            </div>
        );

        return (
            <div className="mt-2 text-sm">
                <Indicator met={validation.isLongEnough} text="At least 8 characters" />
                <Indicator met={validation.hasUpperCase} text="Contains uppercase letter" />
                <Indicator met={validation.hasLowerCase} text="Contains lowercase letter" />
                <Indicator met={validation.hasNumber} text="Contains number" />
                <Indicator met={validation.hasSpecialChar} text="Contains special character" />
            </div>
        );
    };

    return (
        <>
            <Head>
                <title>{`Login - ${appName}`}</title>
                <meta name="description" content={`Log in to ${appName} - AI-Powered Exam Sheet Evaluator. Seamless access to effortless evaluation.`} />
            </Head>
            <main className="w-screen h-screen bg-base-100 flex p-2 overflow-hidden">
                <div className='flex flex-col text-white p-10 max-w-[30vw] bg-gradient-to-b to-purple-400 via-violet-500 from-indigo-600 h-full rounded-md'>
                    <Link href={"/"}><p className="mb-10">🤖 {appName} 📝</p></Link>
                    <p className="text-2xl font-semibold mb-2">
                        {appName} - AI Powered Exam Sheet Evaluator
                    </p>
                    <p className="opacity-70">Seamless Access, Effortless Evaluation: Welcome to {appName}, Where Innovation Meets Intelligent Grading.</p>
                </div>
                <div className="animate-fade-in-bottom flex flex-col w-full h-full ml-2 rounded-md p-10">
                    <p className="font-bold text-xl mb-3">Login</p>
                    <p className="mb-5">Don&apos;t have an account? <Link href={'/signup'}><label htmlFor="createchatbot_modal" className="btn btn-sm">Sign up</label></Link></p>
                    <p className="text-sm mb-1">Email</p>
                    <input 
                        className={`input input-bordered mb-1 max-w-xs ${emailError ? 'input-error' : ''}`} 
                        placeholder="Email" 
                        type="text" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                    />
                    {emailError && <p className="text-red-500 text-xs mb-2">{emailError}</p>}
                    <p className="text-xs mb-5 opacity-70">Please enter a valid email address (e.g., user@example.com)</p>
                    <p className="text-sm mb-1">Password</p>
                    <input 
                        className={`input input-bordered mb-1 max-w-xs ${passwordError ? 'input-error' : ''}`} 
                        placeholder="Password" 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                    />
                    {passwordError && <p className="text-red-500 text-xs mb-2">{passwordError}</p>}
                    <PasswordStrengthIndicator validation={validatePassword(password)} />
                    <button className="btn btn-primary max-w-xs mt-5" onClick={login}>Login</button>
                </div>
                <ToastContainer />
            </main>
        </>
    )
}
