
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TOPICS, MOCK_QUESTIONS } from './constants';
import { Topic, Question, QuizResult, UserAnswer, QuestionType } from './types';
import QuestionRenderer from './components/QuestionRenderer';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'quiz' | 'result'>('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  const startQuiz = (topic: Topic) => {
    const filtered = MOCK_QUESTIONS.filter(q => q.topic === topic.id);
    const selectedQuestions = filtered.sort(() => Math.random() - 0.5).slice(0, 10);
    
    setQuestions(selectedQuestions);
    setSelectedTopic(topic);
    setCurrentIdx(0);
    setAnswers({});
    setStartTime(Date.now());
    setView('quiz');
  };

  const handleAnswer = (answer: any) => {
    if (!questions[currentIdx]) return;
    setAnswers(prev => ({ ...prev, [questions[currentIdx].id]: answer }));
  };

  const calculateScore = useCallback(() => {
    if (questions.length === 0) return;
    
    let score = 0;
    const userAnswers: UserAnswer[] = questions.map(q => {
      const ans = answers[q.id];
      let isCorrect = false;

      if (q.type === QuestionType.SINGLE || q.type === QuestionType.FILL) {
        isCorrect = String(ans || '').toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim();
      } else if (q.type === QuestionType.MULTIPLE) {
        const correct = q.correctAnswer as string[];
        const user = ans as string[] || [];
        isCorrect = correct.length === user.length && correct.every(v => user.includes(v));
      } else if (q.type === QuestionType.DRAG_DROP) {
        const correct = q.correctAnswer as Record<string, string>;
        const user = ans as Record<string, string> || {};
        isCorrect = Object.keys(correct).every(k => user[k] === correct[k]);
      }

      if (isCorrect) score++;
      return { questionId: q.id, answer: ans, isCorrect, timeTaken: 0 };
    });

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const percentage = (score / questions.length) * 100;
    
    let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    if (percentage > 80) level = 'Advanced';
    else if (percentage > 50) level = 'Intermediate';

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      percentage,
      timeSpent,
      level,
      topic: selectedTopic?.name || '',
      userAnswers
    };

    setFinalResult(result);
    setView('result');
  }, [questions, answers, startTime, selectedTopic]);

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-md mx-auto min-h-screen py-10 px-4">
      {/* App Header */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-3">
            {view !== 'home' && (
              <button 
                onClick={() => { if(confirm('Rời khỏi bài thi?')) setView('home'); }}
                className="w-10 h-10 bg-white border-3 border-black rounded-full flex items-center justify-center brutalist-button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <h1 className="text-3xl font-[900] text-yellow-400 tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              {view === 'quiz' ? 'DevQuiz' : 'DevQuiz'}
            </h1>
        </div>
        {view === 'quiz' && (
            <div className="bg-black text-white px-4 py-1.5 rounded-full border-2 border-white font-bold flex items-center gap-2 text-sm shadow-lg">
                <span className="text-yellow-400">●</span> {selectedTopic?.name}
            </div>
        )}
      </div>

      <main>
        {view === 'home' && (
          <div className="space-y-6 animate-fade-in">

            {/* Topic Grid */}
            <div className="grid grid-cols-1 gap-4">
              {TOPICS.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => startQuiz(topic)}
                  className={`group brutalist-card p-5 text-left flex items-center gap-5 hover:-translate-y-1 transition-transform ${
                    idx % 3 === 0 ? 'bg-indigo-200' : idx % 3 === 1 ? 'bg-pink-200' : 'bg-amber-100'
                  }`}
                >
                  <div className="w-16 h-16 bg-white border-3 border-black rounded-2xl flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {topic.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-black leading-none mb-1">{topic.name}</h3>
                    <p className="text-xs font-bold text-black/60 line-clamp-2">{topic.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center brutalist-button shadow-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'quiz' && (
          <div className="space-y-6 animate-fade-in">
            {/* Progress Label */}
            <div className="bg-white border-4 border-black rounded-full p-2 flex items-center justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-1 flex justify-center">
                    <span className="font-black text-black tracking-tight uppercase">{currentIdx + 1} / {questions.length}</span>
                </div>
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <QuestionRenderer 
                question={currentQuestion} 
                onAnswer={handleAnswer} 
                currentAnswer={answers[currentQuestion.id]}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="flex-1 p-4 bg-white brutalist-button rounded-2xl font-black uppercase text-sm"
              >
                Quay lại
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="flex-[2] p-4 bg-black text-white border-3 border-black rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 brutalist-button"
                >
                  Tiếp
                </button>
              ) : (
                <button
                  onClick={calculateScore}
                  className="flex-[2] p-4 bg-green-400 border-3 border-black rounded-2xl font-black uppercase tracking-widest hover:bg-green-500 brutalist-button"
                >
                  Hoàn Tất
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'result' && finalResult && (
          <div className="space-y-6 animate-fade-in pb-20">
            {/* Score Neubrutalist Card */}
            <div className="brutalist-card overflow-hidden bg-white">
              <div className="bg-black p-8 text-center text-white border-b-4 border-black">
                <p className="text-yellow-400 uppercase tracking-[0.2em] text-xs font-black mb-2">Điểm số</p>
                <div className="text-7xl font-[1000] mb-2 leading-none">{finalResult.score} / {finalResult.totalQuestions}</div>
                <div className="inline-block px-4 py-1 bg-white text-black border-2 border-black rounded-full text-xs font-black uppercase italic">
                  Chính xác {finalResult.percentage}%
                </div>
              </div>
              
              <div className="grid grid-cols-3 divide-x-4 divide-black">
                <div className="p-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Thời gian</p>
                  <p className="text-lg font-black text-black">{finalResult.timeSpent}s</p>
                </div>
                <div className="p-4 text-center bg-cyan-200">
                  <p className="text-[10px] text-black uppercase font-black mb-1">Độ khó</p>
                  <p className="text-lg font-black text-black">{finalResult.level}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Chủ đề</p>
                  <p className="text-sm font-black text-black truncate">{finalResult.topic}</p>
                </div>
              </div>
            </div>

            {/* Detailed Review Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-indigo-400 drop-shadow-[2px_2px_0px_rgb(0,0,0)]">Chi tiết</h3>
              {questions.map((q, idx) => {
                const userAns = finalResult.userAnswers.find(ua => ua.questionId === q.id);
                return (
                  <div key={q.id} className={`brutalist-card p-6 bg-white border-l-[12px] ${userAns?.isCorrect ? 'border-l-green-400' : 'border-l-red-400'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black text-black leading-none text-lg">
                        Q{idx + 1}: {q.questionText}
                      </h4>
                    </div>

                    <div className="space-y-2 mb-6 text-sm font-bold">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded border-2 border-black/5">
                        <span className="text-gray-400 uppercase text-[10px]">Câu trả lời của bạn</span>
                        <span className={`${userAns?.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {userAns?.answer ? (typeof userAns.answer === 'object' ? '...' : String(userAns.answer)) : 'Bỏ qua'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded border-2 border-green-200">
                        <span className="text-green-400 uppercase text-[10px]">Đáp án</span>
                        <span className="text-green-700">
                          {typeof q.correctAnswer === 'object' ? 'Matches defined pairs' : String(q.correctAnswer)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl border-2 border-black">
                      <p className="text-[10px] font-black text-black uppercase mb-2 tracking-widest">Giải thích</p>
                      <p className="text-xs font-bold text-gray-700 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Restart Button */}
            <div className="flex justify-center pt-10">
              <button
                onClick={() => setView('home')}
                className="w-full py-5 bg-white brutalist-button rounded-3xl font-[1000] text-2xl uppercase tracking-tighter hover:bg-yellow-300"
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Custom scrollbar for better neubrutalist look */
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: black;
            border: 3px solid #7c3aed;
            border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
