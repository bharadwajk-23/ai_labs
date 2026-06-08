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
}
