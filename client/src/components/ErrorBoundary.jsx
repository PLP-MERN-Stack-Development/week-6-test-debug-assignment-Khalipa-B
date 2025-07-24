import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now().toString();
    
    console.group(`🔴 Error Boundary - ${errorId}`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Props:', this.props);
    console.groupEnd();

    // Store detailed error information
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, errorId);
    }

    // Store error in localStorage for debugging
    try {
      const errorData = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      const existingErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingErrors.push(errorData);
      
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingErrors));
    } catch (storageError) {
      console.error('Failed to store error in localStorage:', storageError);
    }
  }

  logErrorToService = (error, errorInfo, errorId) => {
    // Implementation for external error logging service
    // Example: Sentry, LogRocket, etc.
    console.log('Logging error to external service:', errorId);
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  downloadErrorLogs = () => {
    const errorLogs = localStorage.getItem('errorLogs');
    if (errorLogs) {
      const blob = new Blob([errorLogs], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `error-logs-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  clearErrorLogs = () => {
    localStorage.removeItem('errorLogs');
    alert('Error logs cleared');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Application Error
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {this.props.fallbackMessage || 'An unexpected error occurred. Error ID: ' + this.state.errorId}
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-gray-700 font-medium mb-2">
                  🐛 Error Details (Development Mode)
                </summary>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600">Error Message:</h4>
                    <pre className="mt-1 p-3 bg-red-50 rounded text-xs overflow-auto text-red-800">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600">Component Stack:</h4>
                    <pre className="mt-1 p-3 bg-red-50 rounded text-xs overflow-auto text-red-800">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600">Stack Trace:</h4>
                    <pre className="mt-1 p-3 bg-red-50 rounded text-xs overflow-auto text-red-800">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Refresh Page
              </button>
              <button
                onClick={this.downloadErrorLogs}
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Download Logs
              </button>
              <button
                onClick={this.clearErrorLogs}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Clear Logs
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Error ID: {this.state.errorId} | Time: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;