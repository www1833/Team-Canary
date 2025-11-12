export type Photo = {
  id: string;
  title?: string;
  description?: string;
  takenAt?: string;
  tags?: string[];
  src: string;
  thumb?: string;
  width?: number;
  height?: number;
  order?: number;
  featured?: boolean;
};

export type PhotoFilters = {
  query: string;
  tags: string[];
  onlyFeatured: boolean;
};
