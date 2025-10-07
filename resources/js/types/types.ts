import { type User } from './index';

export interface RecipePaginatedResults {
  data: Recipe[];
  current_page: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  prev_page_url: string | null;
  next_page_url: string | null;
  from: number;
  to: number;
  total: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}
export interface Recipe {
  id: number;
  title: string;
  slug: string;
  categories: Category[];
  description: string;
  ingredients: string;
  instructions: string;
  cooking_time: string;
  serves: string;
  image_preview: string;
  image_large: string;
  has_image: boolean;
  has_bookmarked: boolean;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  user: User;
}
