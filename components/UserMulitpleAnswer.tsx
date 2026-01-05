import React from 'react';
import type { UserAnswer } from '../types';

interface UserMulitpleAnswerProps {
    userAns?: UserAnswer;
}

const UserMulitpleAnswer = ({ userAns }: UserMulitpleAnswerProps) => {
    if (!userAns) {
        return null;
    }
    return (
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded border-2 border-black/5">
            <span className="text-gray-400 uppercase text-[10px]">Câu trả lời của bạn</span>
            <span className={`${userAns?.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {userAns?.answer ? userAns.answer.join(", ") : 'Bỏ qua'}
            </span>
        </div>
    );
};

export default UserMulitpleAnswer;