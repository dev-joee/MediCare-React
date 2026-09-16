import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { ToastProvider } from './components/ui/toast'

// The logged-in user is restored synchronously from localStorage by the
// persisted auth store (src/stores/useAuthStore.js), so there is no async
// session bootstrap to wait on here.
function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App
