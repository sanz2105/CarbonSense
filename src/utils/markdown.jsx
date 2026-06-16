// Lightweight markdown → JSX renderer
// Handles: emoji headers, **bold**, *italic*, 
// numbered lists, bullet lists, plain paragraphs

function inlineFormat(text) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  )
  return parts.map((part, idx) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={idx} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={idx} className="italic">{part.slice(1, -1)}</em>
    }
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code key={idx} className="bg-gray-100 px-1 rounded text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

export function renderMarkdown(text) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) { i++; continue }

    if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s*/, '')
      elements.push(
        <div key={i} className="flex gap-2 mt-2">
          <span className="shrink-0 w-5 h-5 flex items-center justify-center bg-[#1D9E75] text-white text-[10px] font-black rounded-full mt-0.5">
            {trimmed.match(/^(\d+)/)[1]}
          </span>
          <span className="text-sm text-gray-700 leading-relaxed">
            {inlineFormat(content)}
          </span>
        </div>
      )
      i++; continue
    }

    if (/^[-*]\s/.test(trimmed)) {
      const content = trimmed.replace(/^[-*]\s*/, '')
      elements.push(
        <div key={i} className="flex gap-2 mt-1.5 ml-1">
          <span className="shrink-0 text-[#1D9E75] font-black mt-0.5">•</span>
          <span className="text-sm text-gray-700 leading-relaxed">
            {inlineFormat(content)}
          </span>
        </div>
      )
      i++; continue
    }

    if (/^#{1,3}\s/.test(trimmed)) {
      const content = trimmed.replace(/^#{1,3}\s*/, '')
      elements.push(
        <p key={i} className="text-sm font-extrabold text-gray-900 mt-4 mb-1">
          {inlineFormat(content)}
        </p>
      )
      i++; continue
    }

    if (/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(trimmed)) {
      elements.push(
        <p key={i} className="text-sm font-extrabold text-gray-900 mt-4 mb-1.5 flex items-center gap-1.5">
          {inlineFormat(trimmed)}
        </p>
      )
      i++; continue
    }

    elements.push(
      <p key={i} className="text-sm text-gray-700 leading-relaxed mt-1">
        {inlineFormat(trimmed)}
      </p>
    )
    i++
  }
  return elements
}
