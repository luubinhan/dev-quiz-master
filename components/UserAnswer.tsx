import React from 'react';

interface CorrectMatchProps {
    answer: Record<string, string>;
}

const UserAnswer = ({ answer }: CorrectMatchProps) => {
    return (
        <div className="p-4 bg-gray-50 rounded border-2 border-black/5">
            <h4 className="font-black text-black leading-none text-lg mb-4">Câu trả lời của bạn</h4>
            <div className="grid grid-cols-1 gap-4">
                {Object.entries(answer).map(([key, value]) => (
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

export default UserAnswer;