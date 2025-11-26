import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3b82f6',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Button: {
            controlHeight: 40,
            paddingContentHorizontal: 20,
          },
          Input: {
            controlHeight: 40,
          },
          Select: {
            controlHeight: 40,
          },
          Card: {
            borderRadiusLG: 12,
          }
        }
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
