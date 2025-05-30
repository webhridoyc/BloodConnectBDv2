"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, Send, X, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { supportChatbot, type SupportChatbotInput, type SupportChatbotOutput } from "@/ai/flows/support-chatbot";
import type { ChatMessage } from "@/lib/types";

export function SupportChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const initialMessage: ChatMessage = {
    id: "initial",
    role: "assistant",
    content: "Hi there! I'm BloodLink BD's support assistant. How can I help you today?",
    timestamp: new Date(),
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const chatbotInput: SupportChatbotInput = { question: userMessage.content };
      const response: SupportChatbotOutput = await supportChatbot(chatbotInput);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle support chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-[28rem] shadow-xl z-50 flex flex-col rounded-lg border bg-card text-card-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              <CardTitle className="text-lg">Support Chat</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
              <X size={18} />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                         <AvatarFallback><Bot size={18}/></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2 text-sm shadow",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                     {msg.role === "user" && (
                      <Avatar className="h-8 w-8">
                         <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot size={18}/></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm shadow">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
