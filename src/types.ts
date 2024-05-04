import { MouseEventHandler } from 'react'
import { SubmitHandler } from 'react-hook-form'

export interface iUser {
    id: string
    name: string
    email: string
    createdAt: string
    lastLogin: string
    status: string
}

export interface formValues {
    email: string
    password: string
    name?: string
}

export interface AppContext {
    handleSignIn: SubmitHandler<formValues>
    handleSignUp: SubmitHandler<formValues>
    handleLogOut: MouseEventHandler
    isAppReady: boolean
    isUserLogged: boolean
    currentUser: string
}

export type Order = 'asc' | 'desc'
