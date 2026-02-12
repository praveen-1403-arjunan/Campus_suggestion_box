
export type Category = 'Academics' | 'Facilities' | 'Events' | 'Others';

export interface Suggestion {
  _id: string;
  name?: string;
  category: Category;
  message: string;
  createdAt: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
