import { 
  Activity, 
  ActivityCreateRequest, 
  ActivityUpdateRequest, 
  APIException, 
  Apprentice, 
  ApprenticeDetailed, 
  ApprenticeSkillMap, 
  Feedback, 
  FeedbackCreateRequest, 
  FeedbackDetailed, 
  Mission, 
  MissionCreateRequest, 
  MissionDetailed, 
  RegisterDTO, 
  ResponseObject, 
  SignInResponse, 
  SkillValidation, 
  SkillValidationCreate, 
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
    getFeedbacks: async (activityId: number): Promise<FeedbackDetailed[]> => {
      const res = await ApiClient.sendRequest<"feedbacks", FeedbackDetailed[]>('GET', `/api/activity/feedback/${activityId}`, undefined);
      return res.feedbacks;
    },
    createActivity: async ( data: ActivityCreateRequest): Promise<Activity> => {
      const res = await ApiClient.sendRequest<"activity", Activity>('POST', '/api/activity', data);
      return res.activity;
    },
    createFeedback: async (data: FeedbackCreateRequest): Promise<Feedback> => {
      const res = await ApiClient.sendRequest<"feedback", Feedback>('POST', '/api/activity/feedback', data);
      return res.feedback;
    },
    createValidation: async (data: SkillValidationCreate): Promise<SkillValidation> => {
      const res = await ApiClient.sendRequest<"validation", SkillValidation>('POST', '/api/activity/validation', data);
      return res.validation;
    },
    updateActivity: async (id: number, data: ActivityUpdateRequest | null = null): Promise<Activity> => {
      const res = await ApiClient.sendRequest<"activity", Activity>('PUT', `/api/activity/${id}`, data);
      return res.activity;
    },
  }
  static Company = {
    createMission: async (data: MissionCreateRequest): Promise<Mission> => {
      const res = await ApiClient.sendRequest<"mission", Mission>('POST', '/api/company/mission', data);
      return res.mission;
    }
  }
  static Apprentice = {
    getApprenticeInfo: async (): Promise<ApprenticeSkillMap> => {
      const res = await ApiClient.sendRequest<"apprentice", ApprenticeSkillMap>('GET', '/api/apprentice/', undefined);
      return res.apprentice;
    },
    getApprenticeByMission: async (): Promise<ApprenticeDetailed[]> => {
      const res = await ApiClient.sendRequest<"apprentices", ApprenticeDetailed[]>('GET', '/api/apprentice/mission', undefined);
      return res.apprentices;
    },
    getApprenticesEmails: async (email: string): Promise<string[]> => {
      const res = await ApiClient.sendRequest<"emails", string[]>('GET', `/api/apprentice/emails?email=${email}`, undefined);
      return res.emails;
    },
    setTutorat: async (email: string): Promise<Apprentice> => {
      const res = await ApiClient.sendRequest<"apprentice", Apprentice>('POST', '/api/apprentice/tutor', { apprenticeEmail: email });
      return res.apprentice;
    },
    getApprenticesByTutor: async (): Promise<ApprenticeDetailed[]> => {
      const res = await ApiClient.sendRequest<"apprentices", ApprenticeDetailed[]>('GET', '/api/apprentice/tutor', undefined);
      return res.apprentices;
    }
  }
}

export default ApiClient;