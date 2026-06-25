export interface Feature {
  name: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  demo_url: string;
  features: Feature[];
  color: string;
  gradient: string;
  image: string;
  types: string[];
  use_iframe?: boolean;
  
  // Sales metadata fields
  sales_tagline?: string;
  time_savings?: string[];
  screenshots?: string[];
}

