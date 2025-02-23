import { 
  Activity, 
  APIException, 
  Mission, 
  ActivityCreation,
  MissionDetailed, 
  RegisterDTO, 
  ResponseObject, 
  SignInResponse, 
  User 
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
    signUp: async (name:string, email: string, password: string): Promise<User> => {
      const body = {name, email, password };
      const res = await ApiClient.sendRequest<"signUp", User>('POST', '/api/auth/register', body);
      return res.signUp;
    },
    signOut: async (): Promise<string> => {
      const res = await ApiClient.sendRequest<"signOut",string>('POST', '/api/auth/logout');
      return res.signOut;
    },
    checkAuth: async (): Promise<boolean> => {
      const res = await ApiClient.sendRequest<"checkAuth",boolean>('POST', '/api/auth/check-auth');
      return res.checkAuth;
    }
  }

  static User = {
    getMe: async (): Promise<User> => {
      const res = await ApiClient.sendRequest<"user", User>('GET', '/api/user/me', undefined);
      return res.user;
    },
    getAll: async (): Promise<User[]> => {
      const res = await ApiClient.sendRequest<"users", User[]>('GET', '/api/user/all', undefined);
      return res.users;
    },
    resetPassword: async (oldPassword: string, newPassword: string): Promise<User> => {
      const body = { oldPassword, newPassword };
      const res = await ApiClient.sendRequest<"user", User>('POST', '/api/user/reset-password', body);
      return res.user;
    },
    createCompany: async (data: RegisterDTO): Promise<User> => {
      const res = await ApiClient.sendRequest<"company", User>('POST', '/api/user/company', data);
      return res.company;
    },
    createTutor: async (data: RegisterDTO): Promise<User> => {
      const res = await ApiClient.sendRequest<"tutor", User>('POST', '/api/user/tutor', data);
      return res.tutor;
    }
  }
  static Activity = {
    getMissions: async (): Promise<MissionDetailed[]> => {
      const res = await ApiClient.sendRequest<"missions", MissionDetailed[]>('GET', '/api/activity/missions', undefined);
      return res.missions;
    },
    createActivity: async ( data: ActivityCreation): Promise<Activity> => {
      const res = await ApiClient.sendRequest<"activity", Activity>('POST', '/api/activity', data);
      return res.activity;
    },
  }
  
  
}

export default ApiClient;