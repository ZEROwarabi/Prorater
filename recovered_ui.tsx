"use client";

import React, { useState, useMemo } from 'react';
import { Search, Book, User, BookOpen, FileText, ChevronRight } from 'lucide-react';
import mockData from '../data.json';

type Review = typeof mockData[0];

export default function Home() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'course' | 'prof'>('course');
  
  // Search State
  const [searchCourse, setSearchCourse] = useState("");
  const [searchProf, setSearchProf] = useState("");

  const uniqueCourses = useMemo(() => Array.from(new Set(mockData.map(r => r.course).filter(Boolean))).sort(), []);
  const uniqueProfs = useMemo(() => Array.from(new Set(mockData.map(r => r.profName).filter(Boolean))).sort(), []);

  // Filter Data based on Active Tab
  const filteredData = useMemo(() => {
    if (activeTab === 'course') {
      if (!searchCourse) return [];
      return mockData.filter(r => r.courseFull.toLowerCase().includes(searchCourse.toLowerCase()) || r.course.toLowerCase().includes(searchCourse.toLowerCase()));
    } else {
      if (!searchProf) return [];
      return mockData.filter(r => r.profName.toLowerCase().includes(searchProf.toLowerCase()));
    }
  }, [activeTab, searchCourse, searchProf]);

  // Groupings
  const courseGrouped = useMemo(() => {
    const groups: Record<string, Record<string, Review[]>> = {};
    filteredData.forEach(r => {
      if (!r.courseFull) return;
      if (!groups[r.courseFull]) groups[r.courseFull] = {};
      if (!groups[r.courseFull][r.profName]) groups[r.courseFull][r.profName] = [];
      groups[r.courseFull][r.profName].push(r);
    });
    return groups;
  }, [filteredData]);

  const profGrouped = useMemo(() => {
    const groups: Record<string, Record<string, Review[]>> = {};
    filteredData.forEach(r => {
      if (!r.profName) return;
      if (!groups[r.profName]) groups[r.profName] = {};
      if (!groups[r.profName][r.courseFull]) groups[r.profName][r.courseFull] = [];
      groups[r.profName][r.courseFull].push(r);
    });
    return groups;
  }, [filteredData]);

  const calculateAverages = (reviews: Review[]) => {
    const sum = (key: 'ratingProf' | 'ratingClass' | 'ratingEasy') => reviews.reduce((a, b) => a + (b[key] || 0), 0);
    const count = (key: 'ratingProf' | 'ratingClass' | 'ratingEasy') => reviews.filter(r => r[key] > 0).length;
    const avg = (key: 'ratingProf' | 'ratingClass' | 'ratingEasy') => {
      const c = count(key);
      return c > 0 ? (sum(key) / c).toFixed(1) : "0.0";
    };
    return { prof: avg('ratingProf'), cls: avg('ratingClass'), easy: avg('ratingEasy') };
  };

  return (
    <div className="min-h-screen bg-[#ecebe8] text-[#1a162d] font-sans pb-20">
      <header className="pt-10 pb-6 px-8 bg-transparent">
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <div className="font-serif text-3xl tracking-widest italic font-light cursor-pointer" onClick={() => { setSearchCourse(""); setSearchProf(""); }}>ProRater.</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        {/* Intent Tabs - Pill shape */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[#e2e1dd] p-1.5 rounded-full shadow-inner">
            <button 
              onClick={() => setActiveTab('course')}
              className={`px-8 py-3.5 flex items-center gap-2.5 rounded-full transition-all duration-300 ${activeTab === 'course' ? 'bg-white text-[#1a162d] shadow-sm' : 'text-[#5a5866] hover:text-[#1a162d]'}`}
            >
              <Book size={18} />
              <span className="font-medium tracking-wide text-sm">科目から探す・比較する</span>
            </button>
            <button 
              onClick={() => setActiveTab('prof')}
              className={`px-8 py-3.5 flex items-center gap-2.5 rounded-full transition-all duration-300 ${activeTab === 'prof' ? 'bg-white text-[#1a162d] shadow-sm' : 'text-[#5a5866] hover:text-[#1a162d]'}`}
            >
              <User size={18} />
              <span className="font-medium tracking-wide text-sm">教授名から探す</span>
            </button>
          </div>
        </div>

        {/* Search Input Area - Streamlined */}
        <div className="mb-16 transform transition-all max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-[#8c8a99] group-focus-within:text-[#1a162d] transition-colors" size={22} />
            </div>
            
            {activeTab === 'course' ? (
              <>
                <input 
                  type="text" 
                  list="courses"
                  value={searchCourse}
                  onChange={(e) => setSearchCourse(e.target.value)}
                  placeholder="調べたい科目名やコースナンバーを入力 (例: ANTHR 140)"
                  className="w-full bg-white border-none py-5 pl-16 pr-8 text-lg rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#1a162d]/10 transition-shadow text-[#1a162d] placeholder:text-[#a09fa6]"
                />
                <datalist id="courses">
                  {uniqueCourses.map(c => <option key={c} value={c} />)}
                </datalist>
                <p className="text-xs text-[#8c8a99] mt-6 text-center tracking-wide font-light">
                  入力した科目を担当する教授たちが一覧で表示され、評価を比較できます。
                </p>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  list="profs"
                  value={searchProf}
                  onChange={(e) => setSearchProf(e.target.value)}
                  placeholder="教授の名前を入力 (例: Rubin, Johnson)"
                  className="w-full bg-white border-none py-5 pl-16 pr-8 text-lg rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#1a162d]/10 transition-shadow text-[#1a162d] placeholder:text-[#a09fa6]"
                />
                <datalist id="profs">
                  {uniqueProfs.map(p => <option key={p} value={p} />)}
                </datalist>
                <p className="text-xs text-[#8c8a99] mt-6 text-center tracking-wide font-light">
                  その教授が担当しているすべての授業の評価を一覧で確認できます。
                </p>
              </>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div>
          {/* COURSE RESULTS (Comparison) */}
          {activeTab === 'course' && searchCourse && (
            Object.keys(courseGrouped).length === 0 ? (
              <div className="text-center py-12 text-[#8c8a99]">見つかりませんでした。</div>
            ) : (
              <div className="space-y-16">
                {Object.entries(courseGrouped).map(([courseFull, profGroups]) => (
                  <div key={courseFull}>
                    <div className="mb-8 flex items-baseline gap-4 px-2">
                      <h3 className="text-4xl font-serif text-[#1a162d] tracking-wide">{courseFull}</h3>
                      <span className="text-sm text-[#8c8a99] tracking-widest uppercase">
                        {Object.keys(profGroups).length}名の教授を比較
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Object.entries(profGroups).map(([profName, reviews]) => {
                        const avgs = calculateAverages(reviews);
                        return (
                          <div key={profName} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:border-[#1a162d]/10 transition-all flex flex-col h-full group">
                            <div className="flex justify-between items-start mb-8">
                              <h4 className="text-xl font-medium flex items-center gap-2 text-[#1a162d]">
                                <span className="w-8 h-8 rounded-full bg-[#f4f3f0] flex items-center justify-center text-[#8c8a99] group-hover:bg-[#1a162d] group-hover:text-white transition-colors">
                                  <User size={16} />
                                </span>
                                {profName}
                              </h4>
                              <div className="text-right">
                                <div className="text-[10px] text-[#8c8a99] tracking-widest uppercase mb-1">Aの取りやすさ</div>
                                <div className="text-4xl font-serif text-[#1a162d] leading-none">{avgs.easy}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6 mb-8">
                              <div>
                                <div className="flex justify-between text-xs mb-2 text-[#5a5866]"><span>教授の質</span><span>{avgs.prof}</span></div>
                                <div className="w-full bg-[#f4f3f0] h-1.5 rounded-full overflow-hidden"><div className="bg-[#1a162d] h-full rounded-full" style={{ width: `${(parseFloat(avgs.prof)/5)*100}%` }}></div></div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-2 text-[#5a5866]"><span>授業の質</span><span>{avgs.cls}</span></div>
                                <div className="w-full bg-[#f4f3f0] h-1.5 rounded-full overflow-hidden"><div className="bg-[#8c8a99] h-full rounded-full" style={{ width: `${(parseFloat(avgs.cls)/5)*100}%` }}></div></div>
                              </div>
                            </div>
                            
                            <div className="space-y-5 mt-auto">
                              {reviews[0].grading && (
                                <div className="bg-[#f9f8f6] p-4 rounded-2xl text-xs text-[#5a5866] leading-relaxed">
                                  <span className="font-semibold text-[#1a162d] block mb-1">成績の付け方</span> {reviews[0].grading}
                                </div>
                              )}
                              <div>
                                <div className="text-[11px] font-semibold text-[#1a162d] tracking-widest mb-3 flex items-center gap-1.5 px-1">
                                  <BookOpen size={12} /> コメント ({reviews.filter(r => r.comment).length})
                                </div>
                                <div className="space-y-3">
                                  {reviews.filter(r => r.comment).slice(0, 1).map((r, i) => (
                                    <div key={i} className="text-xs text-[#5a5866] leading-relaxed relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-[#d5d4ce] before:rounded-full line-clamp-3">
                                      "{r.comment}"
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* PROFESSOR RESULTS */}
          {activeTab === 'prof' && searchProf && (
            Object.keys(profGrouped).length === 0 ? (
              <div className="text-center py-12 text-[#8c8a99]">見つかりませんでした。</div>
            ) : (
              <div className="space-y-16">
                {Object.entries(profGrouped).map(([profName, courseGroups]) => (
                  <div key={profName} className="bg-transparent">
                    <div className="mb-10 flex items-baseline gap-4 px-2">
                      <h3 className="text-4xl font-serif flex items-center gap-4 text-[#1a162d]">
                         {profName}
                      </h3>
                      <span className="text-sm text-[#8c8a99] tracking-widest uppercase">
                        担当科目一覧
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(courseGroups).map(([courseFull, reviews]) => {
                        const avgs = calculateAverages(reviews);
                        return (
                          <div key={courseFull} className="flex flex-col md:flex-row gap-8 p-8 bg-white rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] items-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="w-full md:w-1/4 shrink-0">
                              <h4 className="text-2xl font-medium mb-2 text-[#1a162d]">{courseFull}</h4>
                              <p className="text-sm text-[#8c8a99]">{reviews[0].credits} 単位 / {reviews[0].classType}</p>
                            </div>
                            
                            <div className="flex-1 w-full flex justify-around gap-6">
                              <div className="text-center">
                                <div className="text-[10px] text-[#8c8a99] tracking-widest uppercase mb-2">Aの取りやすさ</div>
                                <div className="text-3xl font-serif text-[#1a162d] mb-3">{avgs.easy}</div>
                                <div className="w-16 mx-auto bg-[#f4f3f0] h-1.5 rounded-full overflow-hidden"><div className="bg-[#1a162d] h-full rounded-full" style={{ width: `${(parseFloat(avgs.easy)/5)*100}%` }}></div></div>
                              </div>
                              <div className="text-center">
                                <div className="text-[10px] text-[#8c8a99] tracking-widest uppercase mb-2">教授の質</div>
                                <div className="text-3xl font-serif text-[#1a162d] mb-3">{avgs.prof}</div>
                                <div className="w-16 mx-auto bg-[#f4f3f0] h-1.5 rounded-full overflow-hidden"><div className="bg-[#1a162d] h-full rounded-full" style={{ width: `${(parseFloat(avgs.prof)/5)*100}%` }}></div></div>
                              </div>
                              <div className="text-center">
                                <div className="text-[10px] text-[#8c8a99] tracking-widest uppercase mb-2">授業の質</div>
                                <div className="text-3xl font-serif text-[#1a162d] mb-3">{avgs.cls}</div>
                                <div className="w-16 mx-auto bg-[#f4f3f0] h-1.5 rounded-full overflow-hidden"><div className="bg-[#1a162d] h-full rounded-full" style={{ width: `${(parseFloat(avgs.cls)/5)*100}%` }}></div></div>
                              </div>
                            </div>

                            <div className="w-full md:w-1/4 shrink-0 flex flex-col justify-center items-end">
                              <button className="px-6 py-3 bg-[#f9f8f6] hover:bg-[#1a162d] text-[#1a162d] hover:text-white rounded-full text-xs tracking-widest transition-colors font-medium flex items-center gap-2">
                                詳細・レビュー <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}