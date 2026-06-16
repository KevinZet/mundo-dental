import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { MessageSquare, X, Send, Smile, Info, ArrowUpRight } from "lucide-react";

interface DentibotChatProps {
  messages: Message[];
  isChatLoading: boolean;
  submitChat: (text: string) => Promise<void>;
  changeTab: (tab: string) => void;
}

export default function DentibotChat({ messages, isChatLoading, submitChat, changeTab }: DentibotChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isChatLoading) return;

    const textToSubmit = input;
    setInput("");
    await submitChat(textToSubmit);
  };

  const handleQuickQuestion = async (question: string) => {
    if (isChatLoading) return;
    await submitChat(question);
  };

  // Extract last assistant suggestions
  const getLastSuggestions = (): string[] => {
    if (isChatLoading) return [];
    // Fallbacks
    return ["¿Dónde quedan las 3 sedes?", "Cuéntame de la promo escolar S/100", "Limpieza de S/50"];
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans" id="dentibot-widget-container">
      {/* Chat Bubble trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-full shadow-lg hover:shadow-sky-300 transition-all duration-300 flex items-center justify-center relative group"
          id="dentibot-trigger-btn"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-white font-bold items-center justify-center">1</span>
          </span>
          <MessageSquare className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-xs font-bold ml-0 group-hover:ml-2">
            ¿Consultas? Habla con Dentibot
          </span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div
          className="bg-white rounded-2xl shadow-2xl border border-sky-100 flex flex-col w-[350px] sm:w-[380px] h-[520px] overflow-hidden"
          id="dentibot-chat-dialog"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-[#00B4D8] p-4 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-xl flex items-center justify-center">
                <Smile className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">Dentibot IA 🦷</h4>
                <p className="text-[10px] text-sky-100 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  Especialista de Mundo Dental
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sky-50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              id="close-chat-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Banner alert info */}
          <div className="bg-sky-50 px-3 py-2 text-[10px] text-sky-800 border-b border-sky-100 flex items-center justify-between">
            <span className="flex items-center font-medium">
              <Info className="h-3 w-3 mr-1 text-[#0077B6]" />
              ¿Quieres agendar cita hoy?
            </span>
            <button
              onClick={() => {
                changeTab("promociones");
                setIsOpen(false);
              }}
              className="font-bold underline hover:text-sky-950 flex items-center"
            >
              Ver Promos <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
            </button>
          </div>

          {/* Body Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" id="chat-messages-container">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                  }`}
                >
                  {/* Quick markdown interpreter for strong elements and line breaks */}
                  {m.content.split("\n\n").map((para, pi) => (
                    <p key={pi} className={pi > 0 ? "mt-2" : ""}>
                      {para.split("\n").map((line, li) => (
                        <span key={li} className="block">
                          {line.split("**").map((chunk, ci) => {
                            if (ci % 2 === 1) {
                              return <strong key={ci} className="font-bold underline text-emerald-600 dark:text-emerald-400">{chunk}</strong>;
                            }
                            return chunk;
                          })}
                        </span>
                      ))}
                    </p>
                  ))}
                  <span
                    className={`block text-[8px] mt-1 text-right ${
                      m.role === "user" ? "text-sky-200" : "text-slate-400"
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-1.5 messages-loading">
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions list */}
          <div className="p-2.5 border-t border-sky-50 bg-white">
            <p className="text-[10px] text-slate-400 font-medium mb-1 px-1.5">Preguntas populares:</p>
            <div className="flex flex-wrap gap-1 px-1 max-h-24 overflow-y-auto">
              {getLastSuggestions().map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(s)}
                  disabled={isChatLoading}
                  className="text-[9px] font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 hover:text-sky-900 border border-sky-100 px-2 py-1 rounded-full transition-all text-left truncate max-w-full"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              disabled={isChatLoading}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400"
              id="chat-text-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isChatLoading}
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white p-2 rounded-xl shadow-md transition-colors flex items-center justify-center"
              id="send-chat-msg-btn"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
