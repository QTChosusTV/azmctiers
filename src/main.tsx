import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// @ts-ignore - Phớt lờ kiểm tra lỗi định nghĩa kiểu dữ liệu cho file CSS này
import './index.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)