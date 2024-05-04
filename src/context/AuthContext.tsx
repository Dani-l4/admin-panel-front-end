import { createContext, useContext, useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import config from '../config'
import axios, { AxiosResponse } from 'axios'
import inMemoryJWT from '../services/inMemoryJWT'
import showErrorMessage from '../utils/showErrorMessage'
import { formValues, AppContext } from '../types'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

export const AuthContext = createContext<AppContext | null>(null)

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx)
        throw Error('useAuthContext can only be used inside an AuthProvider')
    return ctx
}

export const AuthClient = axios.create({
    baseURL: `${config.API_URL}/auth`,
    withCredentials: true,
})

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isAppReady, setIsAppReady] = useState(false)
    const [isUserLogged, setIsUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState('')

    const handleSignIn: SubmitHandler<formValues> = (data) => {
        AuthClient.post('/sign-in', data)
            .then((res: AxiosResponse): void => {
                const { accessToken, accessTokenExpiration } = res.data
                inMemoryJWT.setToken(
                    String(accessToken),
                    Number(accessTokenExpiration)
                )
                setIsUserLogged(true)
                setCurrentUser(data.email)
            })
            .catch(showErrorMessage)
    }

    const handleSignUp: SubmitHandler<formValues> = (data): void => {
        AuthClient.post('/sign-up', data)
            .then((res: AxiosResponse): void => {
                const { accessToken, accessTokenExpiration } = res.data
                inMemoryJWT.setToken(
                    String(accessToken),
                    Number(accessTokenExpiration)
                )
                setIsUserLogged(true)
                setCurrentUser(data.email)
            })
            .catch(showErrorMessage)
    }

    const handleLogOut = () => {
        AuthClient.post('/logout')
            .then(() => {
                inMemoryJWT.deleteToken()
                setIsUserLogged(false)
            })
            .catch(showErrorMessage)
    }

    useEffect(() => {
        AuthClient.post('/refresh')
            .then((res) => {
                const { accessToken, accessTokenExpiration, email } = res.data
                inMemoryJWT.setToken(
                    String(accessToken),
                    Number(accessTokenExpiration)
                )
                setIsAppReady(true)
                setIsUserLogged(true)
                setCurrentUser(email)
            })
            .catch(() => {
                setIsAppReady(true)
                setIsUserLogged(false)
            })
    }, [])

    return (
        <AuthContext.Provider
            value={{
                handleSignIn,
                handleSignUp,
                handleLogOut,
                isAppReady,
                isUserLogged,
                currentUser,
            }}
        >
            {isAppReady ? (
                children
            ) : (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}
        </AuthContext.Provider>
    )
}
