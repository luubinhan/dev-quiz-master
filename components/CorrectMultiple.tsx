import React from 'react';

interface CorrectMultipleProps {
    answer?: string[];
}

const CorrectMultiple = ({ answer }: CorrectMultipleProps) => {
    if (!answer) {
        return null;
    }
    return (
        <div className="flex justify-between items-center p-2 bg-green-50 rounded border-2 border-green-200 mt-2">
            <span className="text-green-400 uppercase text-[10px]">Đáp án:</span>
            <span className="text-green-700">
                {answer?.join(', ')}
            </span>        
        </div>
    );
};

export default CorrectMultiple;