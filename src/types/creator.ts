export type Platform = 'github' | 'youtube' | 'twitter' | 'bluesky' | 'website';

export interface PlatformLink {
  type: Platform;
  handle: string;
  url: string;
  followers: number | null;
}

export type CuratorTier = 'must-follow' | 'recommended' | 'niche' | 'official';

export interface Creator {
  id: string;
  slug: string;
  name: string;
  primary_handle: string;
  primary_platform: Platform;
  type: 'person' | 'organization';
  bio: string;
  bio_en?: string;
  location: string;
  company: string;
  avatar?: string | null;
  platforms: PlatformLink[];
  stats: Record<string, number>;
  tags: string[];
  is_curator_pick?: boolean;
  curator_tier?: CuratorTier;
  editor_note?: string;
  editor_note_en?: string;
  category_scores?: Record<string, number>;
}

export interface CreatorsPayload {
  generated_at: string;
  count: number;
  creators: Creator[];
}
