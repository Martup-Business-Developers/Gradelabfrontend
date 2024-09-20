"use client";
import { appName } from "@/utils/utils";
import React from "react";

export default function Home() {
    return (
        <div className='select-none flex flex-col justify-center items-center w-full h-full'>
            <p className='text-5xl font-semibold mb-2'>🤖 {appName} 📝</p>
            <p className='text-center'>Create a new evaluator or select an existing evaluator to get started.</p>
            <div className='flex flex-wrap justify-center mt-7'>
                <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
                    <p className='font-semibold text-md mb-2'>🤖 AI-Powered Evaluation</p>
                    <p className='text-sm opacity-70'>Leverage cutting-edge AI for accurate and efficient grading.</p>
                </div>
                <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
                    <p className='font-semibold text-md mb-2'>📊 Detailed Result Insights</p>
                    <p className='text-sm opacity-70'>Explore detailed insights for a holistic view of student performance.</p>
                </div>
                <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
                    <p className='font-semibold text-md mb-2'>👥 Effortless Class Management</p>
                    <p className='text-sm opacity-70'>Create, organize, and add students with ease.</p>
                </div>
            </div>
        </div>
    )
}
