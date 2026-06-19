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
  highlights: string[];
  features: Feature[];
  color: string;
  gradient: string;
  image: string;
  tech_stack: string[];
  capabilities: string[];
  use_iframe?: boolean;
  
  // Sales metadata fields
  sales_tagline?: string;
  why_buy?: string[];
  time_savings?: string[];
  screenshots?: string[];
}

