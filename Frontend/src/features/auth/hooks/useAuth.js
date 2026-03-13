import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe } from "../services/useAuth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {
            console.error("Login failed:", err)
        } finally {
            setLoading(false)
        }
    }

    // ✅ FIXED HERE (name instead of username)
    const handleRegister = async ({ name, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ name, email, password })
            setUser(data.user)
        } catch (err) {
            console.error("Register failed:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout failed:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()

                if (data) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }

            } catch (err) {
                console.error("GetMe error:", err)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}