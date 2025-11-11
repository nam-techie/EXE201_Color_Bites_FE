// Statistics types theo backend document
export interface StatisticsResponse {
  // Basic counts
  totalUsers: number
  activeUsers: number
  totalPosts: number
  totalRestaurants: number
  totalComments: number
  totalTags: number
  totalChallenges: number
  totalTransactions: number
  
  // Revenue statistics
  totalRevenue: number
  monthlyRevenue: number
  dailyRevenue: number
  successfulTransactions: number
  failedTransactions: number
  pendingTransactions: number
  
  // Engagement statistics
  totalReactions: number
  totalFavorites: number
  averageRating: number
  totalMoodMaps: number
  totalQuizzes: number
  
  // Time-based data
  userGrowthData: Array<Record<string, any>>
  postActivityData: Array<Record<string, any>>
  revenueData: Array<Record<string, any>>
  engagementData: Array<Record<string, any>>
  
  // Top performers
  topPosts: Array<Record<string, any>>
  topRestaurants: Array<Record<string, any>>
  topUsers: Array<Record<string, any>>
  popularTags: Array<Record<string, any>>
  
  // System health
  lastUpdated: string        // ISO 8601 format
  systemStatus: string
  activeSessions: number
}

// API response wrapper
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

// Statistics filters
export interface StatisticsFilters {
  dateRange?: {
    start: string
    end: string
  }
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

// User statistics
export interface UserStatistics extends StatisticsResponse {
  userGrowthRate: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  userRetentionRate: number
  averageSessionDuration: number
}

// Post statistics
export interface PostStatistics extends StatisticsResponse {
  postsToday: number
  postsThisWeek: number
  postsThisMonth: number
  averageReactionsPerPost: number
  averageCommentsPerPost: number
  mostPopularMood: string
  postsByMood: Array<{
    mood: string
    count: number
  }>
}

// Restaurant statistics
export interface RestaurantStatistics extends StatisticsResponse {
  restaurantsToday: number
  restaurantsThisWeek: number
  restaurantsThisMonth: number
  averageRating: number
  mostPopularType: string
  restaurantsByType: Array<{
    type: string
    count: number
  }>
  restaurantsByRegion: Array<{
    region: string
    count: number
  }>
}

// Revenue statistics
export interface RevenueStatistics extends StatisticsResponse {
  revenueToday: number
  revenueThisWeek: number
  revenueThisMonth: number
  revenueGrowthRate: number
  averageTransactionValue: number
  revenueByGateway: Array<{
    gateway: string
    amount: number
    count: number
  }>
  revenueByPlan: Array<{
    plan: string
    amount: number
    count: number
  }>
}

// Engagement statistics
export interface EngagementStatistics extends StatisticsResponse {
  engagementRate: number
  averageReactionsPerUser: number
  averageCommentsPerUser: number
  mostActiveUsers: Array<{
    userId: string
    userName: string
    activityScore: number
  }>
  engagementByTime: Array<{
    hour: number
    reactions: number
    comments: number
  }>
}

// Challenge statistics
export interface ChallengeStatistics extends StatisticsResponse {
  activeChallenges: number
  completedChallenges: number
  challengeParticipationRate: number
  averageCompletionTime: number
  mostPopularChallenges: Array<{
    challengeId: string
    challengeName: string
    participants: number
  }>
}


