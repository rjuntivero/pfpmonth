export interface PollOption {
  vote_count: number;
  theme_id: string;
}

export interface Poll {
  id?: string;
  server_id: string;
  poll_options?: PollOption[];
  name?: string;
  image_url?: string;
  vote_count?: number;
  created_by_user?: {
    username: string;
    avatar_url: string;
  };
  created_at?: string;
  description?: string;
  poll_id?: string;
  supporters?: {
    user_id: string;
    username: string;
    avatar_url: string;
  }[];
  hasVoted?: boolean;
}

export interface PollCreator {
  username: string | null;
  avatar_url: string | null;
}

export interface Participant {
  username: string | null;
  avatar_url: string | null;
  character_name: string | null;
  character_image: string | null;
}

export interface PollDetails {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  theme_month: string;
  status: string | null;
  created_by: PollCreator | null;
  likes: number;
  dislikes: number;
  participants: Participant[];
}

export interface FetchPollDataResponse {
  poll?: PollDetails;
  error?: unknown;
}
