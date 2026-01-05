import React from 'react';
import { Question } from '../types';

interface CorrectMatchProps {
    question: Question;
}

const CorrectMatch = ({ question }: CorrectMatchProps) => {
    return (
        <div className="p-4 bg-green-50 rounded border-2 border-green-200 mt-2">
            <h4 className="font-black text-green-700 leading-none text-lg mb-4">Đáp án:</h4>
            <div className="grid grid-cols-1 gap-4">
                {Object.entries(question.correctAnswer as Record<string, string>).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                        <div className="font-bold flex-none w-32 text-black">{key}</div>
                        <div className="text-black w-4">→</div>
                        <div className="font-mono flex-1 text-black bg-yellow-200 px-2 py-1 border-2 border-black">{value}</div>
                    </div>
                ))}
            </div>        
        </div>
    );
};

export default CorrectMatch;