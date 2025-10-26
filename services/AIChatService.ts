import { OPENAI_API_KEY, OPENAI_MODEL } from '@/constants'

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

class AIChatService {
  async sendChat(messages: ChatMessage[]): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('Chưa cấu hình OPENAI_API_KEY. Hãy thêm vào .env hoặc app.json -> expo.extra.OPENAI_API_KEY')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    const content: string = data?.choices?.[0]?.message?.content || ''
    return content.trim()
  }
}

export const aiChatService = new AIChatService()
export default aiChatService


