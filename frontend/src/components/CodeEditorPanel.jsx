import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between px-5 py-3 bg-[#181824]/80 border-b border-[#00ff88]/10 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="w-7 h-7 rounded shadow-md border border-[#00ff88]/30 bg-[#10101a]"
          />
          <select
            className="px-3 py-1.5 rounded-lg bg-[#181824] border border-[#00ff88]/30 text-[#00ff88] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff88]/40 transition"
            value={selectedLanguage}
            onChange={onLanguageChange}
            style={{ color: '#00ff88', backgroundColor: '#181824' }}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key} style={{ color: '#00ff88', backgroundColor: '#181824' }}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00ff88] text-black font-bold text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="w-4 h-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            wordWrap: 'on',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;