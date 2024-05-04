import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/Sign-In'
import SignUp from './pages/Sign-Up'
import Tabs from './components/Tabs'
import Users from './pages/Users'
import { SnackbarProvider } from 'notistack'
import { useAuthContext } from './context/AuthContext'

export default function App() {
    const { isUserLogged } = useAuthContext()
    return (
        <>
            <SnackbarProvider />
            <BrowserRouter>
                {!isUserLogged && <Tabs />}
                <Routes>
                    {isUserLogged ? (
                        <Route path='admin/users' element={<Users />} />
                    ) : (
                        <>
                            <Route path='sign-in' element={<SignIn />} />
                            <Route path='sign-up' element={<SignUp />} />
                        </>
                    )}
                    <Route
                        path='*'
                        element={
                            <Navigate
                                to={isUserLogged ? 'admin/users' : 'sign-in'}
                            />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    )
}
