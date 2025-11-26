/**
 * Format AI response text - Parse markdown và format đẹp
 * Loại bỏ markdown syntax, format line breaks, lists
 */

export function formatAIText(text: string): string {
  if (!text) return ''

  let formatted = text

  // Loại bỏ markdown bold **text** → text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '$1')

  // Loại bỏ markdown italic *text* → text
  formatted = formatted.replace(/\*(.*?)\*/g, '$1')

  // Convert \n\n thành double line breaks (paragraphs)
  formatted = formatted.replace(/\n\n+/g, '\n\n')

  // Convert \n thành single line break
  formatted = formatted.replace(/\n/g, '\n')

  // Loại bỏ markdown headers # ## ###
  formatted = formatted.replace(/^#{1,6}\s+/gm, '')

  // Loại bỏ markdown list markers - * + nhưng giữ nội dung
  // Giữ lại format list nhưng không dùng markdown syntax
  formatted = formatted.replace(/^[\-\*\+]\s+/gm, '• ')

  // Loại bỏ markdown code blocks ```
  formatted = formatted.replace(/```[\w]*\n?/g, '')
  formatted = formatted.replace(/```/g, '')

  // Trim whitespace
  formatted = formatted.trim()

  return formatted
}

/**
 * Parse text thành array of lines để render với Text components
 * Mỗi line có thể có format riêng
 */
export function parseAITextToLines(text: string): string[] {
  const formatted = formatAIText(text)
  
  // Split by line breaks
  const lines = formatted.split('\n')
  
  // Filter empty lines nếu có quá nhiều
  return lines.filter((line, index) => {
    // Giữ empty lines nếu là paragraph break
    if (line.trim() === '' && index > 0 && lines[index - 1]?.trim() !== '') {
      return true
    }
    return line.trim() !== '' || index === 0
  })
}

