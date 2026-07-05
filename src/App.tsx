import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TodolistsPage } from './pages/TodolistsPage'
import { TodolistDetailPage } from './pages/TodolistDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodolistsPage />} />
        <Route path="/todolists/:id" element={<TodolistDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
