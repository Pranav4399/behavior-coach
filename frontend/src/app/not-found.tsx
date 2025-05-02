'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, RefreshCw, Search } from 'lucide-react';

// Witty 404 messages to rotate through
const WITTY_MESSAGES = [
  "Oops! This page has gone to coach some behaviors elsewhere.",
  "404: Page not found. It's probably just taking a mental health day.",
  "Congratulations! You've discovered our secret 404 page. There's no prize though.",
  "This page was last seen heading to the break room and never returned.",
  "You've ventured into uncharted territory. Even our behavior coaches are confused.",
  "Page not found: It seems this content needs some coaching on how to exist.",
  "404: Digital hide-and-seek champion since 2023.",
  "Plot twist: The page was never here to begin with!",
  "This page is experiencing technical difficulties... or existential dread. Hard to tell.",
  "Our AI told us this page should exist, but our developers disagreed.",
];

// Fun facts about the number 404
const FACTS_ABOUT_404 = [
  "The HTTP 404 status code was created in 1992, making it older than many web developers.",
  "In some Asian cultures, the number 4 is considered unlucky because it sounds like the word for 'death'.",
  "404 is the sum of the squares of the first seven prime numbers (2²+3²+5²+7²+11²+13²+17² = 404).",
  "There's a beer called '404 Pale Ale' with the tagline 'Page Not Found'.",
  "If you type 404 on a calculator and look at it upside down, it spells 'hOh'.",
  "The area code 404 belongs to Atlanta, Georgia, coincidentally home to many tech companies.",
  "The first 404 error in history was displayed in CERN's HTTP server software.",
];

// Utility functions to get random items from arrays
const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export default function NotFoundPage() {
  const router = useRouter();
  const [message, setMessage] = useState(getRandomItem(WITTY_MESSAGES));
  const [fact, setFact] = useState(getRandomItem(FACTS_ABOUT_404));
  const [isSpinning, setIsSpinning] = useState(false);
  const [searchAttempts, setSearchAttempts] = useState(0);
  const [inputText, setInputText] = useState("");

  // Handle the "Try Again" button
  const handleTryAgain = () => {
    setIsSpinning(true);
    
    // After a short delay, change the message and fact
    setTimeout(() => {
      setMessage(getRandomItem(WITTY_MESSAGES));
      setFact(getRandomItem(FACTS_ABOUT_404));
      setIsSpinning(false);
    }, 800);
  };

  // Handle fake search attempts
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempts(prev => prev + 1);
    setInputText("");
    
    // After 3 search attempts, show an easter egg message
    if (searchAttempts >= 2) {
      setMessage("Nice try! But searching won't help. This page is professionally lost.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 flex flex-col items-center justify-center p-4 text-center">
      {/* Floating sparkles for visual interest */}
      <div className="absolute top-1/4 left-1/4 animate-pulse text-primary">
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-1/3 right-1/4 animate-pulse delay-300 text-primary">
        <Sparkles size={18} />
      </div>
      <div className="absolute top-1/3 right-1/3 animate-pulse delay-700 text-primary">
        <Sparkles size={32} />
      </div>
      
      {/* Main content */}
      <div className="max-w-2xl bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-blue-100">
        <h1 className="text-9xl font-bold text-primary mb-2 font-mono tracking-tighter">404</h1>
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-lg text-foreground/80 mb-4">{message}</p>
        </div>
        
        {/* Fun animations for the 404 */}
        <div className="relative mb-8 py-4">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="text-[180px] font-bold text-primary/20 animate-bounce">4</div>
            <div className="text-[180px] font-bold text-primary/20 animate-ping ml-4">0</div>
            <div className="text-[180px] font-bold text-primary/20 animate-bounce ml-4">4</div>
          </div>
          
          <div className="relative z-10 bg-primary/10 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Fun Fact:</h3>
            <p className="text-foreground/70 italic">{fact}</p>
          </div>
        </div>
        
        {/* Fake search bar that does nothing useful */}
        <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder={searchAttempts >= 2 ? "Really? Still trying?" : "Search for what you were looking for..."}
              className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <button className="absolute right-2 top-2 text-primary hover:text-primary/80" type="submit">
              Search
            </button>
          </div>
          {searchAttempts > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {searchAttempts === 1 
                ? "Nice try! But this search doesn't actually work." 
                : searchAttempts >= 3 
                  ? "You're persistent! I like that." 
                  : "Still trying? I admire your optimism!"}
            </p>
          )}
        </form>
        
        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          
          <Button onClick={handleTryAgain} variant="secondary" className={isSpinning ? 'animate-spin' : ''}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
            Try Another Joke
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          PS: If you keep seeing this page, you might want to check your URL or notify our developers 
          (who will blame it on the product team, who will blame it on the designers, who will blame it 
          on the business analysts, who will blame it on... you get the idea).
        </p>
      </div>
    </div>
  );
} 