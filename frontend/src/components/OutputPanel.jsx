function OutputPanel({ output }) {
  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="px-5 py-2 bg-[#181824]/80 border-b border-[#00ff88]/10 rounded-t-2xl font-semibold text-sm text-[#00ff88] tracking-wide">
        Output
      </div>
      <div className="flex-1 overflow-auto p-5 bg-transparent">
        {output === null ? (
          <p className="text-[#00ff88]/60 text-sm">Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <pre className="text-sm font-mono text-[#00ff88] whitespace-pre-wrap">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-red-400 whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;