export type CombineRule = {
  fields: string[];
  joinWith?: string;
  trim?: boolean;
  skipEmpty?: boolean;
};

export type ApiConfig = {
  apiUrl: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  request: {
    fields: string[];
  };
  pathParams?: Record<string, string>;
  credentials?: {
    username: string;
    password: string;
    [key: string]: string;
  };
  response: {
    combine?: Record<string, CombineRule>;
    map?: Record<string, string>;
  };
};
