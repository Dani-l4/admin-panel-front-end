import { AuthClient } from '../context/AuthContext'
const inMemoryJWTService = () => {
    let inMemoryJWT: string | null = null
    let refreshTimeout: NodeJS.Timeout

    const refreshToken = (expiration: number) => {
        const timeoutTrigger = expiration - 10000
        refreshTimeout = setTimeout(() => {
            AuthClient.post('/refresh')
                .then((res) => {
                    const { accessToken, accessTokenExpiration } = res.data
                    setToken(accessToken, accessTokenExpiration)
                })
                .catch(console.error)
        }, timeoutTrigger)
    }

    const abortRefreshToken = () => {
        if (refreshTimeout) {
            clearTimeout(refreshTimeout)
        }
    }

    const getToken = (): string | null => inMemoryJWT

    const setToken = (token: string, tokenExpiration: number): void => {
        inMemoryJWT = token
        refreshToken(tokenExpiration)
    }

    const deleteToken = () => {
        inMemoryJWT = null
        abortRefreshToken()
    }

    return { getToken, setToken, deleteToken, refreshToken }
}

export default inMemoryJWTService()
