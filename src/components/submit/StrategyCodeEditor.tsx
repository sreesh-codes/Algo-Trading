"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Code2,
  Upload,
  Copy,
  Check,
  RotateCcw,
  FileCode2,
  Terminal,
  FileText,
  Sparkles,
} from "lucide-react";
import { DEFAULT_PYTHON_STRATEGY } from "@/services/api/submission";

interface StrategyCodeEditorProps {
  code: string;
  onChangeCode: (code: string) => void;
  filename: string;
  onChangeFilename: (name: string) => void;
  isValidated: boolean;
  onResetValidation: () => void;
}

// Tokenizer & Syntax Highlighter for Python
function highlightPython(code: string): string {
  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const lines = code.split("\n");
  let inDocstring = false;
  let docstringQuote = "";

  return lines
    .map((line) => {
      let processed = "";
      let i = 0;

      // Check if continuing multiline docstring
      if (inDocstring) {
        const closeIdx = line.indexOf(docstringQuote);
        if (closeIdx !== -1) {
          processed += `<span class="text-[#72859B] italic">${escapeHtml(
            line.slice(0, closeIdx + 3)
          )}</span>`;
          i = closeIdx + 3;
          inDocstring = false;
        } else {
          return `<span class="text-[#72859B] italic">${escapeHtml(line)}</span>`;
        }
      }

      while (i < line.length) {
        // Docstrings """ or '''
        if (line.slice(i, i + 3) === '"""' || line.slice(i, i + 3) === "'''") {
          docstringQuote = line.slice(i, i + 3);
          const endIdx = line.indexOf(docstringQuote, i + 3);
          if (endIdx !== -1) {
            processed += `<span class="text-[#72859B] italic">${escapeHtml(
              line.slice(i, endIdx + 3)
            )}</span>`;
            i = endIdx + 3;
          } else {
            inDocstring = true;
            processed += `<span class="text-[#72859B] italic">${escapeHtml(
              line.slice(i)
            )}</span>`;
            i = line.length;
          }
          continue;
        }

        // Single line comments
        if (line[i] === "#") {
          processed += `<span class="text-[#64748B] italic">${escapeHtml(
            line.slice(i)
          )}</span>`;
          break;
        }

        // Single & double quoted strings
        if (line[i] === '"' || line[i] === "'") {
          const quote = line[i];
          let end = i + 1;
          while (end < line.length && line[end] !== quote) {
            if (line[end] === "\\") end++; // escape char
            end++;
          }
          if (end < line.length) end++; // include closing quote
          processed += `<span class="text-[#05CD99]">${escapeHtml(
            line.slice(i, end)
          )}</span>`;
          i = end;
          continue;
        }

        // Numbers
        const numMatch = line.slice(i).match(/^(\b\d+(\.\d+)?([eE][+-]?\d+)?\b)/);
        if (numMatch) {
          processed += `<span class="text-[#F59E0B] font-mono">${numMatch[0]}</span>`;
          i += numMatch[0].length;
          continue;
        }

        // Words / Identifiers
        const wordMatch = line.slice(i).match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (wordMatch) {
          const word = wordMatch[0];
          const pythonKeywords = new Set([
            "def",
            "class",
            "return",
            "if",
            "elif",
            "else",
            "import",
            "from",
            "as",
            "for",
            "in",
            "while",
            "try",
            "except",
            "finally",
            "with",
            "not",
            "and",
            "or",
            "is",
            "lambda",
            "pass",
            "raise",
            "break",
            "continue",
            "yield",
            "assert",
          ]);

          const builtins = new Set([
            "self",
            "None",
            "True",
            "False",
            "min",
            "max",
            "round",
            "len",
            "range",
            "int",
            "float",
            "str",
            "dict",
            "list",
            "set",
            "tuple",
            "print",
            "Any",
            "Dict",
            "Optional",
          ]);

          if (pythonKeywords.has(word)) {
            processed += `<span class="text-[#EC4899] font-medium">${word}</span>`;
          } else if (word === "self") {
            processed += `<span class="text-[#00F0FF] italic">${word}</span>`;
          } else if (builtins.has(word)) {
            processed += `<span class="text-[#60A5FA] font-medium">${word}</span>`;
          } else if (
            word === "MyStrategy" ||
            word === "TradingBot" ||
            /^[A-Z][a-zA-Z0-9_]*$/.test(word)
          ) {
            processed += `<span class="text-[#D4AF37] font-semibold">${word}</span>`;
          } else if (
            line.slice(i + word.length).trim().startsWith("(")
          ) {
            processed += `<span class="text-[#38BDF8]">${word}</span>`;
          } else {
            processed += `<span class="text-[#E2E8F0]">${word}</span>`;
          }
          i += word.length;
          continue;
        }

        // Operators & Punctuation
        processed += escapeHtml(line[i]);
        i++;
      }

      return processed || "&nbsp;";
    })
    .join("\n");
}

