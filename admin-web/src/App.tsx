import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import PostsList from './pages/Posts/PostsList'
import RestaurantsList from './pages/Restaurants/RestaurantsList'
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
      </Route>
    </Routes>
  )
}

export default App
