import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

// ── Lightweight markdown → JSX renderer ──────────────────────────────────────
// Handles: emoji section headers (lines starting with emoji + text),
// **bold**, *italic*, numbered lists, bullet lists, and plain paragraphs.
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines (add spacing via margin on siblings)
    if (!trimmed) {
      i++;
      continue;
    }

    // Numbered list item:  "1." / "2." / "3."
    if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s*/, '');
      elements.push(
        <div key={i} className="flex gap-2 mt-2">
          <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-[#166E52] text-white text-[10px] font-black rounded-full mt-0.5">
            {trimmed.match(/^(\d+)/)[1]}
          </span>
          <span className="text-sm text-gray-700 leading-relaxed">{inlineFormat(content)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Bullet list item: "- " or "* "
    if (/^[-*]\s/.test(trimmed)) {
      const content = trimmed.replace(/^[-*]\s*/, '');
      elements.push(
        <div key={i} className="flex gap-2 mt-1.5 ml-1">
          <span className="shrink-0 text-[#166E52] font-black mt-0.5">•</span>
          <span className="text-sm text-gray-700 leading-relaxed">{inlineFormat(content)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Section header: starts with ## or ### (Gemini sometimes uses these)
    if (/^#{1,3}\s/.test(trimmed)) {
      const content = trimmed.replace(/^#{1,3}\s*/, '');
      elements.push(
        <p key={i} className="text-sm font-extrabold text-gray-900 mt-4 mb-1">
          {inlineFormat(content)}
        </p>
      );
      i++;
      continue;
    }

    // Emoji-led header line (e.g. "🌍 Carbon Estimate" or "💡 Tips")
    // Detect: line starts with an emoji character
    if (/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(trimmed)) {
      elements.push(
        <p key={i} className="text-sm font-extrabold text-gray-900 mt-4 mb-1.5 flex items-center gap-1.5">
          {inlineFormat(trimmed)}
        </p>
      );
      i++;
      continue;
    }

    // Plain paragraph line
    elements.push(
      <p key={i} className="text-sm text-gray-700 leading-relaxed mt-1">
        {inlineFormat(trimmed)}
      </p>
    );
    i++;
  }

  return elements;
}

// Inline formatting: **bold**, *italic*, `code`
function inlineFormat(text) {
  // Split on bold (**...**), italic (*...*), or code (`...`)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={idx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={idx} className="italic">{part.slice(1, -1)}</em>;
    }
    if (/^`[^`]+`$/.test(part)) {
      return <code key={idx} className="bg-gray-100 px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// FIX 8: default param replaces deprecated defaultProps
// FIX 9: compact PropType removed (never used in component body)
function InsightsPanel() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const responseRef = useRef(null);

  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.focus();
    }
  }, [response]);

  const safeResponse = (raw) => {
    if (typeof raw !== 'string') return '';
    if (raw.length > 10000) return raw.slice(0, 10000) + '\n\n[Response truncated]';
    return raw.replace(/<script[\s\S]*?<\/script>/gi, '')
              .replace(/<iframe[\s\S]*?>/gi, '');
  };

  const handleGetInsights = async () => {
    const userInput = inputText.trim();
    if (!userInput) {
      setErrorMessage('Please describe your day first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResponse('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput })
      });

      if (response.status === 503) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(
          errData.error || 
          'AI service temporarily unavailable. Try again shortly.'
        )
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Request failed')
      }

      const data = await response.json();

      if (!data.result) {
        throw new Error('No response received');
      }

      setResponse(safeResponse(data.result));

    } catch (err) {
      const errorMsg = err.message || 'Unable to get insights. Try again.';
      
      if (errorMsg.includes('API key not configured')) {
        setErrorMessage('⚙️ API key missing. Add GEMINI_API_KEY to Vercel environment variables.');
      } else if (errorMsg.includes('fetch') || errorMsg.includes('Failed to reach')) {
        setErrorMessage('Network error — make sure you have internet connection.');
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 bg-[#166E52]/10 rounded-lg text-[#166E52]">
          <Sparkles size={18} />
        </span>
        <h3 className="text-lg font-bold text-gray-950">🤖 AI Carbon Coach</h3>
        <span className="ml-auto text-[10px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Gemini
        </span>
      </div>

      <p className="text-xs text-gray-500 font-medium mb-4 leading-relaxed">
        Describe your day (food, transport, energy usage) to get an instant carbon estimate and personalized tips.
      </p>

      {/* Textarea Input */}
      <label htmlFor="insights-input" className="sr-only">Describe your day</label>
      <textarea
        id="insights-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="e.g. I drove 20km in a petrol car, had a beef burger for lunch, left my AC on for 3 hours, and bought a new shirt online."
        disabled={isLoading}
        rows={4}
        className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] resize-none transition-all duration-200 disabled:opacity-60"
      />

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleGetInsights}
        disabled={isLoading || !inputText.trim()}
        className="mt-3.5 w-full flex items-center justify-center gap-2 bg-[#166E52] text-white py-3 px-4 font-bold rounded-xl shadow-md hover:bg-[#0F6E56] active:translate-y-0.5 hover:-translate-y-0.5 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:-translate-y-0 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin text-gray-400" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>Get Insights</span>
          </>
        )}
      </button>

      {/* Result / Error Area */}
      <div className="mt-5 flex-1 overflow-y-auto" aria-live="polite" aria-busy={isLoading}>
        {isLoading && (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#166E52]" size={32} />
            <span className="text-xs font-semibold text-gray-400">Gemini is calculating your impact...</span>
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="bg-red-50/60 border border-red-100 rounded-xl p-4 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
            <div className="text-xs text-red-700 font-medium leading-relaxed space-y-1">
              <p className="font-bold">Could not connect to AI Coach</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {response && !isLoading && (
          <>
            <div 
              ref={responseRef}
              tabIndex={-1}
              className="border border-[#166E52]/20 bg-gradient-to-b from-[#166E52]/5 to-white rounded-xl p-4 animate-fadeIn overflow-y-auto max-h-[320px] min-h-[80px]"
            >
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {renderMarkdown(response)}
              </div>
            </div>
            {response.length > 400 && (
              <p className="text-[11px] text-[#6B7280] mt-2">
                Scroll to see full response ↓
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

InsightsPanel.propTypes = {};

export default React.memo(InsightsPanel);
