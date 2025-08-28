/**
 * Client-side security utilities
 */

// Disable right-click and developer tools in production
export const initializeSecurityMeasures = () => {
  if (process.env.NODE_ENV === 'production') {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // Disable common developer tool shortcuts
    document.addEventListener('keydown', (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
        return false;
      }
    });

    // Basic detection for developer tools
    let devtools = {
      opened: false,
      orientation: null as string | null
    };

    const threshold = 160;
    const check = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.opened) {
          devtools.opened = true;
          // Optionally redirect or show warning
          (console as any).clear();
        }
      } else {
        devtools.opened = false;
      }
    };

    if (typeof window !== 'undefined') {
      setInterval(check, 500);
    }
  }
};

// Obfuscate sensitive data in production
export const sanitizeForDisplay = (data: any, isProduction: boolean = process.env.NODE_ENV === 'production') => {
  if (!isProduction) return data;
  
  // Remove sensitive fields from objects before displaying
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    
    // List of sensitive keys to remove
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'api', 'auth'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        delete sanitized[key];
      }
    });
    
    return sanitized;
  }
  
  return data;
};

// Prevent console access in production
export const protectConsole = () => {
  if (process.env.NODE_ENV === 'production') {
    // Override console methods to prevent information leakage
    const noop = () => {};
    
    // Keep error for critical issues but sanitize
    const originalError = (console as any).error;
    (console as any).error = (...args: any[]) => {
      // Only show user-friendly messages
      originalError('An error occurred. Please contact support if the issue persists.');
    };
    
    (console as any).log = noop;
    (console as any).warn = noop;
    (console as any).info = noop;
    (console as any).debug = noop;
    (console as any).trace = noop;
    (console as any).table = noop;
    (console as any).group = noop;
    (console as any).groupEnd = noop;
    (console as any).time = noop;
    (console as any).timeEnd = noop;
  }
};
