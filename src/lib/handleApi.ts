export async function HandleApi(url: string, options: any = {}) {
  const accessToken = localStorage.getItem('miy-ghost-token')
  const headers = options.headers || {}

  //   let exceptionUrl = ['/check-mobile','/reset-password','/forgot-password',, '/login', '/register', '/send-otp','/verify-otp'];
  //   // if accessToken is present
  //   if (accessToken && !exceptionUrl.includes(url)) {
  if (accessToken) {
    options = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`
      }
    }
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, options)

  // console.log(response, "check response",url,exceptionUrl.includes(url))

  //   if (response.status === 401 && !exceptionUrl.includes(url)) {
  //     try {
  //       const accessToken = await refreshToken();
  //       if (accessToken.length > 0) {
  //         if (!exceptionUrl.includes(url)) {
  //           options.headers = {
  //             ...options.headers,
  //             Authorization: `Bearer ${accessToken}`,
  //           };
  //         }

  //         return await fetch(`${apiUrl}${url}`, options);
  //       }
  //       else {
  //         // resetAuth()
  //         throw ("Error refreshing token")
  //       }
  //     }
  //     catch (error) {
  //       // console.log('Error refreshing token:', error);
  //       throw error;
  //     }
  //   }

  return response
}
