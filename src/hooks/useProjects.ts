import projectsData from '../data/projects.json';
import type { Project } from '../data/schema';

const projects = projectsData as Project[];

export function useProjects(): Project[] {
  return projects;
}

export function useProject(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}
