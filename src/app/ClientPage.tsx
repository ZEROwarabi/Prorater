"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, SlidersHorizontal, X, Plus, Check } from 'lucide-react';

type Review = any;

type SortOption = 'reviews' | 'profRating' | 'easyRating';

const courseFullNames: Record<string, string> = {
  'ANTHR': 'Anthropology',
  'ARCHI': 'Architecture',
  'BIOSC': 'Biological Science',
  'BUS': 'Business',
  'BUSAC': 'Business Accounting',
  'CHEM': 'Chemistry',
  'COMM': 'Communication Studies',
  'COMSC': 'Computer Science',
  'ECON': 'Economics',
  'ENGL': 'English',
  'HIST': 'History',
  'MATH': 'Mathematics',
  'PHYS': 'Physics',
  'PSYCH': 'Psychology',
  'SOCIO': 'Sociology',
  'POLSC': 'Political Science',
  'MUSIC': 'Music',
  'ART': 'Art',
  'JAPN': 'Japanese',
  'KNACT': 'Kinesiology Activity',
  'ENACT': 'Kinesiology Activity',
  'ESL': 'English as a Second Language',
  'ETHNIC': 'Ethnic Studies',
  'ETHN': 'Ethnic Studies',
  'FTVE': 'Film, Television, and Electronic Media',
  'GEOG': 'Geography',
  'INTD': 'Interior Design',
  'MARKETING': 'Marketing',
  'COUNSELING': 'Counseling',
  'DANCE': 'Dance',
  'BIOL': 'Biology',
  'STAT': 'Statistics',
  'POLS': 'Political Science',
  'PSYC': 'Psychology'
};

