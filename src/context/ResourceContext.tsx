import { createContext, useContext } from 'react'
import config from '../config'
import axios, { AxiosResponse } from 'axios'
import showErrorMessage from '../utils/showErrorMessage'
import { iUser } from '../types'
import inMemoryJWT from '../services/inMemoryJWT'

interface ResourceCtx {
    getUsers: Function
    blockUsers: Function
    unBlockUsers: Function
    deleteUsers: Function
}

const ResourceContext = createContext<ResourceCtx | null>(null)

export function useResourceContext() {
    const ctx = useContext(ResourceContext)
    if (!ctx)
        throw Error(
            'useResourceContext can only be used inside an ResourceProvider'
        )
    return ctx
}

const ResourceClient = axios.create({
    baseURL: `${config.API_URL}/admin`,
    withCredentials: true,
})
ResourceClient.interceptors.request.use(
    (config) => {
        const accessToken = inMemoryJWT.getToken()
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    (err) => Promise.reject(err)
)

const setUpUsers = (users: iUser[]) => {
    return users.map((user) => {
        return {
            ...user,
            createdAt: new Date(user.createdAt).toLocaleDateString(),
            lastLogin: new Date(user.lastLogin).toLocaleString(),
        }
    })
}

export default function ResourceProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const getUsers = async () => {
        return await ResourceClient.get('/users')
            .then((response: AxiosResponse): iUser[] => {
                return setUpUsers(response.data.users)
            })
            .catch(showErrorMessage)
    }

    const blockUsers = async (usersIds: string[]) => {
        return await ResourceClient.post('/users/block', usersIds)
    }

    const unBlockUsers = async (usersIds: string[]) => {
        return await ResourceClient.post('/users/unblock', usersIds)
    }

    const deleteUsers = async (usersIds: string[]) => {
        return await ResourceClient.delete('/users', {
            data: usersIds,
        })
    }

    return (
        <ResourceContext.Provider
            value={{ getUsers, blockUsers, unBlockUsers, deleteUsers }}
        >
            {children}
        </ResourceContext.Provider>
    )
}
