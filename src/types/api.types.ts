export interface ApiError {
  detail?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}
