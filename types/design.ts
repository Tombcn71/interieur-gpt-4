export interface Design {
  id: string;
  user_id: number;
  room_type: string;
  style: string;
  original_image_url: string;
  result_image_url: string | null;
  prompt: string;
  status: string;
  created_at: string;
  updated_at: string;
}
