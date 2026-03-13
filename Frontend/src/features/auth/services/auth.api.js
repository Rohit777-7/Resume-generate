import axios from "axios"


const api = axios.create({
    baseURL: "https://resume-generate-lztt.onrender.com",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        console.error('Registration failed:', err.response?.data?.message || err.message)
        throw err
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.error('Login failed:', err.response?.data?.message || err.message)
        throw err
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {
        console.error('Logout failed:', err.response?.data?.message || err.message)
        throw err
    }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (err) {
    // user not logged in → return null
    return null;
  }
}