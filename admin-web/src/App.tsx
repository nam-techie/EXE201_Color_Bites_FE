import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ChallengesList from './pages/Challenges/ChallengesList'
import CommentsList from './pages/Comments/CommentsList'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import MoodsList from './pages/Moods/MoodsList'
import PostsList from './pages/Posts/PostsList'
import RestaurantsList from './pages/Restaurants/RestaurantsList'
import StatisticsOverview from './pages/Statistics'
import UserAnalytics from './pages/Statistics/UserAnalytics'
import PostAnalytics from './pages/Statistics/PostAnalytics'
import RestaurantAnalytics from './pages/Statistics/RestaurantAnalytics'
import RevenueReports from './pages/Statistics/RevenueReports'
import EngagementAnalytics from './pages/Statistics/EngagementAnalytics'
import TagsList from './pages/Tags/TagsList'
import TransactionsList from './pages/Transactions/TransactionsList'
import Users from './pages/Users'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="posts" element={<PostsList />} />
        <Route path="restaurants" element={<RestaurantsList />} />
        <Route path="comments" element={<CommentsList />} />
        <Route path="tags" element={<TagsList />} />
        <Route path="transactions" element={<TransactionsList />} />
        <Route path="moods" element={<MoodsList />} />
        <Route path="challenges" element={<ChallengesList />} />
        <Route path="statistics" element={<StatisticsOverview />} />
        <Route path="statistics/users" element={<UserAnalytics />} />
        <Route path="statistics/posts" element={<PostAnalytics />} />
        <Route path="statistics/restaurants" element={<RestaurantAnalytics />} />
        <Route path="statistics/revenue" element={<RevenueReports />} />
        <Route path="statistics/engagement" element={<EngagementAnalytics />} />
      </Route>
    </Routes>
  )
}

export default App
