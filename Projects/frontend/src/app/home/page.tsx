"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className='bg-base-300 rounded-lg p-6 hover:bg-base-200 max-w-xs m-2 transition-all duration-300 ease-in-out shadow-lg'
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <p className='font-semibold text-lg mb-3 flex items-center'>
      <span className="text-2xl mr-2">{icon}</span>
      {title}
    </p>
    <p className='text-sm opacity-70'>{description}</p>
  </motion.div>
);

export default function Home({ user }) {
    const [typedText, setTypedText] = useState('');
    const [welcomeText, setWelcomeText] = useState('');
    const fullText = `Create a new evaluator or select an existing one to get started.`;
    const welcomeFullText = user ? `Welcome back, ${user.name}!` : 'Welcome!';

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setTypedText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) clearInterval(intervalId);
        }, 50);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setWelcomeText(welcomeFullText.slice(0, index));
            index++;
            if (index > welcomeFullText.length) clearInterval(intervalId);
        }, 50);

        return () => clearInterval(intervalId);
    }, [welcomeFullText]);

    const features = [
        {
            icon: '🤖',
            title: 'AI-Powered Evaluation',
            description: 'Leverage cutting-edge AI for accurate and efficient grading.'
        },
        {
            icon: '📊',
            title: 'Detailed Result Insights',
            description: 'Explore detailed insights for a holistic view of student performance.'
        },
        {
            icon: '👥',
            title: 'Effortless Class Management',
            description: 'Create, organize, and add students with ease.'
        }
    ];

    return (
        <div className='select-none flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-b from-base-200 to-base-300 p-6'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="mb-6">
                    <Image
                        src="https://gradelab.io/wp-content/uploads/2024/10/GradeLab-black.png"
                        alt="GradeLab Logo"
                        width={300}
                        height={100}
                        priority
                    />
                </div>
                <p className='text-2xl font-semibold mb-4 text-secondary'>{welcomeText}</p>
                <p className='text-xl mb-8 h-12'>{typedText}</p>
            </motion.div>
            
            <motion.div 
                className='flex flex-wrap justify-center max-w-4xl'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </motion.div>

            <motion.button
                className='mt-12 px-8 py-3 bg-primary text-white rounded-full font-semibold text-lg shadow-lg hover:bg-primary-focus transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                Get Started
            </motion.button>
        </div>
    )
}
