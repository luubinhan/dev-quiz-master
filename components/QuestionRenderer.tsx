
import React, { useState, useEffect } from 'react';
import { Question, QuestionType, MatchingPair } from '../types';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';

interface Props {
  question: Question;
  onAnswer: (answer: any) => void;
  currentAnswer: any;
}

const QuestionRenderer: React.FC<Props> = ({ question, onAnswer, currentAnswer }) => {
  const [matchingState, setMatchingState] = useState<{left: string | null, pairs: Record<string, string>}>({
    left: null,
    pairs: (currentAnswer as Record<string, string>) || {}
  });

  useEffect(() => {
    if (question.type === QuestionType.DRAG_DROP) {
       setMatchingState(prev => ({ ...prev, pairs: (currentAnswer as Record<string, string>) || {} }));
    }
  }, [currentAnswer, question.type]);

  useEffect(() => {
    if (question.codeSnippet) {
      Prism.highlightAll();
    }
  }, [question.codeSnippet]);

  const handleSingleChoice = (option: string) => {
    onAnswer(option);
  };

  const handleMultipleChoice = (option: string) => {
    const prev = Array.isArray(currentAnswer) ? currentAnswer : [];
    const next = prev.includes(option) 
      ? prev.filter(o => o !== option)
      : [...prev, option];
    onAnswer(next);
  };

  const handleFillIn = (val: string) => {
    onAnswer(val);
  };

  const handleMatchClick = (side: 'left' | 'right', val: string) => {
    if (side === 'left') {
      setMatchingState(prev => ({ ...prev, left: val }));
    } else if (side === 'right' && matchingState.left) {
      const newPairs = { ...matchingState.pairs, [matchingState.left]: val };
      setMatchingState({ left: null, pairs: newPairs });
      onAnswer(newPairs);
    }
  };

  const clearMatch = (left: string) => {
    const newPairs = { ...matchingState.pairs };
    delete newPairs[left];
    setMatchingState(prev => ({ ...prev, pairs: newPairs }));
    onAnswer(newPairs);
  };

  // Helper to render option content nicely
  const renderOptionContent = (opt: string) => {
    const isCode = opt.includes(';') || opt.includes(':') || opt.includes('\n') || opt.includes('let ') || opt.includes('const ');
    return (
      <span className={`${isCode ? 'font-mono text-sm whitespace-pre-wrap' : ''}`}>
        {opt}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="brutalist-card p-8 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1 bg-yellow-400 border-2 border-black font-black text-[10px] rounded-full uppercase">
            {question.difficulty}
          </span>
          <span className="px-3 py-1 bg-cyan-400 border-2 border-black font-black text-[10px] rounded-full uppercase">
            {question.type.replace('-', ' ')}
          </span>
        </div>
        
        <h3 className="text-2xl font-extrabold text-black mb-6 leading-tight">
          {question.questionText}
        </h3>
        
        {question.codeSnippet && (
          <div className="border-3 border-black rounded-xl overflow-hidden mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <pre className="bg-slate-900 p-5 overflow-x-auto text-sm leading-relaxed">
              <code className="language-javascript">{question.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Question Type Specifics */}
        {question.type === QuestionType.SINGLE && (
          <div className="space-y-4">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSingleChoice(opt)}
                className={`w-full text-left p-4 rounded-2xl brutalist-button font-bold text-lg transition-all ${
                  currentAnswer === opt 
                    ? 'bg-indigo-500 text-white shadow-none translate-x-1 translate-y-1' 
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1.5 w-6 h-6 shrink-0 rounded-full border-3 border-black flex items-center justify-center ${currentAnswer === opt ? 'bg-white' : 'bg-transparent'}`}>
                    {currentAnswer === opt && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    {renderOptionContent(opt)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === QuestionType.MULTIPLE && (
          <div className="space-y-4">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleMultipleChoice(opt)}
                className={`w-full text-left p-4 rounded-2xl brutalist-button font-bold text-lg transition-all ${
                  currentAnswer?.includes(opt) 
                    ? 'bg-cyan-500 text-black shadow-none translate-x-1 translate-y-1' 
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1.5 w-6 h-6 shrink-0 rounded-lg border-3 border-black flex items-center justify-center ${currentAnswer?.includes(opt) ? 'bg-black' : 'bg-transparent'}`}>
                    {currentAnswer?.includes(opt) && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {renderOptionContent(opt)}
                  </div>
                </div>
              </button>
            ))}
            <p className="text-xs font-black text-gray-400 mt-4 uppercase">* Chọn tất cả đáp án đúng</p>
          </div>
        )}

        {question.type === QuestionType.FILL && (
          <div className="space-y-4">
            <input
              type="text"
              value={currentAnswer || ''}
              onChange={(e) => handleFillIn(e.target.value)}
              placeholder="Nhập câu trả lời..."
              className="w-full p-5 border-3 border-black rounded-2xl focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-mono text-xl font-bold bg-white"
            />
          </div>
        )}

        {question.type === QuestionType.DRAG_DROP && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-black uppercase tracking-widest bg-yellow-300 inline-block px-2 border-2 border-black">Khái niệm</h4>
              {question.matchingPairs?.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleMatchClick('left', p.left)}
                  disabled={!!matchingState.pairs[p.left]}
                  className={`w-full p-4 rounded-xl brutalist-button text-left font-bold flex justify-between items-center ${
                    matchingState.left === p.left 
                      ? 'bg-indigo-400 text-white' 
                      : matchingState.pairs[p.left] 
                        ? 'bg-green-300 opacity-50 shadow-none border-gray-400' 
                        : 'bg-white text-black'
                  }`}
                >
                  <span className="flex-1 min-w-0">{renderOptionContent(p.left)}</span>
                  {matchingState.pairs[p.left] && (
                    <span onClick={(e) => { e.stopPropagation(); clearMatch(p.left); }} className="text-red-600 hover:scale-110 ml-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-black uppercase tracking-widest bg-cyan-300 inline-block px-2 border-2 border-black">Định nghĩa</h4>
              {question.matchingPairs?.map((p, idx) => (
                <button
                  key={`right-${idx}`}
                  onClick={() => handleMatchClick('right', p.right)}
                  disabled={Object.values(matchingState.pairs).includes(p.right)}
                  className={`w-full p-4 rounded-xl brutalist-button text-left font-bold text-sm ${
                    Object.values(matchingState.pairs).includes(p.right)
                      ? 'bg-gray-100 opacity-50 shadow-none'
                      : 'bg-white text-black'
                  }`}
                >
                  <span className="flex-1 min-w-0">{renderOptionContent(p.right)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionRenderer;
