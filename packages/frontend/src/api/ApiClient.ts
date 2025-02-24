import { 
  APIException, 
  ResponseObject, 
  SignInResponse, 
  User, 
  APIResponse
} from '@shared/frontend';


class ApiClient{
  /**
   * Sends a request to the server
   * @param method
   * @param endpoint
   * @param body
   * @param token
   *
   */
  private static async sendRequest<K extends string,V>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any,
    token?: string
  ): Promise<ResponseObject<K, V>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      method,
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    }
    // Only set Content-Type if the body is not FormData
    if (body && !(body instanceof FormData) ) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body); // Serialize JSON payload
    } else if (body instanceof FormData) {
        options.body = body; // Let the browser handle the Content-Type
    }
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      // Throw an error with the status and status text
      const errorData = await response.json(); // Optionally parse the response body

      throw new APIException(
        errorData.statusCode,
        errorData.code,
        errorData.message,
      );
    }
    return await response.json();
  }

  static Auth ={
    signIn: async (email: string, password: string): Promise<SignInResponse> => {
      const body = { email, password };
      const res = await ApiClient.sendRequest<"signIn",SignInResponse>('POST', '/api/auth/login', body);
      return res.signIn;
    },
    signUp: async (name: string, email: string, password: string): Promise<User> => {
      const body = {name, email, password };
      const res = await ApiClient.sendRequest<"signUp", User>('POST', '/api/auth/register', body);
      return res.signUp;
    },
    signOut: async (): Promise<string> => {
      const res = await ApiClient.sendRequest<"signOut",string>('POST', '/api/auth/logout');
      return res.signOut;
    },
    sendMail: async (email: string): Promise<APIResponse> => {
      const res = await ApiClient.sendRequest<"Api",APIResponse>('GET',`/api/auth/sendmail?email=${email}`)
      return res.Api;
    },
    checkAuth: async (): Promise<boolean> => {
      const res = await ApiClient.sendRequest<"checkAuth",boolean>('POST', '/api/auth/check-auth');
      return res.checkAuth;
    }
  }

  static User = {
    getCurrent: async (): Promise<User> => {
      const res = await ApiClient.sendRequest<"user", User>('GET', '/api/user/current');
      return res.user;
    },
    // reset-password by sending mail
  }  
}

export default ApiClient;