
import React, { useState, useRef, useEffect } from 'react';
import { streamTutorResponse, generateImage, ChatHistoryItem, MessagePart } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ExtendedChatMessage extends ChatMessage {
  imageUrl?: string;
}

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    { role: 'model', text: 'Neural link established. I am CC. My logic cores are primed for deep analysis, advanced mathematics, and creative synthesis. How can I assist you?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{data: string, type: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setAttachedImage({ data: base64Data, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userText = input.trim() || (attachedImage ? "Please perform a deep analysis of this visual data." : "");
    const isImageRequest = /generate|draw|create|make an image|paint/i.test(userText);
    
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      if (isImageRequest && !attachedImage) {
        setMessages(prev => [...prev, { role: 'model', text: "Initializing Creative Core... Generating your requested visual data." }]);
        const imageUrl = await generateImage(userText);
        if (imageUrl) {
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { 
              role: 'model', 
              text: "Visual synthesis complete. Here is the generated asset based on your prompt:",
              imageUrl 
            };
            return newMsgs;
          });
        }
      } else {
        const history: ChatHistoryItem[] = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

        let imagePart: MessagePart | undefined;
        if (attachedImage) {
          imagePart = {
            inlineData: {
              mimeType: attachedImage.type,
              data: attachedImage.data
            }
          };
        }

        const stream = await streamTutorResponse(userText, history, imagePart);
        
        let fullResponse = "";
        setMessages(prev => [...prev, { role: 'model', text: "" }]);

        for await (const chunk of stream) {
          const chunkText = chunk.text || "";
          fullResponse += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Cognitive uplink interrupted. Request density is high. Please retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-transition max-w-5xl mx-auto h-[75vh] md:h-[80vh] flex flex-col bg-slate-950/40 rounded-[30px] md:rounded-[40px] border border-white/5 shadow-2xl overflow-hidden glass relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

      <div className="px-6 py-4 md:px-12 md:py-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 text-xs md:text-sm">
            CC
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-widest uppercase">CC</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:block px-3 py-1 rounded-full border border-amber-400/20 text-[9px] font-mono text-amber-400 uppercase bg-amber-400/5">PRO-V3</div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 md:space-y-8 custom-scrollbar relative z-10"
      >
        <div className="max-w-3xl mx-auto w-full space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`group flex flex-col ${msg.role === 'user' ? 'items-end max-w-[90%]' : 'items-start w-full'}`}>
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Neural Output</span>
                  </div>
                )}
                
                <div className={`relative p-4 md:p-7 rounded-[22px] md:rounded-[28px] ${
                  msg.role === 'user' 
                    ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none shadow-xl' 
                    : 'bg-white/[0.04] text-slate-200 border border-white/10 rounded-tl-none leading-relaxed text-xs md:text-base'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text || (isLoading && i === messages.length - 1 ? "..." : "")}</p>
                  {msg.imageUrl && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                      <img src={msg.imageUrl} alt="" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-10 bg-slate-900/60 border-t border-white/5 z-10">
        <div className="max-w-3xl mx-auto relative">
          
          {attachedImage && (
            <div className="absolute bottom-full mb-4 left-0 animate-page-in">
              <div className="relative group">
                <img 
                  src={`data:${attachedImage.type};base64,${attachedImage.data}`} 
                  className="w-16 h-16 object-cover rounded-xl border-2 border-amber-500 shadow-xl" 
                />
                <button 
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-2 -right-2 bg-slate-950 text-white w-5 h-5 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-500 transition-colors text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="relative flex items-end gap-2 bg-white/[0.04] border border-white/10 rounded-[28px] p-1.5 md:p-2 pr-3 md:pr-4 focus-within:border-amber-400/40 transition-all">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

            <textarea 
              rows={1}
              placeholder="Submit inquiry..."
              className="w-full bg-transparent border-none text-white outline-none py-3 px-1 text-sm md:text-base resize-none max-h-32 font-sans"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !attachedImage)}
              className="mb-0.5 p-3 bg-amber-500 text-slate-950 rounded-[20px] hover:bg-amber-400 transition-all disabled:opacity-20 active:scale-90"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Neural Tutor Uplink Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
