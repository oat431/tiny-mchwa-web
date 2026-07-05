import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { TodolistsPage } from './pages/TodolistsPage'
import { TodolistDetailPage } from './pages/TodolistDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodolistsPage />} />
          <Route path="/todolists/:id" element={<TodolistDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
