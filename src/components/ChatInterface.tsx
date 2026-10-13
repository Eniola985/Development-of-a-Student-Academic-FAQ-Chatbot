import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  HelpCircle, 
  AlertTriangle, 
  RotateCcw, 
  Bookmark, 
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { ChatMessage, StudentProfile } from '../types';
import { SUGGESTED_QUESTIONS, INSTITUTION_INFO, VERIFIED_FAQS } from '../data/polyIbadanData';
import { PolyIbadanLogo } from './PolyIbadanLogo';

interface ChatInterfaceProps {
  studentProfile: StudentProfile;
  onOpenEscalateModal: (prefillSubject?: string) => void;
  onOpenFaqsTab: () => void;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  studentProfile,
  onOpenEscalateModal,
  onOpenFaqsTab,
  initialQuestion,
  onClearInitialQuestion
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: `Hello ${studentProfile.name}! 👋 I am your official **The Polytechnic, Ibadan** Student Academic Assistant.\n\nI am configured for your academic profile:\n- **Level:** ${studentProfile.level} (${studentProfile.program})\n- **Faculty:** ${studentProfile.faculty}\n- **Department:** ${studentProfile.department}\n\nAsk me anything regarding semester course registration on the student portal, NBTE 4.0 grading & CGPA rules, carryovers, 4-month SIWES, 1-year cognate IT requirements, school fees, or campus locations!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['The Polytechnic, Ibadan Academic Regulations & Student Handbook'],
        suggestedFollowUps: [
          'How do I register courses on the student portal?',
          'What is the required CGPA for HND admission?',
          'What happens if I have a carryover in Harmattan semester?'
        ]
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSendMessage(initialQuestion);
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          studentProfile,
          history: messages.slice(-6)
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I couldn't process that question right now. Please try again or visit your departmental course advisor.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || ['The Polytechnic, Ibadan Academic Regulations'],
        suggestedFollowUps: data.suggestedFollowUps,
        requiresAdvisingEscalation: data.requiresAdvisingEscalation
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.warn('Backend API unavailable, utilizing client-side verified institutional database:', error);

      const lower = text.toLowerCase();
      const matchedFaq = VERIFIED_FAQS.find(faq =>
        faq.tags.some(tag => lower.includes(tag.toLowerCase())) ||
        lower.includes(faq.category.toLowerCase()) ||
        faq.question.toLowerCase().split(' ').some(word => word.length > 4 && lower.includes(word))
      );

      const replyText = matchedFaq
        ? `**${matchedFaq.question}**\n\n${matchedFaq.detailedAnswer}\n\n*Official Source:* ${matchedFaq.policyReference}`
        : `Thank you for your inquiry regarding **${studentProfile.department}** (${studentProfile.level}).\n\nUnder The Polytechnic, Ibadan regulations:\n- **Course Registration:** Must be completed on the student portal (\`portal.polyibadan.edu.ng\`) and signed by your Course Advisor and HOD.\n- **Grading & Pass Mark:** Poly Ibadan operates the NBTE 4.0 scale (Distinction 3.50+, Upper Credit 3.00+, Lower Credit 2.50+, Pass 2.00+).\n- **Carryovers:** Must be registered with priority in the semester they are offered.\n- **Clearance & Enquiries:** You can consult the **Verified FAQs** tab or visit the **Directorate of Student Affairs (DSA)** on Middle Campus for personalized assistance.`;

      const fallbackMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [matchedFaq?.policyReference || 'The Polytechnic, Ibadan Student Handbook & NBTE Regulations'],
        suggestedFollowUps: [
          'What are the requirements for HND admission?',
          'How do I calculate my CGPA on the 4.0 scale?',
          'What happens if I have a carryover in Harmattan semester?'
        ]
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Text to Speech
  const toggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Copy to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'bot',
        text: `Conversation restarted. How can I assist you today regarding **${INSTITUTION_INFO.name}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['The Polytechnic, Ibadan Official Regulations'],
        suggestedFollowUps: SUGGESTED_QUESTIONS.slice(0, 3)
      }
    ]);
  };

  const renderFormattedText = (rawText: string) => {
    return rawText.split('\n').map((line, index) => {
      let processed: React.ReactNode = line;
      if (line.includes('**')) {
        const parts = line.split('**');
        processed = parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="font-semibold text-[#3D2317]">{part}</strong> : part
        );
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={index} className="ml-4 list-disc text-slate-800 my-0.5 leading-relaxed">
            {processed}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={index} className="ml-4 list-decimal text-slate-800 my-0.5 leading-relaxed">
            {processed}
          </li>
        );
      }

      return (
        <p key={index} className={`my-1 text-slate-800 leading-relaxed ${line === '' ? 'h-2' : ''}`}>
          {processed}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto w-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E5DDD3] shadow-sm">
      {/* Chat Top Subheader */}
      <div className="bg-white border-b border-[#E5DDD3] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D2317] animate-pulse" />
          <span className="text-xs font-bold text-[#3D2317]">
            Advisory Assistant Active
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-xs text-[#5D4037]">
            Context: {studentProfile.level} · {studentProfile.department}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenFaqsTab}
            className="text-xs text-[#4A2E1B] hover:text-[#2A170D] font-medium px-2 py-1 rounded hover:bg-[#F2ECE5] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Browse All FAQs</span>
          </button>
          <button
            onClick={handleResetChat}
            className="text-xs text-[#6D4C41] hover:text-[#2A170D] px-2 py-1 rounded hover:bg-[#F2ECE5] flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => {
          const isBot = message.sender === 'bot';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <PolyIbadanLogo size={36} className="shrink-0 mt-0.5 shadow-xs" />
              )}

              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-xs ${
                  isBot
                    ? 'bg-white text-slate-900 border border-[#E5DDD3] rounded-tl-xs'
                    : 'bg-[#3D2317] text-white rounded-tr-xs'
                }`}
              >
                {/* Message Body */}
                <div className={`text-sm break-words ${isBot ? 'text-slate-800' : 'text-[#FAF7F2]'}`}>
                  {isBot ? renderFormattedText(message.text) : message.text}
                </div>

