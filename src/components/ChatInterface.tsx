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
import { 
  SUGGESTED_QUESTIONS, 
  INSTITUTION_INFO, 
  VERIFIED_FAQS,
  FACULTIES,
  CAMPUS_OFFICES
} from '../data/polyIbadanData';
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
  const [speechHint, setSpeechHint] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Voice Input (Speech-to-Text) Toggle
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechHint('Voice input requires Chrome, Edge, or Safari on your device.');
      setTimeout(() => setSpeechHint(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-NG'; // Nigerian English standard, gracefully falls back

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechHint('Listening... Speak your question now.');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechHint(`Microphone error: ${event.error}. Please check mic permissions.`);
          setTimeout(() => setSpeechHint(null), 4000);
        } else {
          setSpeechHint(null);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechHint(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.warn('Speech recognition failed to start:', e);
      setIsListening(false);
      setSpeechHint('Could not access microphone. Please check permissions.');
      setTimeout(() => setSpeechHint(null), 4000);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

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
      console.warn('Backend API unavailable, utilizing verified institutional database:', error);

      const lower = text.toLowerCase();
      let replyText = '';
      let citations = ['The Polytechnic, Ibadan Academic Regulations'];
      let suggestedFollowUps = [
        'Where is the Faculty of Science located?',
        'How do I register courses on the student portal?',
        'What is the required CGPA for HND admission?'
      ];
      let requiresAdvisingEscalation = false;

      // 1. Check Faculty & Department Locations
      const facultyMatch = FACULTIES.find(f => 
        lower.includes(f.name.toLowerCase()) || 
        lower.includes(f.code.toLowerCase()) ||
        f.departments.some(d => lower.includes(d.toLowerCase()))
      );

      if (facultyMatch && (lower.includes('where') || lower.includes('locate') || lower.includes('campus') || lower.includes('address') || lower.includes('find') || lower.includes('science') || lower.includes('engineering') || lower.includes('faculty'))) {
        replyText = `**Location of ${facultyMatch.name} (${facultyMatch.code})**\n\nThe **${facultyMatch.name}** is located at the **${facultyMatch.campus}** of The Polytechnic, Ibadan.\n\n- **Campus Zone:** ${facultyMatch.campus} (along the Sango-Eleyele axis)\n- **Departments in this Faculty:**\n${facultyMatch.departments.map(d => `  * ${d}`).join('\n')}\n\n*Directions:* Enter via the main Sango gate. The faculty buildings are prominently positioned with clear directional signposts near the departmental lecture halls. Office hours for HODs and lecturers are Monday to Friday, 8:00 AM – 4:00 PM.`;
        citations = ['The Polytechnic, Ibadan Campus Directorate & Physical Planning Map'];
        suggestedFollowUps = [
          'Where is the ICT / MIS Centre located on North Campus?',
          'Where is the Directorate of Student Affairs (DSA)?',
          'How do I register courses on the student portal?'
        ];
      }
      // 2. Check Transit between North and South Campus
      else if (lower.includes('transit') || lower.includes('shuttle') || (lower.includes('north') && lower.includes('south')) || lower.includes('bus') || lower.includes('keke') || lower.includes('move between')) {
        replyText = `**Transiting Between North Campus and South Campus**\n\nThe Polytechnic, Ibadan operates across two main campus zones situated along the Sango-Eleyele corridor:\n\n1. **Campus Shuttle Buses:** Board licensed internal campus shuttles at the North Campus Central Park (near Faculty of Engineering) or South Campus Park (near FBCS). Fare is typically nominal (₦100 - ₦150).\n2. **Keke Napep (Tricycles):** Constant intra-campus tricycles operate between the Main Sango Gate, Middle Campus (Library/DSA/Clinic), and South Campus (Apete Gate axis).\n3. **Walking Route:** Approximately 10–15 minutes brisk walk along the designated pedestrian walkways.\n\n*Tip:* Always have your Student ID card accessible when moving between campuses during examinations.`;
        citations = ['Poly Ibadan Directorate of Student Affairs Transit Guidelines'];
        suggestedFollowUps = [
          'Where is the Poly Clinic located?',
          'Where is the Central Library located?',
          'What are the approved fees for hostel accommodation?'
        ];
      }
      // 3. Check Campus Offices (Clinic, DSA, MIS/ICT, Library, Hostels)
      else {
        const officeMatch = CAMPUS_OFFICES.find(o =>
          lower.includes(o.name.toLowerCase()) ||
          (lower.includes('clinic') && o.name.toLowerCase().includes('clinic')) ||
          (lower.includes('hospital') && o.name.toLowerCase().includes('clinic')) ||
          (lower.includes('health') && o.name.toLowerCase().includes('clinic')) ||
          (lower.includes('library') && o.name.toLowerCase().includes('library')) ||
          (lower.includes('dsa') && o.name.toLowerCase().includes('student affairs')) ||
          (lower.includes('affairs') && o.name.toLowerCase().includes('student affairs')) ||
          (lower.includes('ict') && o.name.toLowerCase().includes('mis')) ||
          (lower.includes('mis') && o.name.toLowerCase().includes('mis')) ||
          (lower.includes('portal') && o.name.toLowerCase().includes('mis')) ||
          (lower.includes('bursary') && o.name.toLowerCase().includes('bursary'))
        );

        if (officeMatch) {
          replyText = `**${officeMatch.name}**\n\n- **Location:** ${officeMatch.location}\n- **Services:** ${officeMatch.role}\n- **Operational Hours:** ${officeMatch.hours}\n\n*Assistance Note:* Bring your valid Student ID card and admission docket when visiting for official clearances.`;
          citations = ['The Polytechnic, Ibadan Administrative Offices Directory'];
          suggestedFollowUps = [
            'Where is the Faculty of Science located?',
            'What documents are needed for course clearance?',
            'How do I calculate my CGPA on the 4.0 scale?'
          ];
        } else {
          // 4. Check Verified FAQs
          const matchedFaq = VERIFIED_FAQS.find(faq =>
            faq.tags.some(tag => lower.includes(tag.toLowerCase())) ||
            lower.includes(faq.category.toLowerCase()) ||
            faq.question.toLowerCase().split(' ').some(word => word.length > 4 && lower.includes(word))
          );

          if (matchedFaq) {
            replyText = `**${matchedFaq.question}**\n\n${matchedFaq.detailedAnswer}\n\n*Official Source:* ${matchedFaq.policyReference}`;
            citations = [matchedFaq.policyReference || 'The Polytechnic, Ibadan Student Handbook'];
            suggestedFollowUps = [
              'Where is the Faculty of Science located?',
              'What are the requirements for HND admission?',
              'How do I calculate my CGPA on the 4.0 scale?'
            ];
          } else {
            // 5. Universal Helpful Fallback for Any School Inquiry
            replyText = `Welcome to **The Polytechnic, Ibadan** Student Academic & Campus Guide!\n\nI can assist you with any questions regarding our institution:\n- **Campus & Faculty Locations:** (e.g. *"Where is the Faculty of Science located?"*, *"Where is the Poly Clinic?"*, *"How do I find the ICT Centre?"*)\n- **North ↔ South Campus Transit:** (Shuttles, tricycles, gate routes)\n- **Course Registration & Student Portal:** (\`portal.polyibadan.edu.ng\`, credit units 18–24, 4 colored signed copies)\n- **NBTE 4.0 Grading & CGPA:** (Distinction 3.50+, Upper Credit 3.00+, Lower Credit 2.50+, Pass 2.00+, Probation)\n- **Hostels & Campus Life:** (Unity Hall, Ramat Hall, Olori Hall, SUG, Poly Clinic)\n- **SIWES & 1-Year Cognate IT:** (Mandatory IT for HND admission)\n\nPlease ask any specific question about your department or campus!`;
            citations = ['The Polytechnic, Ibadan Academic Regulations & Student Handbook'];
          }
        }
      }

      if (lower.includes('dispute') || lower.includes('missing score') || lower.includes('exam malpractice') || lower.includes('expulsion') || lower.includes('probation')) {
        requiresAdvisingEscalation = true;
      }

      const fallbackMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        suggestedFollowUps,
        requiresAdvisingEscalation
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
        {/* Speech Hint / Error Banner */}
        {speechHint && (
          <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              {speechHint}
            </span>
            <button
              onClick={() => setSpeechHint(null)}
              className="text-amber-800 hover:text-amber-950 font-bold ml-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

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
              placeholder={isListening ? "Listening... Speak your question now" : "Ask about course forms, CGPA grading, carryovers, 1-year IT, fees... (Press Enter to send)"}
              rows={2}
              className={`w-full resize-none border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-[#8D6E63] focus:outline-none transition-all ${
                isListening 
                  ? 'border-red-400 bg-red-50/30 ring-2 ring-red-300' 
                  : 'border-[#D7CCC8] bg-[#FCFBF9] focus:ring-2 focus:ring-[#4A2E1B] focus:border-transparent'
              }`}
            />
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl font-bold transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                : 'bg-[#FAF7F2] text-[#3D2317] border border-[#E5DDD3] hover:bg-[#EFE8DE]'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak your question (Voice Input)'}
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#3D2317]" />}
          </button>

          {/* Send Button */}
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
          <span className="font-medium">🎙️ Voice &amp; Text Supported · NBTE 4.0</span>
        </div>
      </div>
    </div>
  );
};
