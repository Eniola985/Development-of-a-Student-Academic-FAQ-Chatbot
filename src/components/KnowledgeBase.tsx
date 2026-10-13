import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  BookmarkCheck, 
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { FAQCategory, FAQItem } from '../types';
import { VERIFIED_FAQS } from '../data/polyIbadanData';

interface KnowledgeBaseProps {
  onAskInChat: (question: string) => void;
}

const CATEGORIES: ('All' | FAQCategory)[] = [
  'All',
  'Portal & Registration',
  'Exams & Grading',
  'Admissions & Clearance',
  'SIWES & 1-Year IT',
  'Fees & Payments',
  'Campus Life & Hostels'
];

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onAskInChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FAQCategory>('All');
  const [expandedId, setExpandedId] = useState<string | null>(VERIFIED_FAQS[0]?.id || null);

  const filteredFaqs = VERIFIED_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery = 
      faq.question.toLowerCase().includes(query) ||
      faq.shortAnswer.toLowerCase().includes(query) ||
      faq.detailedAnswer.toLowerCase().includes(query) ||
      faq.tags.some(t => t.toLowerCase().includes(query)) ||
      (faq.policyReference && faq.policyReference.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-[#E5DDD3] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-1.5">
          <BookOpen className="w-5 h-5 text-[#3D2317]" />
          <h2 className="text-lg font-bold text-[#2C180E] font-serif">
            The Polytechnic, Ibadan Academic Knowledge Base
          </h2>
        </div>
        <p className="text-xs text-[#5D4037] leading-relaxed">
          Official institutional repository compiled from the Student Handbook, National Board for Technical Education (NBTE) Harmonized Polytechnic Regulations, Directorate of Academic Planning, and Directorate of Student Affairs (DSA).
        </p>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search academic guidelines (e.g., carryover, hostel, SIWES, HND cutoff, exam docket)..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#D7CCC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] focus:border-transparent bg-[#FAF7F2]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#8D6E63] hover:text-[#3D2317] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#3D2317] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5D4037] hover:bg-[#EFE8DE] border border-[#E5DDD3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E5DDD3] p-8">
            <FileText className="w-8 h-8 text-[#8D6E63] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#3D2317]">No matching FAQs found</h3>
            <p className="text-xs text-[#6D4C41] mt-1 max-w-md mx-auto">
              We couldn't find an exact pre-indexed answer for "{searchQuery}". You can ask the AI Chatbot directly to reason through your inquiry!
            </p>
            <button
              onClick={() => onAskInChat(searchQuery)}
              className="mt-4 px-4 py-2 bg-[#3D2317] hover:bg-[#2A160D] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask AI Academic Assistant About This
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white border border-[#E5DDD3] rounded-2xl overflow-hidden shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5D4037] font-bold">
                      <span className="text-[#3D2317]">{faq.category}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[#8D6E63]">Official Directive</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#2C180E] leading-snug">
                      {faq.question}
                    </h3>

                    {!isExpanded && (
                      <p className="text-xs text-[#5D4037] line-clamp-2 leading-relaxed">
                        {faq.shortAnswer}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-[#8D6E63] mt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#3D2317]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#F0EAE1] bg-[#FAF7F2]/60 space-y-4">
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-[#E5DDD3] shadow-inner">
                      {faq.detailedAnswer}
                    </div>

                    {faq.policyReference && (
                      <div className="flex items-center gap-2 text-xs text-[#5D4037]">
                        <ShieldCheck className="w-4 h-4 text-[#4A2E1B] shrink-0" />
                        <span className="font-bold text-[#3D2317]">Policy Citation:</span>
                        <span className="italic text-[#5D4037]">{faq.policyReference}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#6D4C41]">
                        <span className="font-bold">Tags:</span>
                        {faq.tags.map((tag) => (
                          <span key={tag} className="text-[#4A2E1B] bg-white px-2 py-0.5 rounded border border-[#E5DDD3]">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => onAskInChat(faq.question)}
                        className="px-3 py-1.5 bg-[#3D2317] hover:bg-[#2A160D] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Discuss with AI Assistant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