export const StrategyCodeEditor: React.FC<StrategyCodeEditorProps> = ({
  code,
  onChangeCode,
  filename,
  onChangeFilename,
  isValidated,
  onResetValidation,
}) => {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"code" | "preview">("code");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const charCount = useMemo(() => code.length, [code]);

  // Keep pre and textarea scroll in sync
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChangeFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onChangeCode(text);
        onResetValidation();
      }
    };
    reader.readAsText(file);
  };

  const handleResetTemplate = () => {
    onChangeCode(DEFAULT_PYTHON_STRATEGY);
    onChangeFilename("my_strategy.py");
    onResetValidation();
  };

  const highlightedHtml = useMemo(() => highlightPython(code), [code]);

  return (
    <div className="space-y-3">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-100 font-sans">
            Upload or Edit Strategy Algorithm
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Python 3.12 entrypoint implementing <code className="text-slate-300 font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded border border-white/10">class MyStrategy.on_tick(market)</code>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".py,.txt"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Upload .py</span>
          </button>

          <button
            type="button"
            onClick={handleResetTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition cursor-pointer"
            title="Reset to default continuous arbitrage template"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Template</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#05CD99]" />
                <span className="text-[#05CD99]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Shell Container */}
      <div className="w-full bg-gradient-to-b from-[#0A0E1A] to-[#04060A] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        {/* Editor Titlebar / Tabs */}
        <div className="bg-[#0A0E18]/80 backdrop-blur-md px-4 py-2.5 border-b border-white/8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* macOS-style window controls */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>

            {/* Active Tab */}
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-gradient-to-r from-[#101625] to-[#151B2E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/10 text-xs font-mono text-white">
              <FileCode2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <input
                type="text"
                value={filename}
                onChange={(e) => onChangeFilename(e.target.value)}
                className="bg-transparent text-white font-mono text-xs focus:outline-none border-b border-transparent focus:border-[#D4AF37] w-36"
              />
              <span className="text-[10px] text-slate-500">●</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-slate-500 text-xs font-mono">
              <FileText className="w-3 h-3" />
              <span>requirements.txt</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-sans font-medium">
            {isValidated ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Syntax & API Validated
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400/90">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                Pending Validation
              </span>
            )}
          </div>
        </div>

        {/* Editor Body */}
        <div className="relative flex min-h-[460px] max-h-[580px] bg-transparent overflow-hidden text-xs font-mono font-normal">
          {/* Line Numbers Gutter */}
          <div className="w-12 bg-[#080C16] border-r border-white/6 py-4 select-none shrink-0 text-right pr-3 text-slate-600 font-mono text-[11px] leading-[22px]">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>

          {/* Interactive Code Container */}
          <div className="relative flex-1 overflow-hidden">
            {/* Syntax Highlighted Display Layer */}
            <pre
              ref={preRef}
              aria-hidden="true"
              className="absolute inset-0 p-4 m-0 overflow-hidden pointer-events-none text-slate-200 font-mono text-xs leading-[22px] whitespace-pre tab-4"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />

            {/* Editable Transparent Overlay Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => {
                onChangeCode(e.target.value);
                if (isValidated) onResetValidation();
              }}
              onScroll={handleScroll}
              spellCheck={false}
              className="absolute inset-0 w-full h-full p-4 m-0 bg-transparent text-transparent caret-[#00F0FF] font-mono text-xs leading-[22px] whitespace-pre outline-none resize-none tab-4 selection:bg-[#D4AF37]/25 selection:text-white"
            />
          </div>
        </div>

        {/* Editor Telemetry Status Bar */}
        <div className="bg-[#090D17] border-t border-white/8 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
              PYTHON 3.12 (CPython C-API)
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Lines: <strong className="text-white">{lineCount}</strong>
            </span>
            <span>
              Bytes: <strong className="text-white">{charCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">Encoding: UTF-8 LF</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Entry: <span className="text-[#D4AF37]">class MyStrategy.on_tick</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
