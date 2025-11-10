# 📚 Mummi - Codebase Documentation

## 🏗️ Architecture Overview

### Frontend Stack
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router
- **State Management**: React Hooks + Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage

### Backend Integration
- **Base URL**: `http://localhost:8080` (development)
- **Authentication**: JWT Bearer Token
- **API Format**: RESTful JSON APIs

---

## 🔐 Authentication System

### Token Management
```typescript
// Location: services/ApiService.ts
// Auto-attach token to all API requests
const token = await AsyncStorage.getItem('authToken')
config.headers.Authorization = `Bearer ${token}`
```

### Login Flow
```typescript
// 1. User login → Get token
const loginResponse = await authService.login(credentials)
await AsyncStorage.setItem('authToken', loginResponse.token)

// 2. All subsequent API calls automatically include token
const posts = await postService.getAllPosts() // ✅ Auto-authenticated
const moods = await moodService.getAllMoods() // ✅ Auto-authenticated
```

### Protected Endpoints
**ALL API endpoints require authentication:**
- ✅ `/api/posts/*` - Post management
- ✅ `/api/moods/*` - Mood management  
- ✅ `/api/users/*` - User management
- ✅ `/api/auth/*` - Authentication (except login/register)

---

## 🚀 API Service Pattern

### Standard API Call Structure
```typescript
// services/[EntityName]Service.ts
export class EntityService {
  async getAll(page: number = 1, size: number = 10): Promise<EntityResponse[]> {
    try {
      console.log(`📡 Fetching entities - Page: ${page}, Size: ${size}`)
      
      const response = await apiService.get<PaginatedResponse<EntityResponse>>(
        `${API_ENDPOINTS.ENTITIES.LIST}?page=${page}&size=${size}`
      )
      
      if (response.status === 200 && response.data) {
        console.log(`✅ Fetched ${response.data.content.length} entities`)
        return response.data.content
      }
      
      throw new Error(response.message || 'Không thể tải dữ liệu')
    } catch (error) {
      console.error('❌ Error fetching entities:', error)
      throw new Error('Không thể tải dữ liệu từ server')
    }
  }

  async create(data: CreateEntityRequest): Promise<EntityResponse> {
    try {
      console.log('📤 Creating entity:', data)
      
      const response = await apiService.post<EntityResponse>(
        API_ENDPOINTS.ENTITIES.CREATE,
        data
      )
      
      if (response.status === 201 && response.data) {
        console.log('✅ Entity created:', response.data.id)
        return response.data
      }
      
      throw new Error(response.message || 'Không thể tạo dữ liệu')
    } catch (error) {
      console.error('❌ Error creating entity:', error)
      throw error
    }
  }
}

// Export singleton
export const entityService = new EntityService()
```

### Error Handling Strategy
```typescript
// 1. Service Level - Throw specific errors
throw new Error('Không thể tải danh sách cảm xúc từ server')

// 2. Component Level - Show user-friendly messages
try {
  const data = await service.getData()
  setData(data)
} catch (error) {
  Toast.show({
    type: 'error',
    text1: 'Lỗi',
    text2: error.message
  })
}

// 3. NO FALLBACK DATA - Let user know when API fails
```

---

## 📱 Component Patterns

### Service Hook Pattern
```typescript
// hooks/use[EntityName].ts
export function useEntities() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEntities = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await entityService.getAll()
      setEntities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setEntities([]) // Clear data on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEntities()
  }, [loadEntities])

  return {
    entities,
    isLoading,
    error,
    refetch: loadEntities
  }
}
```

### Form Management Pattern
```typescript
// hooks/useCreate[EntityName].ts
export interface CreateEntityForm {
  field1: string
  field2: string
  requiredField: string
}

export function useCreateEntity() {
  const [form, setForm] = useState<CreateEntityForm>(initialForm)
  const [isLoading, setIsLoading] = useState(false)

  const updateForm = (updates: Partial<CreateEntityForm>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }

  const validateForm = (): string | null => {
    if (!form.requiredField.trim()) {
      return 'Vui lòng nhập trường bắt buộc'
    }
    return null
  }

  const createEntity = async (): Promise<boolean> => {
    const error = validateForm()
    if (error) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: error })
      return false
    }

    try {
      setIsLoading(true)
      await entityService.create(form)
      Toast.show({ type: 'success', text1: 'Thành công!' })
      setForm(initialForm)
      return true
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error instanceof Error ? error.message : 'Không thể tạo'
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { form, updateForm, isLoading, createEntity }
}
```

