export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  price: number;
  capacity: number;
  categoryId: string;
  images?: string | string[];
  image?: string;
  createdAt?: string;
}

export interface CreateEvent {
  name: string;
  description?: string;
  price: number;
  date: string;
  location: string;
  capacity: number;
  categoryId: string;
  images?: string[];
}

export interface UpdateEvent {
  name?: string;
  description?: string;
  price?: number;
  date?: string;
  location?: string;
  capacity?: number;
  categoryId?: string;
  images?: string[];
}

export interface EventQueryParams {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}
