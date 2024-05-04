import ReactDOM from 'react-dom/client'
import AuthProvider from './context/AuthContext'
import ResourceProvider from './context/ResourceContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <ResourceProvider>
            <App />
        </ResourceProvider>
    </AuthProvider>
)
