enum Status {
  SUCCESS,
  ERROR
}

export interface APIResponse<T> {
  status: Status;
  data: T;
}
