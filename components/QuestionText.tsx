import React from 'react';

interface QuestionTextProps {
    questionText: string;
}

const QuestionText: React.FC<QuestionTextProps> = ({ questionText }) => {
    return (
    <h3 className="text-2xl font-extrabold text-black mb-6 leading-tight">
        {questionText.split(/(`[^`]+`)/).map((part: string, i: number) => 
        part.startsWith('`') && part.endsWith('`') ? (
            <code key={i} className="px-2 py-1 bg-yellow-200 border-2 border-black rounded font-mono text-base font-bold">
            {part.slice(1, -1)}
            </code>
        ) : (
            part
        )
        )}
    </h3>
    );
};

export default QuestionText;