export default function ClientPage({ initialData }: { initialData: Review[] }) {
  const [activeTab, setActiveTab] = useState<'course' | 'prof'>('course');
  const [searchCourse, setSearchCourse] = useState("");
  const [searchProf, setSearchProf] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('reviews');
  const [geFilter, setGeFilter] = useState<string[]>([]); // New state for GE Area filtering
  const [showAllTags, setShowAllTags] = useState(false);

  // Modals / Overlays
  const [selectedProfDetails, setSelectedProfDetails] = useState<{profName: string, reviews: Review[]} | null>(null);
  const [compareList, setCompareList] = useState<{profName: string, reviews: Review[]}[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const uniqueCourses = useMemo(() => Array.from(new Set(initialData.map(r => r.course).filter(Boolean))).sort(), []);
  const uniqueProfs = useMemo(() => Array.from(new Set(initialData.map(r => r.profName).filter(Boolean))).sort(), []);

  const filteredData = useMemo(() => {
    if (activeTab === 'course') {
      let data = initialData;
      // Filter by GE Area if active
      if (geFilter.length > 0) {
        data = data.filter(r => geFilter.includes(r.course.toUpperCase()));
      }
      // Filter by text search if present
      if (searchCourse) {
        const exactPrefixMatch = uniqueCourses.find(uc => uc.toLowerCase() === searchCourse.toLowerCase());
        if (exactPrefixMatch) {
          data = data.filter(r => r.course === exactPrefixMatch);
        } else {
          data = data.filter(r => r.courseFull.toLowerCase().includes(searchCourse.toLowerCase()) || r.course.toLowerCase().includes(searchCourse.toLowerCase()));
        }
      }
      return data;
    } else {
      if (!searchProf) return initialData;
      return initialData.filter(r => r.profName.toLowerCase().includes(searchProf.toLowerCase()));
    }
  }, [activeTab, searchCourse, searchProf, geFilter, uniqueCourses]);

  const courseGrouped = useMemo(() => {
    const groups: Record<string, Record<string, Review[]>> = {};
    filteredData.forEach(r => {
      if (!r.course) return;
      if (!groups[r.course]) groups[r.course] = {};
      if (!groups[r.course][r.profName]) groups[r.course][r.profName] = [];
      groups[r.course][r.profName].push(r);
    });
    return groups;
  }, [filteredData]);

  const profGrouped = useMemo(() => {
    const groups: Record<string, Review[]> = {};
    filteredData.forEach(r => {
      if (!r.profName) return;
      if (!groups[r.profName]) groups[r.profName] = [];
      groups[r.profName].push(r);
    });
    return groups;
  }, [filteredData]);

  const calculateAverages = (reviews: Review[]) => {
    const sum = (key: 'ratingProf' | 'ratingClass' | 'ratingEasy') => reviews.reduce((a, b) => a + (b[key] || 0), 0);
    const count = (key: 'ratingProf' | 'ratingClass' | 'ratingEasy') => reviews.filter(r => r[key] > 0).length;
    const avg = (key: 'ratingProf' | 'ratingClass' | 'ratingEasy') => {
      const c = count(key);
      return c > 0 ? (sum(key) / c).toFixed(1) : "-";
    };
    return { prof: avg('ratingProf'), cls: avg('ratingClass'), easy: avg('ratingEasy') };
  };

  const toggleCompare = (profName: string, reviews: Review[]) => {
    setCompareList(prev => {
      if (prev.find(p => p.profName === profName)) {
        return prev.filter(p => p.profName !== profName);
      } else {
        if (prev.length >= 4) {
          alert("比較できるのは最大4名までです。");
          return prev;
        }
        return [...prev, { profName, reviews }];
      }
    });
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProfDetails || showCompareModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProfDetails, showCompareModal]);

  const renderProfCard = (profName: string, reviews: Review[], avgs: { prof: string, cls: string, easy: string }) => {
    const isComparing = compareList.some(p => p.profName === profName);
    return (
      <div key={profName} className="flex flex-col group relative h-[480px] bg-white/40 p-8 border border-[#1a162d]/5 hover:border-[#1a162d]/20 transition-all rounded-3xl shadow-sm">
        
        {/* Compare Action */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleCompare(profName, reviews); }}
          className={`absolute top-6 right-6 px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-widest transition-all z-10 flex items-center gap-2 ${isComparing ? 'bg-[#1a162d] border-[#1a162d] text-white shadow-md' : 'bg-white border-[#1a162d]/20 text-[#5a5866] hover:border-[#1a162d] hover:text-[#1a162d] hover:bg-gray-50'}`}
        >
          {isComparing ? (
            <>
              <Check size={12} strokeWidth={3} />
              <span>比較する</span>
            </>
          ) : (
            <>
              <Plus size={12} strokeWidth={3} />
              <span>比較する</span>
            </>
          )}
        </button>

        <div className="mb-6 border-b border-[#1a162d]/10 pb-4 pr-12 relative">
          <h4 
            onClick={() => setSelectedProfDetails({ profName, reviews })}
            className="text-3xl font-serif text-[#1a162d] cursor-pointer hover:text-[#5a5866] transition-colors leading-tight"
          >
            {profName}
          </h4>
          <div className="mt-2 text-[10px] text-[#8c8a99] tracking-widest">
            {reviews.length}件のレビュー
          </div>
        </div>
        
        <div className="flex justify-between items-end mb-6">
          <span className="text-xs font-bold text-[#5a5866] tracking-widest uppercase">Aの取りやすさ</span>
          <span className="text-5xl font-serif text-[#1a162d] leading-none">{avgs.easy}</span>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center border-b border-[#1a162d]/5 pb-3">
            <span className="text-sm font-medium text-[#5a5866] tracking-widest">教授の質</span>
            <span className="text-2xl font-serif text-[#1a162d]">{avgs.prof}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#1a162d]/5 pb-3">
            <span className="text-sm font-medium text-[#5a5866] tracking-widest">授業の質</span>
            <span className="text-2xl font-serif text-[#1a162d]">{avgs.cls}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative cursor-pointer" onClick={() => setSelectedProfDetails({ profName, reviews })}>
          {/* Gradient fade out at the bottom to indicate more content */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#f5f5f4] to-transparent z-10 pointer-events-none"></div>
          
          {reviews.some(r => r.grading) && (
            <div className="mb-5">
              <span className="text-xs font-bold text-[#5a5866] tracking-widest uppercase block mb-1.5">成績の付け方</span>
              <p className="text-sm text-[#3a3845] leading-relaxed line-clamp-1">
                {reviews.find(r => r.grading)?.grading}
              </p>
            </div>
          )}
          
          {reviews.some(r => r.comment) && (
            <div>
              <span className="text-xs font-bold text-[#5a5866] tracking-widest uppercase block mb-2">学生の声</span>
              <div className="pl-4 border-l-2 border-[#1a162d]/20 relative">
                <div className="text-[10px] font-sans text-[#8c8a99] mb-1.5 flex items-center gap-2">
                  <span className="font-medium text-[#5a5866]">{reviews.find(r => r.comment)?.term}</span>
                </div>
                <p className="text-sm text-[#1a162d] leading-relaxed font-serif italic line-clamp-3">
                  "{reviews.find(r => r.comment)?.comment}"
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-right mt-3 pt-3 border-t border-[#1a162d]/10 shrink-0 cursor-pointer" onClick={() => setSelectedProfDetails({ profName, reviews })}>
          <span className="text-xs uppercase tracking-widest text-[#1a162d] font-bold hover:text-[#5a5866] transition-colors">詳細をすべて見る &rarr;</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#ecebe8] text-[#1a162d] font-sans pb-32 relative">
      <header className="pt-12 pb-16 px-8">
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <div className="font-serif text-2xl tracking-[0.2em] italic font-light cursor-pointer" onClick={() => { setSearchCourse(""); setSearchProf(""); }}>ProRater.</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        
        {/* Intent Tabs */}
        <div className="flex justify-center gap-12 mb-16">
          <button 
            onClick={() => setActiveTab('course')}
            className={`pb-2 text-sm tracking-[0.1em] transition-all duration-500 relative ${activeTab === 'course' ? 'text-[#1a162d]' : 'text-[#8c8a99] hover:text-[#1a162d]'}`}
          >
            分野・科目から探す
            {activeTab === 'course' && <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#1a162d]"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('prof')}
            className={`pb-2 text-sm tracking-[0.1em] transition-all duration-500 relative ${activeTab === 'prof' ? 'text-[#1a162d]' : 'text-[#8c8a99] hover:text-[#1a162d]'}`}
          >
            教授名から探す
            {activeTab === 'prof' && <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#1a162d]"></span>}
          </button>
        </div>

        {/* Search Area */}
        <div className="mb-24 max-w-4xl mx-auto relative group">
          {activeTab === 'course' ? (
            <>
              <input 
                type="text" 
                list="courses"
                value={searchCourse}
                onChange={(e) => setSearchCourse(e.target.value)}
                placeholder="科目名や分野を入力"
                className="w-full max-w-3xl mx-auto block bg-transparent border-b border-[#1a162d]/20 py-4 text-3xl md:text-5xl font-serif font-light focus:outline-none focus:border-[#1a162d] transition-colors text-center text-[#1a162d] placeholder:text-[#1a162d]/20"
              />
              <datalist id="courses">
                {uniqueCourses.map(c => <option key={c} value={c} />)}
              </datalist>
              
              {/* Quick Tags Section */}
              <div className="mt-12 animate-fade-in-up">
                <div className="text-center mb-6 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">主要な分野から探す</div>
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {uniqueCourses.map(subj => (
                    <button 
                      key={subj}
                      onClick={() => { 
                        if (searchCourse === subj) { setSearchCourse(""); }
                        else { setSearchCourse(subj); setGeFilter([]); }
                      }} 
                      className={`px-5 py-2 rounded-full border text-xs font-medium tracking-wide transition-colors shadow-sm ${searchCourse === subj && geFilter.length === 0 ? 'bg-[#1a162d] border-[#1a162d] text-white' : 'border-[#1a162d]/15 text-[#3a3845] hover:border-[#1a162d] hover:text-[#1a162d] bg-white/50'}`}
                    >
                      {courseFullNames[subj] || subj}
                    </button>
                  ))}
                </div>

                <div className="text-center mb-6 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">Cal-GETC / IGETC エリアから探す</div>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { label: 'Area 1 (English)', keywords: ['ENGL', 'COMM'] },
                    { label: 'Area 2 (Math)', keywords: ['MATH', 'BUS', 'STAT', 'BUSAC'] },
                    { label: 'Area 3 (Arts & Humanities)', keywords: ['ART', 'ARTHS', 'MUSIC', 'DRAMA', 'HIST', 'HUMAN', 'PHILO', 'ENGL', 'SPAN', 'JAPAN', 'JAPN'] },
                    { label: 'Area 4 (Social Sciences)', keywords: ['ANTHR', 'ECON', 'SOCIO', 'POLS', 'PSYCH', 'PSYC', 'HIST', 'GEOG', 'ETHNIC', 'ETHN'] },
                    { label: 'Area 5A (Physical Sciences)', keywords: ['ASTRO', 'CHEM', 'GEOG', 'GEOL', 'OCEAN', 'PHYS', 'PHYSC'] },
                    { label: 'Area 5B (Biological Sciences)', keywords: ['ANTHR', 'BIOSC', 'BIOL', 'PSYC', 'PSYCH'] },
                    { label: 'Area 6 (Ethnic Studies)', keywords: ['ETHNIC', 'ETHN'] },
                  ].map(area => {
                    const isActive = geFilter.join(',') === area.keywords.join(',');
                    return (
                      <button 
                        key={area.label}
                        onClick={() => { 
                          setSearchCourse(""); 
                          if (isActive) setGeFilter([]);
                          else setGeFilter(area.keywords); 
                        }} 
                        className={`px-5 py-2 rounded-full border text-xs font-medium tracking-wide transition-colors shadow-sm ${isActive ? 'bg-[#1a162d] border-[#1a162d] text-white' : 'border-[#1a162d]/15 text-[#3a3845] hover:bg-[#1a162d] hover:border-[#1a162d] hover:text-white bg-white/50'}`}
                      >
                        {area.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <input 
                type="text" 
                list="profs"
                value={searchProf}
                onChange={(e) => setSearchProf(e.target.value)}
                placeholder="教授の名前を入力"
                className="w-full bg-transparent border-b border-[#1a162d]/20 py-4 text-3xl md:text-5xl font-serif font-light focus:outline-none focus:border-[#1a162d] transition-colors text-center text-[#1a162d] placeholder:text-[#1a162d]/20"
              />
              <datalist id="profs">
                {uniqueProfs.map(p => <option key={p} value={p} />)}
              </datalist>
            </>
          )}
        </div>

        {/* Results Area */}
        <div>
          {/* COURSE RESULTS */}
          {activeTab === 'course' && (
            Object.keys(courseGrouped).length === 0 ? (
              <div className="text-center py-12 text-[#8c8a99] tracking-widest text-sm font-light">結果が見つかりません。</div>
            ) : (
              <div className="space-y-32">
                {Object.entries(courseGrouped).map(([course, profGroups]) => {
                  
                  // Sorting Logic
                  const sortedProfs = Object.entries(profGroups).map(([profName, reviews]) => {
                    const sortedReviews = [...reviews].sort((a, b) => {
                      const parseTerm = (t: string) => {
                        const match = String(t || '').match(/(\d{4})\s+(Spring|Summer|Fall|Winter)/i);
                        if (!match) return { year: 0, season: 0 };
                        const year = parseInt(match[1]);
                        const seasonStr = match[2].toLowerCase();
                        let season = 0;
                        if (seasonStr === 'spring') season = 1;
                        else if (seasonStr === 'summer') season = 2;
                        else if (seasonStr === 'fall') season = 3;
                        else if (seasonStr === 'winter') season = 4;
                        return { year, season };
                      };
                      const termA = parseTerm(a.term);
                      const termB = parseTerm(b.term);
                      if (termB.year !== termA.year) return termB.year - termA.year;
                      return termB.season - termA.season;
                    });
                    const avgs = calculateAverages(sortedReviews);
                    return { profName, reviews: sortedReviews, avgs };
                  }).sort((a, b) => {
                    if (sortBy === 'reviews') return b.reviews.length - a.reviews.length;
                    if (sortBy === 'profRating') return parseFloat(b.avgs.prof) - parseFloat(a.avgs.prof);
                    if (sortBy === 'easyRating') return parseFloat(b.avgs.easy) - parseFloat(a.avgs.easy);
                    return 0;
                  });

                  return (
                    <div key={course}>
                      {/* Section Header with Inline Sort */}
                      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#1a162d]/10 pb-6">
                        <div>
                          <h3 className="text-4xl md:text-5xl font-serif text-[#1a162d] mb-2 flex items-baseline">
                            {course} 
                            {courseFullNames[course] && (
                              <span className="text-lg md:text-2xl text-[#8c8a99] font-sans font-light ml-4 tracking-wide">
                                ({courseFullNames[course]})
                              </span>
                            )}
                          </h3>
                          <span className="text-xs text-[#8c8a99] tracking-[0.2em] uppercase">
                            {sortedProfs.length}名の教授
                          </span>
                        </div>

                        <div className="flex items-center gap-6 mt-6 md:mt-0">
                          <span className="text-[10px] tracking-widest text-[#8c8a99] uppercase mr-2"><SlidersHorizontal size={12} className="inline mr-2 -mt-0.5" />並べ替え</span>
                          <button 
                            onClick={() => setSortBy('reviews')} 
                            className={`text-[10px] tracking-widest transition-colors ${sortBy === 'reviews' ? 'text-[#1a162d] font-bold border-b border-[#1a162d]' : 'text-[#8c8a99] hover:text-[#1a162d]'}`}
                          >
                            レビュー数
                          </button>
                          <button 
                            onClick={() => setSortBy('profRating')} 
                            className={`text-[10px] tracking-widest transition-colors ${sortBy === 'profRating' ? 'text-[#1a162d] font-bold border-b border-[#1a162d]' : 'text-[#8c8a99] hover:text-[#1a162d]'}`}
                          >
                            教授の質
                          </button>
                          <button 
                            onClick={() => setSortBy('easyRating')} 
                            className={`text-[10px] tracking-widest transition-colors ${sortBy === 'easyRating' ? 'text-[#1a162d] font-bold border-b border-[#1a162d]' : 'text-[#8c8a99] hover:text-[#1a162d]'}`}
                          >
                            Aの取りやすさ
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {sortedProfs.map(({ profName, reviews, avgs }) => {
                          return renderProfCard(profName, reviews, avgs);
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* PROFESSOR RESULTS */}
          {activeTab === 'prof' && (
            Object.keys(profGrouped).length === 0 ? (
              <div className="text-center py-12 text-[#8c8a99] tracking-widest text-sm font-light">結果が見つかりません。</div>
            ) : (
              <div className="space-y-8">
                {!searchProf && (
                  <div className="text-center mb-10 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">
                    レビュー数の多い人気の教授 Top 20
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                  {Object.entries(profGrouped)
                    .map(([profName, reviews]) => {
                      const sortedReviews = [...reviews].sort((a, b) => {
                        const parseTerm = (t: string) => {
                          const match = String(t || '').match(/(\d{4})\s+(Spring|Summer|Fall|Winter)/i);
                          if (!match) return { year: 0, season: 0 };
                          const year = parseInt(match[1]);
                          const seasonStr = match[2].toLowerCase();
                          let season = 0;
                          if (seasonStr === 'spring') season = 1;
                          else if (seasonStr === 'summer') season = 2;
                          else if (seasonStr === 'fall') season = 3;
                          else if (seasonStr === 'winter') season = 4;
                          return { year, season };
                        };
                        const termA = parseTerm(a.term);
                        const termB = parseTerm(b.term);
                        if (termB.year !== termA.year) return termB.year - termA.year;
                        return termB.season - termA.season;
                      });
                      return { profName, reviews: sortedReviews, avgs: calculateAverages(sortedReviews) };
                    })
                    .sort((a, b) => {
                      if (sortBy === 'reviews') return b.reviews.length - a.reviews.length;
                      if (sortBy === 'profRating') return parseFloat(b.avgs.prof) - parseFloat(a.avgs.prof);
                      if (sortBy === 'easyRating') return parseFloat(b.avgs.easy) - parseFloat(a.avgs.easy);
                      return 0;
                    })
                    .slice(0, searchProf ? undefined : 20)
                    .map(({ profName, reviews, avgs }) => renderProfCard(profName, reviews, avgs))
                  }
                </div>
              </div>
            )
          )}
        </div>
      </main>

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1a162d] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 z-40">
          <div className="flex -space-x-3">
            {compareList.map((p, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-[#ecebe8] text-[#1a162d] flex items-center justify-center text-sm font-serif border-2 border-[#1a162d] shadow-sm">
                {p.profName.charAt(0)}
              </div>
            ))}
          </div>
          <div className="text-sm tracking-widest font-light">
            {compareList.length}名の教授を比較
          </div>
          <button 
            onClick={() => setShowCompareModal(true)}
            className="bg-white text-[#1a162d] px-6 py-2.5 rounded-full text-xs tracking-widest uppercase hover:bg-opacity-90 transition-colors font-medium ml-4"
          >
            比較する
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProfDetails && (
        <div className="fixed inset-0 bg-[#ecebe8]/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen p-8 md:p-16 max-w-5xl mx-auto relative">
            <button 
              onClick={() => setSelectedProfDetails(null)}
              className="fixed top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full border border-[#1a162d]/20 text-[#1a162d] hover:bg-[#1a162d] hover:text-white transition-all z-50"
            >
              <X size={20} />
            </button>

            <div className="mb-12 border-b border-[#1a162d]/10 pb-8">
              <h2 className="text-5xl md:text-7xl font-serif text-[#1a162d]">{selectedProfDetails.profName}</h2>
              <div className="mt-4 text-sm tracking-[0.2em] text-[#8c8a99] uppercase">全 {selectedProfDetails.reviews.length} 件のレビュー</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
              {/* Left Column: Averages */}
              <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                {(() => {
                  const avgs = calculateAverages(selectedProfDetails.reviews);
                  return (
                    <>
                      <div className="col-span-2">
                        <div className="text-xs text-[#8c8a99] tracking-[0.2em] uppercase mb-4">Aの易しさ</div>
                        <div className="text-6xl font-serif text-[#1a162d]">{avgs.easy}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8c8a99] tracking-[0.2em] uppercase mb-4">教授の質</div>
                        <div className="text-4xl font-serif text-[#1a162d]">{avgs.prof}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8c8a99] tracking-[0.2em] uppercase mb-4">授業の質</div>
                        <div className="text-4xl font-serif text-[#1a162d]">{avgs.cls}</div>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Right Column: Rating Distribution */}
              <div>
                <h3 className="text-xs tracking-widest text-[#1a162d] uppercase mb-8 flex items-center gap-4">
                  教授の質・評価分布 <span className="flex-1 h-[1px] bg-[#1a162d]/10"></span>
                </h3>
                <div className="space-y-4">
                  {(() => {
                    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                    let totalValid = 0;
                    selectedProfDetails.reviews.forEach(r => {
                      const val = Math.round(r.ratingProf);
                      if (val >= 1 && val <= 5) {
                        dist[val as keyof typeof dist]++;
                        totalValid++;
                      }
                    });
                    
                    const labels = { 5: '最高', 4: '良い', 3: '普通', 2: '微妙', 1: '最悪' };
                    
                    return [5, 4, 3, 2, 1].map(score => {
                      const count = dist[score as keyof typeof dist];
                      const percentage = totalValid > 0 ? (count / totalValid) * 100 : 0;
                      return (
                        <div key={score} className="flex items-center gap-4 group">
                          <div className="w-16 text-right shrink-0">
                            <span className="text-xs font-medium text-[#1a162d]">{score}</span>
                            <span className="text-[10px] text-[#8c8a99] ml-2">{labels[score as keyof typeof labels]}</span>
                          </div>
                          <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden border border-[#1a162d]/5">
                            <div 
                              className="h-full bg-[#1a162d] rounded-full transition-all duration-1000 ease-out" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-6 text-left shrink-0">
                            <span className="text-xs text-[#5a5866] font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="mt-6 text-right text-[10px] text-[#8c8a99] tracking-widest">
                  総レビュー数: {selectedProfDetails.reviews.length}件
                </div>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <h3 className="text-lg tracking-widest text-[#1a162d] uppercase mb-8 flex items-center gap-4">
                  学生の声 <span className="flex-1 h-[1px] bg-[#1a162d]/10"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {selectedProfDetails.reviews.filter(r => r.comment).map((r, i) => (
                    <div key={i} className="pl-6 border-l border-[#1a162d] relative">
                      <div className="absolute -left-[5px] top-2 w-2 h-2 bg-[#1a162d] rounded-full"></div>
                      <div className="text-sm font-sans text-[#5a5866] mb-3 flex items-center gap-3 font-medium flex-wrap">
                        <span className="border border-[#1a162d]/30 rounded-full px-3 py-0.5 bg-[#1a162d]/5 text-[#1a162d]">{r.courseFull}</span>
                        <span>{r.term}</span>
                        {r.ratingEasy > 0 && (
                          <span className="ml-auto text-[11px] flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border border-[#1a162d]/10 shadow-sm">
                            <span className="text-[#8c8a99] font-normal tracking-wider">Aの取りやすさ</span>
                            <span className="text-[#1a162d] font-bold">{r.ratingEasy.toFixed(1)}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-base text-[#1a162d] leading-loose font-serif italic">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg tracking-widest text-[#1a162d] uppercase mb-8 flex items-center gap-4">
                  成績の付け方 <span className="flex-1 h-[1px] bg-[#1a162d]/10"></span>
                </h3>
                <div className="space-y-6">
                  {selectedProfDetails.reviews.filter(r => r.grading).map((r, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <span className="shrink-0 text-xs font-sans text-[#1a162d] font-medium border border-[#1a162d]/30 rounded-full px-3 py-0.5 bg-[#1a162d]/5 mt-0.5">{r.courseFull}</span>
                      <p className="text-sm text-[#5a5866] font-light leading-relaxed flex-1">{r.grading}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-[#ecebe8]/95 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen p-8 max-w-7xl mx-auto relative">
            <div className="flex justify-between items-center mb-16 border-b border-[#1a162d]/10 pb-8 mt-8">
              <h2 className="text-3xl font-serif text-[#1a162d] tracking-widest">教授の比較</h2>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-[#1a162d]/20 text-[#1a162d] hover:bg-[#1a162d] hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-12 snap-x">
              {compareList.map((p, i) => {
                const avgs = calculateAverages(p.reviews);
                
                // Calculate Distribution
                const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                let totalValid = 0;
                p.reviews.forEach(r => {
                  const val = Math.round(r.ratingEasy);
                  if (val >= 1 && val <= 5) {
                    dist[val as keyof typeof dist]++;
                    totalValid++;
                  }
                });
                
                return (
                  <div key={i} className="min-w-[320px] max-w-[360px] flex-1 shrink-0 snap-center bg-white/60 p-6 md:p-8 border border-[#1a162d]/10 rounded-2xl shadow-sm flex flex-col">
                    {/* Fixed height header to guarantee vertical alignment */}
                    <div className="flex justify-between items-start mb-6 h-20 border-b border-[#1a162d]/10 pb-4">
                      <div>
                        <h3 className="text-3xl font-serif text-[#1a162d] leading-tight pr-4 line-clamp-2">{p.profName}</h3>
                        <div className="mt-1 text-[10px] text-[#8c8a99] tracking-widest">{p.reviews.length}件のレビュー</div>
                      </div>
                      <button 
                        onClick={() => toggleCompare(p.profName, p.reviews)}
                        className="text-[10px] tracking-widest text-[#8c8a99] hover:text-red-500 underline underline-offset-4 uppercase shrink-0 mt-2"
                      >
                        外す
                      </button>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-end border-b border-[#1a162d]/5 pb-4 mb-4">
                        <span className="text-xs font-bold text-[#5a5866] tracking-widest uppercase">Aの取りやすさ</span>
                        <span className="text-5xl font-serif text-[#1a162d] leading-none">{avgs.easy}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#1a162d]/5 py-3">
                        <span className="text-sm font-medium text-[#5a5866] tracking-widest">教授の質</span>
                        <span className="text-2xl font-serif text-[#1a162d]">{avgs.prof}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#1a162d]/5 py-3">
                        <span className="text-sm font-medium text-[#5a5866] tracking-widest">授業の質</span>
                        <span className="text-2xl font-serif text-[#1a162d]">{avgs.cls}</span>
                      </div>
                    </div>

                    {/* Mini Distribution Chart */}
                    <div className="mb-6 pb-6 border-b border-[#1a162d]/10">
                      <h4 className="text-[10px] font-bold tracking-widest text-[#5a5866] uppercase mb-3">Aの取りやすさの評価分布</h4>
                      <div className="space-y-1.5">
                        {[5, 4, 3, 2, 1].map(score => {
                          const count = dist[score as keyof typeof dist];
                          const percentage = totalValid > 0 ? (count / totalValid) * 100 : 0;
                          return (
                            <div key={score} className="flex items-center gap-3">
                              <span className="w-3 text-xs font-medium text-[#1a162d] text-right">{score}</span>
                              <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1a162d] rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="w-4 text-[10px] text-[#5a5866]">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <h4 className="text-[10px] font-bold tracking-widest text-[#1a162d] uppercase mb-4">主な成績の付け方</h4>
                      <div className="space-y-4">
                        {p.reviews.filter(r => r.grading).slice(0, 3).map((r, i) => (
                          <div key={i} className="relative pl-3 border-l-2 border-[#1a162d]/20">
                            <div className="text-xs font-sans text-[#1a162d] mb-1 flex gap-2 font-medium">
                              <span className="border border-[#1a162d]/20 rounded-full px-2 py-0.5 bg-[#1a162d]/5">{r.courseFull}</span>
                              <span className="flex items-center">{r.term}</span>
                            </div>
                            <div className="text-xs text-[#3a3845] leading-relaxed line-clamp-4">
                              {r.grading}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}