---

## 🗂️ File Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── create.tsx     # Create post screen
│   │   ├── profile.tsx    # Profile screen
│   │   └── _layout.tsx    # Tab layout
│   ├── auth/              # Authentication screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── common/           # Generic components
│   ├── create-post/      # Create post specific
│   └── map/              # Map specific
├── constants/            # App constants
│   └── index.ts          # API endpoints, URLs
├── context/              # React Context providers
│   ├── AuthProvider.tsx  # Authentication context
│   └── ThemeContext.tsx  # Theme context
├── hooks/                # Custom React hooks
│   ├── useCreatePost.ts  # Post creation logic
│   ├── useMoods.ts       # Moods data fetching
│   └── index.ts          # Hook exports
├── services/             # API service layers
│   ├── ApiService.ts     # HTTP client + auth
│   ├── PostService.ts    # Post API calls
│   ├── MoodService.ts    # Mood API calls
│   └── AuthService.ts    # Auth API calls
├── styles/               # Styling system
│   ├── commonStyles.ts   # Shared styles
│   ├── theme.ts          # Design tokens
│   └── components/       # Component-specific styles
├── type/                 # TypeScript definitions
│   ├── index.ts          # Main types
│   ├── direction.ts      # Map/location types
│   └── auth.ts           # Auth types
└── utils/                # Utility functions
    ├── helpers.ts        # Generic helpers
    └── validation.ts     # Form validation
```

---

## 🔄 API Integration Checklist

### When Adding New API Endpoint:

1. **Add endpoint to constants**
```typescript
// constants/index.ts
export const API_ENDPOINTS = {
  ENTITIES: {
    LIST: '/api/entities/list',
    CREATE: '/api/entities/create',
    BY_ID: '/api/entities',
    UPDATE: '/api/entities',
    DELETE: '/api/entities'
  }
}
```

2. **Define TypeScript types**
```typescript
// type/index.ts
export interface EntityResponse {
  id: string
  name: string
  createdAt: string
}

export interface CreateEntityRequest {
  name: string
  description?: string
}
```

3. **Create service class**
```typescript
// services/EntityService.ts
export class EntityService {
  // Follow standard pattern above
}
export const entityService = new EntityService()
```

4. **Create custom hook**
```typescript
// hooks/useEntities.ts
export function useEntities() {
  // Follow hook pattern above
}
```

5. **Use in component**
```typescript
// app/entities.tsx
export default function EntitiesScreen() {
  const { entities, isLoading, error } = useEntities()
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  
  return <EntityList entities={entities} />
}
```

---

## 🚨 Important Rules

### ❌ DON'T DO:
- **No mock data fallbacks** - Show errors instead
- **No silent failures** - Always inform user of errors
- **No hardcoded tokens** - Use AsyncStorage
- **No inline styles** - Use theme system
- **No direct API calls in components** - Use services + hooks

### ✅ DO:
- **Use TypeScript strictly** - Define all types
- **Handle loading states** - Show spinners/skeletons
- **Handle error states** - Show meaningful messages  
- **Log API calls** - Use console.log for debugging
- **Validate forms** - Client-side validation before API calls
- **Use singleton services** - Export single instances

---

## 🔧 Development Workflow

### 1. API First Development
```bash
# Test API endpoint first
curl -X GET "http://localhost:8080/api/entities/list" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Service Implementation
- Create service class with proper error handling
- Add comprehensive logging
- Test with real API responses

### 3. Hook Creation
- Wrap service calls in custom hooks
- Handle loading/error states
- Provide easy refetch functionality

### 4. Component Integration
- Use hooks in components
- Handle all states (loading, error, success)
- Show appropriate UI for each state

### 5. Testing Checklist
- ✅ Works with valid token
- ✅ Shows error when token missing/invalid
- ✅ Handles network errors gracefully
- ✅ Loading states work correctly
- ✅ Error messages are user-friendly

---

## 📋 Current API Status

### ✅ Implemented & Working:
- **Authentication**: Login, token storage
- **Posts**: List, create, update, delete
- **Moods**: List with pagination (requires auth)

### 🔄 In Progress:
- **User Profile**: Get, update
- **Comments**: CRUD operations
- **Reactions**: Like, unlike posts

### 📝 TODO:
- **File Upload**: Image/video upload
- **Push Notifications**: Real-time updates
- **Search**: Posts, users, locations

---

**Last Updated**: September 22, 2025
**Version**: 1.0.0
**Maintainer**: Development Team
