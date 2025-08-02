import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const instance = axios.create({
   baseURL: 'http://192.168.1.5:8080/api/',
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
   },
})

instance.interceptors.request.use(
   async (config) => {
      const token = await getTokenFromStorage()
      if (token) {
         config.headers.Authorization = `Bearer ${token}`
      }
      return config
   },
   (error) => Promise.reject(error),
)

instance.interceptors.response.use(
   (response) => response,
   (error) => Promise.reject(error),
)

export default instance

async function getTokenFromStorage() {
   try {
      const token = await AsyncStorage.getItem('access_token')
      return token
   } catch {
      return null
   }
}
