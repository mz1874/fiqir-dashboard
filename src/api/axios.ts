import axios from 'axios'
import router from '@/router'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// instance.interceptors.request.use(config => {
//     const token = localStorage.getItem('access_token')
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
// }, error => {
//     return Promise.reject(error)
// })
//
// instance.interceptors.response.use(
//     response => response,
//     error => {
//         const status = error.response?.status
//
//         if (status === 401) {
//             console.warn('认证失败或已过期，跳转到登录页')
//             localStorage.removeItem('access_token')
//             localStorage.removeItem('refresh_token')
//             router.push('/login')
//         } else {
//             console.error('请求失败：', error.response?.data || error.message)
//         }
//
//         return Promise.reject(error)
//     }
// )

export default instance
