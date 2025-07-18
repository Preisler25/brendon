export default class BaseResponse {
  status: number;
  message: string;
  data: any[];

  constructor(status: number, message: string, data: any[] = []) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }

  static from(param: {
    status?: number;
    message?: string;
    data?: any[];
  }): BaseResponse {
    return new BaseResponse(
      param.status || 800,
      param.message || 'No data found',
      param.data || [],
    );
  }
}
