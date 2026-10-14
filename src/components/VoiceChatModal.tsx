import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  RotateCcw, 
  X, 
  Sparkles, 
  Radio, 
  Settings2, 
  MessageSquare,
  Compass,
  BookOpen,
  Info
} from 'lucide-react';
import { StudentProfile } from '../types';
import { PolyIbadanLogo } from './PolyIbadanLogo';

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile;
  onSendToTextChat?: (question: string) => void;
}

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'paused';

const SAMPLE_VOICE_PROMPTS = [
  "Where can I buy textbooks and GNS manuals?",
  "Where is the Faculty of Science located?",
  "Where do I buy engineering drawing tools and lab coats?",
  "How do I calculate CGPA for Distinction on NBTE 4.0?",
  "Where can I buy food or eat on campus?",
  "Where are the banks and ATMs on campus?",
  "How do I complete my course registration on the portal?",
  "What is the difference between 4-month SIWES and 1-year IT?"
];

export const VoiceChatModal: React.FC<VoiceChatModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  onSendToTextChat
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastBotReply, setLastBotReply] = useState<string>('');
  const [lastCitations, setLastCitations] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handsFreeMode, setHandsFreeMode] = useState(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isListeningRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize available voices from speech synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        // Prioritize Nigerian English, then British/American
        const ngIndex = voices.findIndex(v => v.lang.includes('NG') || v.lang.includes('ng'));
        const gbIndex = voices.findIndex(v => v.lang.includes('en-GB'));
        const usIndex = voices.findIndex(v => v.lang.includes('en-US'));
        if (ngIndex !== -1) {
          setSelectedVoiceIndex(ngIndex);
        } else if (gbIndex !== -1) {
          setSelectedVoiceIndex(gbIndex);
        } else if (usIndex !== -1) {
          setSelectedVoiceIndex(usIndex);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Set welcome message on open
  useEffect(() => {
    if (isOpen) {
      const welcome = `Hello ${studentProfile.name}! I am PolyAdvisor, your voice academic assistant. You can speak to me naturally about where to buy books, campus locations, portal course forms, or NBTE CGPA grading. Tap the microphone or say your question.`;
      setLastBotReply(welcome);
      setLastCitations(['The Polytechnic, Ibadan Academic Regulations']);
      speakResponse(welcome);
    } else {
      stopAllAudio();
    }
    return () => {
      stopAllAudio();
    };
  }, [isOpen]);

  // Audio simulation visualizer loop
  useEffect(() => {
    let phase = 0;
    const animate = () => {
      phase += 0.08;
      if (voiceState === 'listening') {
        setAudioLevel(0.4 + 0.5 * Math.abs(Math.sin(phase * 2)));
      } else if (voiceState === 'speaking') {
        setAudioLevel(0.5 + 0.45 * Math.abs(Math.cos(phase * 3)));
      } else if (voiceState === 'thinking') {
        setAudioLevel(0.25 + 0.2 * Math.sin(phase));
      } else {
        setAudioLevel(0.05);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [voiceState]);

  const stopAllAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
    isListeningRef.current = false;
    setVoiceState('idle');
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Your web browser does not support Speech Recognition. Please try Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');
    setVoiceState('listening');
    isListeningRef.current = true;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = 'en-NG'; // Nigerian English standard, browser auto-falls back to standard English

      recognition.onstart = () => {
        setVoiceState('listening');
        isListeningRef.current = true;
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentFinal) {
          setTranscript(currentFinal);
          handleVoiceQuery(currentFinal);
        } else if (currentInterim) {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice recognition error:', event.error);
        isListeningRef.current = false;
        if (event.error !== 'no-speech') {
          setErrorMessage(`Microphone error: ${event.error}. Please grant microphone access.`);
          setVoiceState('idle');
        } else {
          setVoiceState('idle');
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error('Failed to start speech recognition:', e);
      setErrorMessage('Could not initialize microphone. Please check system permissions.');
      setVoiceState('idle');
    }
  };

  const handleVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    isListeningRef.current = false;

    setVoiceState('thinking');
    setTranscript(queryText);
    setInterimTranscript('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          studentProfile
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I couldn't find an answer for that. Please try asking again.";
      setLastBotReply(reply);
      setLastCitations(data.citations || ['The Polytechnic, Ibadan Academic Handbook']);
      speakResponse(reply);
    } catch (error) {
      console.warn('Backend call failed, using client fallback:', error);
      // Fallback message
      const fallbackReply = `Regarding ${queryText}: For official textbooks, GNS manuals, and stationery, visit The Polytechnic, Ibadan Bookshop at Middle Campus near Central Library, or your departmental association secretariat. Course registration is completed on portal.polyibadan.edu.ng.`;
      setLastBotReply(fallbackReply);
      setLastCitations(['The Polytechnic, Ibadan Student Handbook']);
      speakResponse(fallbackReply);
    }
  };

  const speakResponse = (rawText: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceState('idle');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters for pleasant vocalization
    const cleanText = rawText
      .replace(/[*_#`\[\]]/g, '')
      .replace(/https?:\/\/\S+/g, 'link on the portal')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    if (availableVoices.length > 0 && availableVoices[selectedVoiceIndex]) {
      utterance.voice = availableVoices[selectedVoiceIndex];
    }

    utterance.onstart = () => {
      setVoiceState('speaking');
    };

    utterance.onend = () => {
      setVoiceState('idle');
      // If hands-free mode is on, automatically start listening for the student's reply!
      if (handsFreeMode && isOpen) {
        setTimeout(() => {
          startListening();
        }, 1200);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setVoiceState('idle');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePauseResume = () => {
    if (!window.speechSynthesis) return;

    if (voiceState === 'speaking') {
      window.speechSynthesis.pause();
      setVoiceState('paused');
    } else if (voiceState === 'paused') {
      window.speechSynthesis.resume();
      setVoiceState('speaking');
    }
  };

  const handleReplay = () => {
    if (lastBotReply) {
      speakResponse(lastBotReply);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2C180E]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E5DDD3] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#3D2317] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#543322]">
          <div className="flex items-center space-x-3">
            <PolyIbadanLogo size={36} className="shadow-xs" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-serif tracking-wide text-white">
                  PolyVoice · Live Voice Assistant
                </h3>
                <span className="text-[10px] bg-[#C69C6D] text-[#2C180E] font-black px-1.5 py-0.5 rounded uppercase">
                  Real-Time
                </span>
              </div>
              <p className="text-[11px] text-[#D7CCC8]">
                {studentProfile.department} · {studentProfile.level} ({studentProfile.program})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-[#D7CCC8] hover:text-white hover:bg-[#513121] rounded-lg transition-colors cursor-pointer"
              title="Voice Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                stopAllAudio();
                onClose();
              }}
              className="p-1.5 text-[#D7CCC8] hover:text-white hover:bg-[#513121] rounded-lg transition-colors cursor-pointer"
              title="Close Voice Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Settings Row */}
        {showSettings && (
          <div className="bg-white border-b border-[#E5DDD3] px-5 py-3 text-xs space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-[#3D2317]">Hands-Free Auto-Conversation:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={handsFreeMode}
                  onChange={(e) => setHandsFreeMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3D2317]"></div>
                <span className="ml-2 text-slate-700 font-medium">
                  {handsFreeMode ? 'Enabled (Auto-Listens)' : 'Push-to-Talk'}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#F0EAE1]">
              <span className="font-bold text-[#3D2317]">Speech Speed:</span>
              <div className="flex items-center gap-1.5">
                {[0.8, 1.0, 1.2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      speechRate === rate
                        ? 'bg-[#3D2317] text-white'
                        : 'bg-[#FAF7F2] text-[#3D2317] border border-[#E5DDD3]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {availableVoices.length > 0 && (
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#F0EAE1]">
                <span className="font-bold text-[#3D2317]">Synthesized Accent:</span>
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="bg-[#FAF7F2] border border-[#E5DDD3] rounded px-2 py-1 text-[11px] text-[#3D2317] max-w-xs focus:outline-none"
                >
                  {availableVoices.map((v, idx) => (
                    <option key={idx} value={idx}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Central Visualizer & Conversation Stage */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col items-center justify-center space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {voiceState === 'listening' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Listening to you... Speak now
              </span>
            )}
            {voiceState === 'thinking' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                Consulting Poly Ibadan knowledge base...
              </span>
            )}
            {voiceState === 'speaking' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] text-[#3D2317] text-xs font-bold border border-[#C69C6D]">
                <Volume2 className="w-3.5 h-3.5 text-[#3D2317] animate-bounce" />
                PolyAdvisor is answering...
              </span>
            )}
            {voiceState === 'paused' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300">
                <Pause className="w-3.5 h-3.5" />
                Audio Paused
              </span>
            )}
            {voiceState === 'idle' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                Ready · Tap mic to speak
              </span>
            )}
          </div>

          {/* Dynamic Audio Wave Orb */}
          <div className="relative flex items-center justify-center my-2">
            {/* Outer Pulsing Rings */}
            <div
              className={`absolute rounded-full transition-all duration-300 ${
                voiceState === 'listening'
                  ? 'bg-red-400/20 ring-4 ring-red-300/40'
                  : voiceState === 'speaking'
                  ? 'bg-[#C69C6D]/20 ring-4 ring-[#C69C6D]/40'
                  : 'bg-slate-200/50'
              }`}
              style={{
                width: `${160 + audioLevel * 70}px`,
                height: `${160 + audioLevel * 70}px`,
              }}
            />

            <div
              className={`absolute rounded-full transition-all duration-300 ${
                voiceState === 'listening'
                  ? 'bg-red-300/30'
                  : voiceState === 'speaking'
                  ? 'bg-[#3D2317]/15'
                  : 'bg-slate-100'
              }`}
              style={{
                width: `${125 + audioLevel * 45}px`,
                height: `${125 + audioLevel * 45}px`,
              }}
            />

            {/* Central Interactive Mic Button */}
            <button
              onClick={() => {
                if (voiceState === 'listening') {
                  if (recognitionRef.current) recognitionRef.current.stop();
                  setVoiceState('idle');
                } else if (voiceState === 'speaking') {
                  togglePauseResume();
                } else {
                  startListening();
                }
              }}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
                voiceState === 'listening'
                  ? 'bg-red-600 text-white'
                  : voiceState === 'speaking'
                  ? 'bg-[#3D2317] text-white ring-4 ring-[#C69C6D]'
                  : 'bg-[#3D2317] text-white'
              }`}
              title={voiceState === 'listening' ? 'Stop Listening' : 'Start Speaking'}
            >
              {voiceState === 'listening' ? (
                <MicOff className="w-9 h-9 animate-pulse" />
              ) : voiceState === 'speaking' ? (
                <Volume2 className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9 text-[#FAF7F2]" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">
                {voiceState === 'listening'
                  ? 'Tap to End'
                  : voiceState === 'speaking'
                  ? 'Pause'
                  : 'Speak'}
              </span>
            </button>
          </div>

          {/* Sound Wave Frequency Bars */}
          <div className="flex items-center justify-center gap-1.5 h-8 w-48">
            {[0.3, 0.6, 0.9, 0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.4].map((mult, i) => {
              const height = voiceState === 'speaking' || voiceState === 'listening'
                ? Math.max(6, Math.min(32, audioLevel * 32 * mult))
                : 4;
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    voiceState === 'listening'
                      ? 'bg-red-500'
                      : voiceState === 'speaking'
                      ? 'bg-[#3D2317]'
                      : 'bg-[#D7CCC8]'
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          {/* Live Transcript / Speech Display Box */}
          <div className="w-full bg-white border border-[#E5DDD3] rounded-2xl p-4 shadow-xs space-y-2">
            {/* What user said */}
            {(transcript || interimTranscript) && (
              <div className="text-xs text-slate-700 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E5DDD3]">
                <span className="font-bold text-[#3D2317] block mb-0.5">You asked:</span>
                <p className="italic">"{transcript || interimTranscript}"</p>
              </div>
            )}

            {/* Bot response text */}
            {lastBotReply && (
              <div className="text-xs text-slate-800 leading-relaxed max-h-36 overflow-y-auto pr-1">
                <span className="font-bold text-[#3D2317] block mb-1 flex items-center gap-1">
                  <PolyIbadanLogo size={16} />
                  PolyAdvisor Response:
                </span>
                <p className="whitespace-pre-line text-[#2C180E]">{lastBotReply}</p>

                {lastCitations && lastCitations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#F0EAE1] text-[10px] text-[#6D4C41]">
                    <strong>Source: </strong> {lastCitations.join(' · ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message if Any */}
          {errorMessage && (
            <div className="w-full p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs text-center font-medium animate-fadeIn">
              {errorMessage}
            </div>
          )}

          {/* Quick Voice Prompt Suggestions */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6D4C41]">
              <span className="font-bold flex items-center gap-1 text-[#3D2317]">
                <Sparkles className="w-3.5 h-3.5 text-[#C69C6D]" />
                Tap to Ask via Voice:
              </span>
              <span className="text-[11px]">Popular Questions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_VOICE_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVoiceQuery(prompt)}
                  className="text-left text-xs bg-white hover:bg-[#FAF7F2] text-[#3D2317] border border-[#E5DDD3] hover:border-[#C69C6D] p-2.5 rounded-xl transition-all cursor-pointer font-medium shadow-xs flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <Mic className="w-3.5 h-3.5 text-[#8D6E63] group-hover:text-[#3D2317] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Audio Controls & Switch to Text */}
        <div className="bg-white border-t border-[#E5DDD3] px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReplay}
              disabled={!lastBotReply || voiceState === 'thinking'}
              className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D2317] text-xs font-bold border border-[#E5DDD3] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Repeat last response"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat Answer</span>
            </button>

            {voiceState === 'speaking' || voiceState === 'paused' ? (
              <button
                onClick={togglePauseResume}
                className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D2317] text-xs font-bold border border-[#E5DDD3] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {voiceState === 'speaking' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{voiceState === 'speaking' ? 'Pause' : 'Resume'}</span>
              </button>
            ) : null}

            <button
              onClick={stopAllAudio}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs transition-colors cursor-pointer"
              title="Mute / Stop Audio"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {onSendToTextChat && transcript && (
              <button
                onClick={() => {
                  stopAllAudio();
                  onClose();
                  onSendToTextChat(transcript);
                }}
                className="px-3.5 py-1.5 bg-[#3D2317] hover:bg-[#2A160D] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Continue in Text Chat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
