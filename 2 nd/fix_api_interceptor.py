import os

target = r"C:\Users\habee\frontend\src\services\api.ts"

with open(target, "r", encoding="utf-8") as f:
    text = f.read()

old_interceptor = '''// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = error.response?.data?.detail || 'Network error occurred. Please check connection.';
    return Promise.reject(new Error(customError));
  }
);'''

new_interceptor = '''// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Network error occurred. Please check connection.';
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail.map((d: any) => d.msg || JSON.stringify(d)).join('; ');
      } else if (typeof detail === 'object') {
        message = JSON.stringify(detail);
      }
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);'''

if old_interceptor in text:
    text = text.replace(old_interceptor, new_interceptor)
    with open(target, "w", encoding="utf-8") as f:
        f.write(text)
    print("SUCCESS: api.ts error interceptor updated to handle error detail formatting cleanly.")
else:
    print("Interceptor pattern not found in api.ts")
