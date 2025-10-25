import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button, Card, Result } from 'antd'
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md w-full mx-4">
            <Result
              status="error"
              title="Đã xảy ra lỗi"
              subTitle="Xin lỗi, đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
              extra={[
                <Button
                  key="reload"
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  className="mr-2"
                >
                  Tải lại trang
                </Button>,
                <Button
                  key="home"
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                >
                  Về trang chủ
                </Button>
              ]}
            />
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <h4 className="text-red-800 font-medium mb-2">Chi tiết lỗi (Development):</h4>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