                {/* Citations and Official Policy Tag */}
                {isBot && message.citations && message.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#F0EAE1] text-[11px] text-[#4A2E1B] flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-[#3D2317]">Official Source:</span>
                    {message.citations.map((cite, idx) => (
                      <span key={idx} className="bg-[#FAF7F2] px-2 py-0.5 rounded text-[#4A2E1B] border border-[#E5DDD3]">
                        {cite}
                      </span>
                    ))}
                  </div>
                )}

                {/* Advising Escalation Banner if triggered */}
                {isBot && message.requiresAdvisingEscalation && (
                  <div className="mt-3 p-3 bg-[#FFF8E1] border border-[#FFE082] rounded-lg text-xs text-[#5D4037]">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-[#3E2723]">
                      <ShieldAlert className="w-4 h-4 text-[#C69C6D]" />
                      <span>Official Academic Escalation Recommended</span>
                    </div>
                    <p className="mb-2 text-[#4E342E]">
                      Issues involving grade disputes, missing exam scores, or disciplinary records require physical verification from your department or the Sub-Dean's office.
                    </p>
                    <button
                      onClick={() => onOpenEscalateModal(message.text.slice(0, 40))}
                      className="px-3 py-1.5 bg-[#4A2E1B] hover:bg-[#3D2317] text-white font-medium rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Generate Advising Referral Ticket
                    </button>
                  </div>
                )}

                {/* Footer Controls & Timestamp */}
                <div className="mt-2 flex items-center justify-between text-[11px] opacity-80">
                  <span className={isBot ? 'text-slate-400' : 'text-[#D7CCC8]'}>
                    {message.timestamp}
                  </span>

                  {isBot && (
                    <div className="flex items-center space-x-1 ml-4 text-[#6D4C41]">
                      <button
                        onClick={() => toggleSpeech(message.id, message.text)}
                        className="p-1 hover:text-[#3D2317] rounded transition-colors cursor-pointer"
                        title={speakingId === message.id ? 'Stop audio' : 'Listen to answer'}
                      >
                        {speakingId === message.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-[#C69C6D]" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(message.id, message.text)}
                        className="p-1 hover:text-[#3D2317] rounded transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-[#4A2E1B]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Follow-Ups */}
                {isBot && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#F0EAE1]">
                    <p className="text-[11px] font-bold text-[#5D4037] mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#C69C6D]" />
                      Suggested Follow-Up Inquiries:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestedFollowUps.map((question, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSendMessage(question)}
                          className="text-left text-xs bg-[#FAF7F2] hover:bg-[#F0EAE1] text-[#3D2317] border border-[#E5DDD3] hover:border-[#C69C6D] px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-full bg-[#513121] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs border border-[#3D2317]">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <PolyIbadanLogo size={36} className="shrink-0 animate-pulse" />
            <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs border border-[#E5DDD3] text-[#5D4037] text-xs flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#4A2E1B] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#4A2E1B] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#4A2E1B] rounded-full animate-bounce"></div>
              </div>
              <span>Consulting Poly Ibadan academic database &amp; NBTE regulations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Row */}
      <div className="bg-white border-t border-[#E5DDD3] px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-bold text-[#5D4037] uppercase tracking-wider shrink-0">
          Quick Topics:
        </span>
        {SUGGESTED_QUESTIONS.slice(0, 4).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="shrink-0 text-xs bg-[#FAF7F2] hover:bg-[#F2ECE5] text-[#3D2317] px-2.5 py-1 rounded-md border border-[#E5DDD3] transition-colors cursor-pointer font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white p-3 sm:p-4 border-t border-[#E5DDD3]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about course forms, CGPA grading, carryovers, 1-year IT, fees... (Press Enter to send)`}
              rows={2}
              className="w-full resize-none border border-[#D7CCC8] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-[#8D6E63] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] focus:border-transparent transition-all bg-[#FCFBF9]"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
              inputText.trim() && !isLoading
                ? 'bg-[#3D2317] hover:bg-[#2A160D] text-white'
                : 'bg-[#E0D7CE] text-[#A1887F] cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-[#6D4C41] px-1">
          <span>Official Portal: <a href="https://portal.polyibadan.edu.ng" target="_blank" rel="noreferrer" className="text-[#3D2317] font-semibold hover:underline">portal.polyibadan.edu.ng</a></span>
          <span className="font-medium">NBTE 4.0 Grading Model</span>
        </div>
      </div>
    </div>
  );
};
