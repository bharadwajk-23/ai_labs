import projectsData from '../data/projects.json';
import type { Project } from '../data/schema';

function getMergedProjects(): Project[] {
  // SSR / testing check
  if (typeof window === 'undefined') {
    return projectsData as Project[];
  }

  try {
    const staticProjects = [...(projectsData as Project[])];
    const customProjectsStr = localStorage.getItem('ys_custom_projects');
    const deletedProjectsStr = localStorage.getItem('ys_deleted_projects');
    
    let merged = staticProjects;

    // 1. Apply additions & edits
    if (customProjectsStr) {
      const customProjects = JSON.parse(customProjectsStr) as Project[];
      customProjects.forEach(custom => {
        const index = merged.findIndex(p => p.id === custom.id);
        if (index !== -1) {
          // Edit existing static project
          merged[index] = custom;
        } else {
          // Add new project
          merged.push(custom);
        }
      });
    }

    // 2. Filter out deleted projects
    if (deletedProjectsStr) {
      const deletedIds = JSON.parse(deletedProjectsStr) as string[];
      merged = merged.filter(p => !deletedIds.includes(p.id));
    }

    return merged;
  } catch (err) {
    console.error('Error merging projects from storage:', err);
    return projectsData as Project[];
  }
}

export function useProjects(): Project[] {
  return getMergedProjects();
}

export function useProject(id: string): Project | undefined {
  return getMergedProjects().find(p => p.id === id);
}
