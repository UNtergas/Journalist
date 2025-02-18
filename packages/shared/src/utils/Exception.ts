
export class APIException extends Error {
    message: string;
    code: number;
    error: string;
  
    constructor(code: number, error: string, message: string) {
      super(message);
      this.code = code;
      this.error = error;
      this.message = message;
    }
  }