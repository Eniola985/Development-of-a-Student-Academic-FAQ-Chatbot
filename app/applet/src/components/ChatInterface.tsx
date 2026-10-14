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
  Sparkles,
  Mic,
  MicOff
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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-NG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          studentProfile,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: data.reply || 'I have noted your inquiry regarding Poly Ibadan academic policies.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || ['The Polytechnic, Ibadan Student Handbook'],
        suggestedFollowUps: data.suggestedFollowUps || [],
        requiresAdvisingEscalation: data.requiresAdvisingEscalation
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: `⚠️ **Connection Note:** I am currently running on offline institutional memory. Your query about *"${query}"* has been recorded. For official guidance, visit portal.polyibadan.edu.ng or consult your Departmental Course Advisor.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['The Polytechnic, Ibadan Offline Academic Knowledge Base'],
        suggestedFollowUps: [
          'How do I register courses on the student portal?',
          'Where is the Directorate of Student Affairs located?',
          'What is the NBTE 4.0 grading system?'
        ]
      };
      setMessages(prev => [...prev, errorMsg]);
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

  const toggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: `Chat session reset. Welcome back ${studentProfile.name}! How can I assist you with your academic registration, CGPA, or campus navigation at Poly Ibadan today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['The Polytechnic, Ibadan Academic Regulations'],
        suggestedFollowUps: [
          'How do I register courses on the student portal?',
          'Where is the Faculty of Science located?'
        ]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-[#E5DDD3] flex flex-col h-[75vh] min-h-[600px] overflow-hidden">
      {/* Top Bar */}
      <div className="bg-[#3D2317] text-white px-4 py-3 flex items-center justify-between border-b border-[#543322]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#C69C6D] text-[#2C180E] flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base flex items-center gap-2">
              <span>Poly Ibadan Academic Assistant</span>
              <span className="text-[10px] bg-[#C69C6D] text-[#2C180E] px-2 py-0.5 rounded-full font-sans font-bold">
                Online & Verified
              </span>
            </h2>
            <p className="text-xs text-[#D7CCC8]">
              Context: {studentProfile.department} ({studentProfile.level}) · NBTE 4.0 Standards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFaqsTab}
            className="text-xs bg-[#513121] hover:bg-[#68412D] text-[#EFEBE9] px-3 py-1.5 rounded-lg border border-[#68412D] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            title="Browse Verified FAQs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C69C6D]" />
            <span className="hidden sm:inline">Verified FAQs</span>
          </button>
          <button
            onClick={handleResetChat}
            className="text-xs bg-[#513121] hover:bg-[#68412D] text-[#EFEBE9] p-2 rounded-lg border border-[#68412D] transition-colors cursor-pointer"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7F2]">
        {messages.map((message) => {
          const isBot = message.sender === 'bot';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
            >
              {isBot ? (
                <div className="w-8 h-8 rounded-full bg-[#3D2317] text-[#C69C6D] flex items-center justify-center shrink-0 shadow-xs border border-[#543322]">
                  <Bot className="w-4 h-4" />
                </div>
              ) : null}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-xs text-sm leading-relaxed ${
                  isBot
                    ? 'bg-white text-[#2C180E] rounded-tl-xs border border-[#E5DDD3]'
                    : 'bg-[#3D2317] text-white rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {message.text}
                </div>

                {/* Citations Box */}
                {isBot && message.citations && message.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#F0EAE1] text-[11px] text-[#6D4C41] flex items-center gap-1.5 flex-wrap">
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
              placeholder={isListening ? 'Listening... Speak your question now' : `Ask about course forms, CGPA grading, carryovers, Faculty of Science, campus offices... (Press Enter to send)`}
              rows={2}
              className={`w-full resize-none border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-[#8D6E63] focus:outline-none focus:ring-2 focus:ring-[#4A2E1B] focus:border-transparent transition-all bg-[#FCFBF9] ${
                isListening ? 'border-red-500 ring-2 ring-red-200 bg-red-50/30 animate-pulse' : 'border-[#D7CCC8]'
              }`}
            />
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-red-600 text-white animate-bounce'
                : 'bg-[#F5F0EB] hover:bg-[#E5DDD3] text-[#3D2317] border border-[#D7CCC8]'
            }`}
            title={isListening ? 'Listening (Click to Stop)' : 'Speak your question (Voice Input)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

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
