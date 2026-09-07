export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface CreateCategory {
  name: string;
  description?: string;
}

export interface UpdateCategory {
  name?: string;
  description?: string;
}
