import { GEMINI_API_KEY } from '@/constants'
import { GoogleGenAI } from '@google/genai'
import { GoongService } from './GoongService'

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type UserLocation = {
  lat: number
  lng: number
}

class AIChatService {
  private ai: GoogleGenAI

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  }

  async sendChat(messages: ChatMessage[], userLocation?: UserLocation): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new Error('Chưa cấu hình GEMINI_API_KEY. Hãy thêm vào .env hoặc constants/index.ts')
    }

    try {
      // 1. Prepare system instruction và contents
      const systemMessage = messages.find(m => m.role === 'system')
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

      // 2. Define tools (function calling)
      const tools = [
        {
          functionDeclarations: [
            {
              name: 'search_places',
              description: 'Search for places, restaurants, or amenities nearby using Goong Maps API.',
              parameters: {
                type: 'OBJECT',
                properties: {
                  query: {
                    type: 'STRING',
                    description: 'The search query, e.g., "phở", "nhà hàng", "atm", "cafe"',
                  },
                },
                required: ['query'],
              },
            },
          ],
        },
      ]

      // 3. Generate content với API mới
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
        tools: tools,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      })

      // 4. Kiểm tra function calling
      const candidates = response.candidates
      if (candidates && candidates.length > 0) {
        const candidate = candidates[0]
        
        // Kiểm tra xem có function calls không
        if (candidate.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.functionCall) {
              const functionCall = part.functionCall
              
              if (functionCall.name === 'search_places') {
                const query = functionCall.args?.query as string
                let searchResults = 'Không tìm thấy kết quả nào.'

                try {
                  const location = userLocation || { lat: 21.0285, lng: 105.8542 }
                  const apiRes = await GoongService.autocomplete(query, location, 5000)
                  if (apiRes.predictions && apiRes.predictions.length > 0) {
                    searchResults = apiRes.predictions
                      .map(p => `- ${p.description} (Place ID: ${p.place_id})`)
                      .join('\n')
                  }
                } catch (error) {
                  console.error('Goong search error:', error)
                  searchResults = 'Lỗi khi tìm kiếm địa điểm.'
                }

                // Gọi lại với function response
                const functionResponseContents = [
                  ...contents,
                  {
                    role: 'model' as const,
                    parts: [{ functionCall: functionCall }],
                  },
                  {
                    role: 'user' as const,
                    parts: [
                      {
                        functionResponse: {
                          name: 'search_places',
                          response: {
                            result: searchResults,
                          },
                        },
                      },
                    ],
                  },
                ]

                const finalResponse = await this.ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: functionResponseContents,
                  systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
                  generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7,
                  },
                })

                return finalResponse.text || 'Không có phản hồi từ AI.'
              }
            }
          }
        }
      }

      // 5. Trả về text response thông thường
      return response.text || 'Không có phản hồi từ AI.'

    } catch (error: any) {
      console.error('AIChatService error:', error)
      if (error.message?.includes('429')) {
        return 'Hệ thống đang quá tải (429). Vui lòng thử lại sau giây lát.'
      }
      return 'Xin lỗi, đã có lỗi xảy ra khi kết nối với AI.'
    }
  }
}

export const aiChatService = new AIChatService()
export default aiChatService
