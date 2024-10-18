"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className='bg-white rounded-lg p-6 shadow-lg max-w-sm'
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <p className='font-semibold text-xl mb-3 flex items-center'>
      <span className="text-3xl mr-3">{icon}</span>
      {title}
    </p>
    <p className='text-gray-600'>{description}</p>
  </motion.div>
);

export default function Home() {
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
        <div className='flex flex-col items-center min-h-screen bg-gray-50 p-8'>
            <div className="mb-8">
                <Image
                    src="https://gradelab.io/wp-content/uploads/2024/10/GradeLab-black.png"
                    alt="GradeLab Logo"
                    width={200}
                    height={67}
                    priority
                />
            </div>
            
            <h1 className='text-4xl font-bold mb-4 text-teal-600'>Welcome!</h1>
            <p className='text-xl mb-12 text-gray-700'>Create a new evaluator or select an existing one to get started.</p>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>

            <motion.button
                className='px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Get Started
            </motion.button>
        </div>
    )
}
