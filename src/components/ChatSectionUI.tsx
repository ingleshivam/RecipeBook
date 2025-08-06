"use client";
import {
  ChatHandler,
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection as ChatSectionUI,
  Message,
  useChatUI,
} from "@llamaindex/chat-ui";
import { AnimatePresence, motion } from "framer-motion";
import "@llamaindex/chat-ui/styles/markdown.css";
import "@llamaindex/chat-ui/styles/pdf.css";
import "@llamaindex/chat-ui/styles/editor.css";
import { useState, useRef, useEffect } from "react";
import { main } from "@/actions/chabot/main";

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hi there! I'm your AI assistant.\nWhat's your favorite recipe?\nAsk me anything about it!",
  },
];

export function ChatSection() {
  const handler = useMockChat(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [handler.messages]);

  return (
    <div className="flex flex-col h-[80vh] max-h-[80vh] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <ChatSectionUI handler={handler}>
        <div className="flex flex-col h-full">
          {/* Chat header */}
          <div className="flex items-center p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  R
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">
                  Recipe Assistant
                </h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <CustomChatMessages />

          {/* Typing indicator */}
          {handler.isLoading && (
            <div className="px-6 py-3 flex items-center">
              <div className="flex space-x-1 px-4 py-2 bg-gray-100 rounded-full">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          {/* Chat input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <ChatInput className="bg-white rounded-lg">
              <ChatInput.Form className="flex items-center gap-2">
                <ChatInput.Field
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none bg-white"
                  placeholder="Type your recipe question..."
                />
                <ChatInput.Submit className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </ChatInput.Submit>
              </ChatInput.Form>
            </ChatInput>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </ChatSectionUI>
    </div>
  );
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatMessages>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <ChatMessage
                message={message}
                isLast={index === messages.length - 1}
                className={`max-w-[85%] ${
                  message.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`flex ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-end gap-3`}
                >
                  <ChatMessage.Avatar>
                    {message.role === "assistant" ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        R
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-medium">
                        U
                      </div>
                    )}
                  </ChatMessage.Avatar>
                  <ChatMessage.Content
                    isLoading={isLoading}
                    append={append}
                    className={`rounded-xl px-4 py-3 ${
                      message.role === "assistant"
                        ? "bg-white border border-gray-200 text-gray-800"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    <ChatMessage.Content.Markdown />
                  </ChatMessage.Content>
                </div>
              </ChatMessage>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </ChatMessages>
  );
}

function useMockChat(initMessages: Message[]): ChatHandler {
  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const append = async (
    message: Message,
    chatRequestOptions?: { data?: any }
  ): Promise<string | null | undefined> => {
    setIsLoading(true);
    setMessages((prev) => [...prev, message]);

    try {
      const res = await main(message.content);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            res?.join(",") ||
            "I couldn't find an answer to that. Could you try asking differently?",
        },
      ]);
      return res?.response ?? null;
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops, something went wrong. Please try again later.",
        },
      ]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    append,
  };
}
