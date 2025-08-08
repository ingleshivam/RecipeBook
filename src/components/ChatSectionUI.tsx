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
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Recipe card skeleton component
const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow animate-pulse w-full">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
          ⭐ --
        </div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Recipe card component
const RecipeCard = ({ recipe }: { recipe: any }) => {
  const router = useRouter();

  const handleCardClick = () => {
    window.open(`/recipe/${recipe.recipeId}`, "_blank");
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer w-full"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={recipe.image || "/recipesImages/fallback_image.png"}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
          ⭐ {recipe.rating || 0}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>👤 {recipe.author}</span>
          <span>⏱️ {recipe.totalTime || 0} min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {recipe.category}
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

// Recipe carousel component
const RecipeCarousel = ({
  recipes,
  isLoading,
}: {
  recipes: any[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center">
          <RecipeCardSkeleton />
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>
          No recipes found. Try asking about different ingredients or cuisines!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "center",
          loop: true,
          slidesToScroll: 1,
          containScroll: "trimSnaps",
        }}
        className="w-full max-w-sm mx-auto relative"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {recipes.map((recipe: any, index: number) => (
            <CarouselItem
              key={recipe.recipeId || index}
              className="pl-2 md:pl-4 basis-full"
            >
              <div className="p-1">
                <RecipeCard recipe={recipe} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {recipes.length > 1 && (
          <>
            <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-gray-300 shadow-md" />
            <CarouselNext className="right-2 bg-white/80 hover:bg-white border-gray-300 shadow-md" />
          </>
        )}
      </Carousel>
    </div>
  );
};

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
    <div className="flex flex-col h-[90vh] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
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
          <div className="p-4 border-t border-gray-200">
            {/* <div className="relative p-[2px] rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient"> */}
            <div className="w-full h-full bg-white rounded-lg relative z-10">
              <ChatInput className="relative p-[2px]  bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient">
                <ChatInput.Form className="flex items-center gap-2 w-full h-full">
                  <ChatInput.Field
                    className="flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-0 focus:border-0 bg-white rounded-none chat-input-override"
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
            {/* </div> */}
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
  const [recipeCards, setRecipeCards] = useState<{ [key: number]: any }>({});
  const [loadingRecipes, setLoadingRecipes] = useState<number[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to extract recipe IDs from chatbot response
  const extractRecipeIds = (content: string): number[] => {
    // Look for numbers in the response that could be recipe IDs
    // This will match standalone numbers that are likely recipe IDs
    const numbers = content.match(/\b\d+\b/g);
    if (numbers) {
      // Filter out very small numbers (likely not recipe IDs) and very large numbers
      return numbers
        .map((num) => parseInt(num))
        .filter((id) => id > 0 && id < 10000); // Assuming recipe IDs are reasonable numbers
    }
    return [];
  };

  // Function to fetch recipe details
  const fetchRecipeDetails = async (recipeId: number) => {
    setLoadingRecipes((prev) => [...prev, recipeId]);
    try {
      const response = await fetch(`/api/getRecipeDetailsById?id=${recipeId}`);
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
    } catch (error) {
      console.error(`Error fetching recipe ${recipeId}:`, error);
    } finally {
      setLoadingRecipes((prev) => prev.filter((id) => id !== recipeId));
    }
    return null;
  };

  // Process messages to extract recipe IDs and fetch details
  useEffect(() => {
    const processMessages = async () => {
      const newRecipeCards: { [key: number]: any } = { ...recipeCards };

      for (const message of messages) {
        if (message.role === "assistant") {
          const recipeIds = extractRecipeIds(message.content);

          for (const recipeId of recipeIds) {
            if (!newRecipeCards[recipeId]) {
              const recipeDetails = await fetchRecipeDetails(recipeId);
              if (recipeDetails) {
                newRecipeCards[recipeId] = recipeDetails;
              }
            }
          }
        }
      }

      setRecipeCards(newRecipeCards);
    };

    processMessages();
  }, [messages]);

  return (
    <ChatMessages>
      <div className="flex-1 overflow-y-auto  space-y-4 ">
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
                  {message.role === "assistant" ? (
                    <ChatMessage.Avatar>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        R
                      </div>
                    </ChatMessage.Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-medium">
                      U
                    </div>
                  )}
                  <ChatMessage.Content
                    isLoading={isLoading}
                    append={append}
                    className={`rounded-xl px-2 py-2 ${
                      message.role === "assistant"
                        ? "bg-white border border-gray-200 text-gray-800 w-full"
                        : "bg-gray-900 text-white max-w-xs"
                    }`}
                  >
                    {/* Display recipe cards for assistant messages */}
                    {message.role === "assistant" &&
                      (() => {
                        const recipeIds = extractRecipeIds(message.content);
                        const hasRecipeIds = recipeIds.length > 0;

                        if (hasRecipeIds) {
                          const hasRecipeCards =
                            Object.values(recipeCards).length > 0;
                          const isLoading = loadingRecipes.length > 0;

                          return (
                            <div className="w-[200px]">
                              <RecipeCarousel
                                recipes={Object.values(recipeCards)}
                                isLoading={isLoading}
                              />
                            </div>
                          );
                        }
                        return null;
                      })()}

                    {/* Only show markdown content if there are no recipe IDs */}
                    {message.role === "assistant" &&
                      (() => {
                        const recipeIds = extractRecipeIds(message.content);
                        if (recipeIds.length === 0) {
                          return <ChatMessage.Content.Markdown />;
                        }
                        return null;
                      })()}

                    {/* Show user message content */}
                    {message.role === "user" && (
                      <div className="text-white">{message.content}</div>
                    )}
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
