import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import type { Project, Feature } from '../../data/schema';
import styles from './AdminDashboardPage.module.css';



const STACK_PRESETS = [
  'knowledge search',
  'reports',
  'predictive analytics',
  'transcription',
  'patient&clinic portals',
  'voice'
];



export default function AdminDashboardPage() {
  const { handleLogout, theme, setTheme } = useOutletContext<{
    handleLogout: () => void;
    theme: string;
    setTheme: (t: string) => void;
  }>();
  const projects = useProjects();
  
  // Dashboard navigation state
  // Local state mirroring storage for reactive re-renders
  const [customProjects, setCustomProjects] = useState<Project[]>([]);
  const [deletedProjects, setDeletedProjects] = useState<string[]>([]);

  // Project search, filters & sorting
  const [projectSearch, setProjectSearch] = useState('');
  const [filterVertical, setFilterVertical] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'id-asc' | 'id-desc'>('title-asc');
  
  // Modal states for Add/Edit Project
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states for project
  const [formTitle, setFormTitle] = useState('');
  const [formDemoUrl, setFormDemoUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('#6366f1');
  const [formImage, setFormImage] = useState('');
  const [formSalesTagline, setFormSalesTagline] = useState('');
  const [formTypes, setFormTypes] = useState<string[]>([]);
  const [formScreenshots, setFormScreenshots] = useState<string[]>([]);
  
  // Custom categories prompt modals
  const [isNewTypeModalOpen, setIsNewTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [isNewVerticalModalOpen, setIsNewVerticalModalOpen] = useState(false);
  const [newVerticalName, setNewVerticalName] = useState('');

  // Custom categories
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [customVerticals, setCustomVerticals] = useState<string[]>([]);

  // Dynamic lists for Form
  const [formFeatures, setFormFeatures] = useState<Feature[]>([{ name: '', description: '' }]);
  
  // Vertical selection
  const [verticalType, setVerticalType] = useState<string>('None');

  // Form error
  const [formError, setFormError] = useState('');

  // Initial load
  useEffect(() => {
    try {
      const customs = JSON.parse(localStorage.getItem('ys_custom_projects') || '[]');
      const deleteds = JSON.parse(localStorage.getItem('ys_deleted_projects') || '[]');
      const savedCustomTypes = JSON.parse(localStorage.getItem('ys_custom_types') || '[]');
      const savedCustomVerticals = JSON.parse(localStorage.getItem('ys_custom_verticals') || '[]');
      
      setCustomProjects(customs);
      setDeletedProjects(deleteds);
      setCustomTypes(savedCustomTypes);
      setCustomVerticals(savedCustomVerticals);
      
      // Initialize system logs
      addLog('System Initialization complete.');
      addLog('Loaded ' + customs.length + ' custom projects and ' + deleteds.length + ' deletions.');
      addLog('Retrieved client inquiries from database.');
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Helper to append log
  const addLog = (message: string) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
  };

  // Merge logic to compute current list for display
  const allProjectsList = useMemo(() => {
    // If we rely purely on useProjects(), it reflects localStorage at mount, but to make it instantly reactive to
    // CRUD state updates in this dashboard, we merge customProjects and filter out deletedProjects locally.
    const staticProjects = projects.filter(p => {
      // Keep static ones (not in custom projects, and not deleted)
      const isCustom = customProjects.some(cp => cp.id === p.id);
      const isDeleted = deletedProjects.includes(p.id);
      return !isCustom && !isDeleted;
    });

    return [...staticProjects, ...customProjects].filter(p => !deletedProjects.includes(p.id));
  }, [projects, customProjects, deletedProjects]);

  // Dynamically compile types/capabilities from all projects list
  const allAvailableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    allProjectsList.forEach(p => {
      if (p.types) {
        p.types.forEach(t => typesSet.add(t));
      }
    });
    return Array.from(typesSet).sort();
  }, [allProjectsList]);

  // Search, filter & sort projects
  const filteredProjects = useMemo(() => {
    // 1. Filter
    let list = allProjectsList.filter(p => {
      // Search matches
      const matchesSearch = 
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(projectSearch.toLowerCase());

      // Vertical matches
      let calculatedVertical = 'Other';
      if (p.id.includes('medical') || p.id.includes('scriber')) calculatedVertical = 'Healthcare';
      else if (p.id.includes('chatbot') || p.id.includes('health-plan')) calculatedVertical = 'Insurance';
      else if (p.id.includes('recruitment')) calculatedVertical = 'Recruitment';
      
      const pVertical = p.verticals && p.verticals[0] ? p.verticals[0] : calculatedVertical;
      const matchesVertical = filterVertical === 'All' || pVertical === filterVertical;

      // Type/Capability matches
      const matchesType = filterType === 'All' || (p.types && p.types.includes(filterType));

      return matchesSearch && matchesVertical && matchesType;
    });

    // 2. Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'id-asc':
          return a.id.localeCompare(b.id);
        case 'id-desc':
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return list;
  }, [allProjectsList, projectSearch, filterVertical, filterType, sortBy]);



  // Delete project handler
  const handleDeleteProject = (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      // 1. If it's a custom project, remove from custom list
      const isCustom = customProjects.some(p => p.id === projectId);
      if (isCustom) {
        const updatedCustoms = customProjects.filter(p => p.id !== projectId);
        localStorage.setItem('ys_custom_projects', JSON.stringify(updatedCustoms));
        setCustomProjects(updatedCustoms);
        addLog(`Deleted custom project: "${projectId}"`);
      } else {
        // 2. If it's a static project, add to deleted list
        const updatedDeleteds = [...deletedProjects, projectId];
        localStorage.setItem('ys_deleted_projects', JSON.stringify(updatedDeleteds));
        setDeletedProjects(updatedDeleteds);
        addLog(`De-activated catalog project: "${projectId}"`);
      }
    } catch (e) {
      console.error(e);
    }
  };



  // Prepare Add Modal
  const openAddModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormDemoUrl('');
    setFormDescription('');
    setFormColor('#6366f1');
    setFormImage('');
    setFormSalesTagline('');
    setFormTypes([]);
    setFormScreenshots([]);
    setFormFeatures([{ name: '', description: '' }]);
    setVerticalType('None');
    setFormError('');
    setIsProjectModalOpen(true);
  };

  // Prepare Edit Modal
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormTitle(project.title);
    setFormDemoUrl(project.demo_url);
    setFormDescription(project.description);
    setFormColor(project.color);
    setFormImage(project.image);
    setFormSalesTagline(project.sales_tagline || '');
    setFormTypes(project.types || []);
    setFormScreenshots(project.screenshots || []);
    
    // Features
    setFormFeatures(project.features && project.features.length > 0 
      ? project.features 
      : [{ name: '', description: '' }]
    );
    


    // Get vertical from project verticals
    if (project.verticals && project.verticals.length > 0) {
      setVerticalType(project.verticals[0]);
    } else {
      // Guess vertical based on ID strings
      if (project.id.includes('medical') || project.id.includes('scriber')) {
        setVerticalType('Healthcare');
      } else if (project.id.includes('chatbot') || project.id.includes('health-plan')) {
        setVerticalType('Insurance');
      } else if (project.id.includes('recruitment')) {
        setVerticalType('Recruitment');
      } else {
        setVerticalType('None');
      }
    }

    setFormError('');
    setIsProjectModalOpen(true);
  };

  // Handle Project Form Submission
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle || !formDescription || !formDemoUrl) {
      setFormError('Please fill out all required fields (*).');
      return;
    }

    if (!formImage) {
      setFormError('Please upload a project mockup showcase image.');
      return;
    }

    if (formTypes.length === 0) {
      setFormError('Please select at least one technology stack vertical / type.');
      return;
    }

    // Filter empty items
    const cleanFeatures = formFeatures.filter(f => f.name.trim() && f.description.trim());

    // Generate custom ID (or keep existing if editing)
    let finalId = editingProject ? editingProject.id : '';
    if (!finalId) {
      // Slugify title
      let slug = formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Append suffix keyword to match getVerticals checks in CatalogPage
      if (verticalType === 'Healthcare') {
        slug += '-medical';
      } else if (verticalType === 'Insurance') {
        slug += '-chatbot';
      } else if (verticalType === 'Recruitment') {
        slug += '-recruitment';
      }

      // Check for duplicate ID
      const exists = allProjectsList.some(p => p.id === slug);
      if (exists) {
        slug += '-' + Math.floor(Math.random() * 1000);
      }
      finalId = slug;
    }

    // Build color gradient dynamically based on accent color
    // e.g. from accent color to a darker variant
    const gradient = `linear-gradient(135deg, ${formColor} 0%, rgba(3, 7, 18, 0.9) 100%)`;

    const projectData: Project = {
      id: finalId,
      title: formTitle,
      client: '',
      description: formDescription,
      demo_url: formDemoUrl,
      color: formColor,
      gradient: gradient,
      image: formImage,
      types: formTypes,
      sales_tagline: formSalesTagline || undefined,
      features: cleanFeatures,
      screenshots: formScreenshots,
      verticals: verticalType !== 'None' ? [verticalType] : undefined
    };

    try {
      let updatedCustoms = [...customProjects];
      if (editingProject) {
        // Edit flow
        const idx = updatedCustoms.findIndex(p => p.id === editingProject.id);
        if (idx !== -1) {
          updatedCustoms[idx] = projectData;
        } else {
          // If we edited a static project, it becomes a custom project override
          updatedCustoms.push(projectData);
        }
        addLog(`Updated project catalog entry: "${finalId}"`);
      } else {
        // Add flow
        updatedCustoms.push(projectData);
        addLog(`Created new project: "${finalId}"`);
      }

      localStorage.setItem('ys_custom_projects', JSON.stringify(updatedCustoms));
      setCustomProjects(updatedCustoms);
      
      // If we previously deleted this ID (e.g. recreating), remove from deletions
      if (deletedProjects.includes(finalId)) {
        const updatedDeleteds = deletedProjects.filter(id => id !== finalId);
        localStorage.setItem('ys_deleted_projects', JSON.stringify(updatedDeleteds));
        setDeletedProjects(updatedDeleteds);
      }

      setIsProjectModalOpen(false);
    } catch (e) {
      setFormError('Error saving project to storage.');
      console.error(e);
    }
  };

  // Form List Handlers
  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const list = [...formFeatures];
    list[index][field] = value;
    setFormFeatures(list);
  };

  const addFeatureRow = () => {
    setFormFeatures([...formFeatures, { name: '', description: '' }]);
  };

  const removeFeatureRow = (index: number) => {
    if (formFeatures.length === 1) return;
    setFormFeatures(formFeatures.filter((_, i) => i !== index));
  };

  const handleCatalogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setFormScreenshots(prev => [...prev, ...base64Images]);
      addLog(`Uploaded ${base64Images.length} project screenshots.`);
    });
  };

  const removeScreenshot = (index: number) => {
    setFormScreenshots(formScreenshots.filter((_, i) => i !== index));
  };

  const submitNewType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName && newTypeName.trim()) {
      const typeClean = newTypeName.trim().toLowerCase();
      if (!STACK_PRESETS.includes(typeClean) && !customTypes.includes(typeClean)) {
        const updated = [...customTypes, typeClean];
        localStorage.setItem('ys_custom_types', JSON.stringify(updated));
        setCustomTypes(updated);
        setFormTypes(prev => [...prev, typeClean]);
        addLog(`Added custom capability type: "${typeClean}"`);
      } else {
        alert("This capability/type already exists.");
      }
      setIsNewTypeModalOpen(false);
      setNewTypeName('');
    }
  };

  const submitNewVertical = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVerticalName && newVerticalName.trim()) {
      const vertClean = newVerticalName.trim();
      if (!['Healthcare', 'Insurance', 'Recruitment'].includes(vertClean) && !customVerticals.includes(vertClean)) {
        const updated = [...customVerticals, vertClean];
        localStorage.setItem('ys_custom_verticals', JSON.stringify(updated));
        setCustomVerticals(updated);
        setVerticalType(vertClean);
        addLog(`Added custom vertical category: "${vertClean}"`);
      } else {
        alert("This vertical category already exists.");
      }
      setIsNewVerticalModalOpen(false);
      setNewVerticalName('');
    }
  };



  const handleTypeCheckbox = (type: string) => {
    if (formTypes.includes(type)) {
      setFormTypes(formTypes.filter(t => t !== type));
    } else {
      setFormTypes([...formTypes, type]);
    }
  };

  return (
    <div className={styles.dashboardLayoutSingle}>
      
      {/* ── HEADER BAR ────────────────────────────────────── */}
      <header className={styles.topHeader}>
        <div className={styles.headerBrand}>
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 50 V82" stroke="#0f4c81" strokeWidth="12" strokeLinecap="round" />
            <path d="M22 22 L50 50" stroke="#f26522" strokeWidth="12" strokeLinecap="round" />
            <path d="M78 22 L50 50" stroke="#107c41" strokeWidth="12" strokeLinecap="round" />
            <circle cx="22" cy="22" r="10" fill="#f26522" />
            <circle cx="78" cy="22" r="10" fill="#107c41" />
            <circle cx="50" cy="50" r="7" fill="var(--color-brand)" />
            <circle cx="50" cy="82" r="10" fill="#0f4c81" />
          </svg>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>youngsoft</span>
            <span className={styles.brandSub}>ADMIN CATALOG MANAGER</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => setTheme(theme === 'obsidian' ? 'light' : 'obsidian')}
            className={styles.themeToggle}
            title={theme === 'obsidian' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            <div className={styles.iconWrapper}>
              {theme === 'obsidian' ? (
                <svg
                  key="moon"
                  className={styles.themeIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg
                  key="sun"
                  className={styles.themeIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </div>
          </button>

          <Link to="/" className={styles.viewSiteBtn}>
            🏠 Home
          </Link>
          <button 
            onClick={handleLogout} 
            className={styles.logoutIconButton} 
            title="Log Out Session"
            aria-label="Log Out"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ─────────────────────────── */}
      <main className={styles.mainContainerSingle}>
        <div className={styles.projectsPanel}>
          {/* Controls */}
          <div className={styles.panelActions}>
            <div className={styles.actionRowTop}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <button onClick={openAddModal} className={styles.addBtn}>
                ➕ Create New Project
              </button>
            </div>

            <div className={styles.filterControls}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Vertical:</label>
                <select 
                  value={filterVertical} 
                  onChange={(e) => setFilterVertical(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="All">All Industry Verticals</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Recruitment">Recruitment</option>
                  {customVerticals.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Type / Capability:</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="All">All Types</option>
                  {allAvailableTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Sort By:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={styles.filterSelect}
                >
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="id-asc">ID (A-Z)</option>
                  <option value="id-desc">ID (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid / Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.projectTable}>
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Project Title</th>
                  <th>Primary Industry Vertical</th>
                  <th>Tech Stack Types</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.tableEmpty}>
                      No projects found matching the query.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map(project => {
                    let calculatedVertical = 'Other';
                    if (project.id.includes('medical') || project.id.includes('scriber')) calculatedVertical = 'Healthcare';
                    else if (project.id.includes('chatbot') || project.id.includes('health-plan')) calculatedVertical = 'Insurance';
                    else if (project.id.includes('recruitment')) calculatedVertical = 'Recruitment';

                    return (
                      <tr key={project.id}>
                        <td>
                          <div className={styles.projIdCol}>
                            <code className={styles.tableId}>{project.id}</code>
                          </div>
                        </td>
                        <td>
                          <span className={styles.tableTitle}>{project.title}</span>
                        </td>
                        <td>
                          <span className={`${styles.verticalBadge} ${styles['vertical' + calculatedVertical]}`}>
                            {project.verticals && project.verticals[0] ? project.verticals[0] : calculatedVertical}
                          </span>
                        </td>
                        <td>
                          <div className={styles.tableTypesList}>
                            {project.types.map(t => (
                              <span key={t} className={styles.tableTypeTag}>{t}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className={styles.tableActions}>
                            <button 
                              onClick={() => openEditModal(project)}
                              className={styles.btnEdit}
                              title="Edit Project Details"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className={styles.btnDelete}
                              title="Delete Project"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── PROJECT EDIT/ADD FORM DIALOG MODAL ───────── */}
      {isProjectModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsProjectModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setIsProjectModalOpen(false)}>✕</button>
            
            <h3 className={styles.modalTitle}>
              {editingProject ? `Edit Project: ${editingProject.id}` : 'Create New AI Catalog Project'}
            </h3>

            {formError && <div className={styles.modalError}>{formError}</div>}

            <form onSubmit={handleSaveProject} className={styles.projectForm}>
              
              <div className={styles.formColumnsGrid}>
                
                {/* LEFT COLUMN: CORE INFO */}
                <div className={styles.formColLeft}>
                  <div className={styles.formSection}>
                    <h4>Core Metadata</h4>
                    
                    <div className={styles.inputGroup}>
                      <label>Project Title *</label>
                      <input 
                        type="text" 
                        required 
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Demand Forecaster Agent"
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label>Demo URL *</label>
                        <input 
                          type="url" 
                          required 
                          value={formDemoUrl}
                          onChange={(e) => setFormDemoUrl(e.target.value)}
                          placeholder="e.g. https://forecaster.youngsoft.com"
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Accent Color *</label>
                        <div className={styles.colorPickerWrapper}>
                          <input 
                            type="color" 
                            required 
                            value={formColor}
                            onChange={(e) => setFormColor(e.target.value)}
                          />
                          <code>{formColor}</code>
                        </div>
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Industry Vertical *</label>
                      <div className={styles.verticalSelectWrapper}>
                        <select 
                          value={verticalType} 
                          onChange={(e) => setVerticalType(e.target.value)}
                          title="Determines which tab category the project shows under on the main page."
                        >
                          <option value="None">None (Default/Other)</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Recruitment">Recruitment</option>
                          {customVerticals.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => setIsNewVerticalModalOpen(true)} className={styles.addInlineBtn}>
                          ➕ Add New...
                        </button>
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Sales Pitch Tagline</label>
                      <input 
                        type="text" 
                        value={formSalesTagline}
                        onChange={(e) => setFormSalesTagline(e.target.value)}
                        placeholder="e.g. Leverage ML Demand Forecasting to Trim Over-Stock Overheads."
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Catalog Description *</label>
                      <textarea 
                        required 
                        rows={4}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Provide a sales-focused high level summary of what this AI service accomplishes..."
                      />
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4>Mockup Showcase Image *</h4>
                    <div className={styles.inputGroup}>
                      <div className={styles.imageUploadWrapper}>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleCatalogImageUpload}
                          className={styles.hiddenFileInput}
                          id="catalog-image-upload"
                        />
                        <label htmlFor="catalog-image-upload" className={styles.uploadBtn}>
                          📤 Upload Mockup
                        </label>
                      </div>
                      {formImage && (
                        <div className={styles.imageFileName}>
                          📄 Selected File: <code>{formImage.startsWith('data:') ? 'uploaded_mockup.png' : formImage.split('/').pop()}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: TECH STACK, KEY FEATURES, SCREENSHOTS */}
                <div className={styles.formColRight}>
                  
                  {/* Capabilities & Tech Stack */}
                  <div className={styles.formSection}>
                    <h4>Capabilities & Tech Stack (Select at least 1) *</h4>
                    <div className={styles.checkboxGrid}>
                      {STACK_PRESETS.map(stackType => (
                        <label key={stackType} className={styles.checkboxItem}>
                          <input 
                            type="checkbox" 
                            checked={formTypes.includes(stackType)}
                            onChange={() => handleTypeCheckbox(stackType)}
                          />
                          <span>{stackType}</span>
                        </label>
                      ))}
                      {customTypes.map(stackType => (
                        <label key={stackType} className={styles.checkboxItem}>
                          <input 
                            type="checkbox" 
                            checked={formTypes.includes(stackType)}
                            onChange={() => handleTypeCheckbox(stackType)}
                          />
                          <span>{stackType}</span>
                        </label>
                      ))}
                    </div>
                    <button type="button" onClick={() => setIsNewTypeModalOpen(true)} className={styles.addNewTypeBtn}>
                      ➕ Add Custom Capability...
                    </button>
                  </div>

                  {/* Key Features */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <h4>Key Features</h4>
                      <button type="button" onClick={addFeatureRow} className={styles.addListBtn}>
                        ➕ Add Feature
                      </button>
                    </div>
                    
                    <div className={styles.listFieldsScroll}>
                      {formFeatures.map((feat, idx) => (
                        <div key={idx} className={styles.featureRow}>
                          <div className={styles.featureHeader}>
                            <span className={styles.featureIndex}>Feature #{idx + 1}</span>
                            <button 
                              type="button" 
                              onClick={() => removeFeatureRow(idx)}
                              className={styles.removeRowBtn}
                              disabled={formFeatures.length === 1}
                              title="Remove Feature"
                            >
                              🗑️
                            </button>
                          </div>
                          <div className={styles.rowInputs}>
                            <input 
                              type="text" 
                              placeholder="Feature Title (e.g. Real-time Analytics)"
                              value={feat.name}
                              onChange={(e) => handleFeatureChange(idx, 'name', e.target.value)}
                              className={styles.rowInputName}
                            />
                            <textarea 
                              placeholder="Describe this feature..."
                              rows={2}
                              value={feat.description}
                              onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                              className={styles.rowInputDesc}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Screenshots Gallery */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <h4>Screenshots Gallery</h4>
                      <div>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={handleScreenshotsUpload} 
                          id="screenshots-upload"
                          className={styles.hiddenFileInput}
                        />
                        <label htmlFor="screenshots-upload" className={styles.addListBtn}>
                          📤 Upload Screenshots
                        </label>
                      </div>
                    </div>

                    <div className={styles.screenshotsGrid}>
                      {formScreenshots.map((shot, index) => (
                        <div key={index} className={styles.screenshotThumbWrapper}>
                          <img src={shot} alt={`screenshot-${index}`} className={styles.screenshotThumb} />
                          <button 
                            type="button" 
                            onClick={() => removeScreenshot(index)} 
                            className={styles.removeScreenshotBtn}
                            title="Remove screenshot"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {formScreenshots.length === 0 && (
                        <div className={styles.emptyScreenshots}>No screenshots uploaded yet.</div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* FOOTER ACTIONS */}
              <div className={styles.modalFooterActions}>
                <button 
                  type="button" 
                  onClick={() => setIsProjectModalOpen(false)} 
                  className={styles.cancelFormBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitFormBtn}>
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Custom Add Vertical Modal overlay */}
      {isNewVerticalModalOpen && (
        <div className={styles.promptOverlay} onClick={() => setIsNewVerticalModalOpen(false)}>
          <div className={styles.promptContent} onClick={e => e.stopPropagation()}>
            <h4 className={styles.promptTitle}>Add Custom Vertical</h4>
            <form onSubmit={submitNewVertical}>
              <input 
                type="text" 
                required
                value={newVerticalName} 
                onChange={e => setNewVerticalName(e.target.value)} 
                placeholder="e.g. Finance, Education"
                className={styles.promptInput}
                autoFocus
              />
              <div className={styles.promptActions}>
                <button type="button" onClick={() => setIsNewVerticalModalOpen(false)} className={styles.promptCancelBtn}>Cancel</button>
                <button type="submit" className={styles.promptSubmitBtn}>Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Add Tech Stack Type Modal overlay */}
      {isNewTypeModalOpen && (
        <div className={styles.promptOverlay} onClick={() => setIsNewTypeModalOpen(false)}>
          <div className={styles.promptContent} onClick={e => e.stopPropagation()}>
            <h4 className={styles.promptTitle}>Add Custom Capability/Type</h4>
            <form onSubmit={submitNewType}>
              <input 
                type="text" 
                required
                value={newTypeName} 
                onChange={e => setNewTypeName(e.target.value)} 
                placeholder="e.g. computer vision, llm agent"
                className={styles.promptInput}
                autoFocus
              />
              <div className={styles.promptActions}>
                <button type="button" onClick={() => setIsNewTypeModalOpen(false)} className={styles.promptCancelBtn}>Cancel</button>
                <button type="submit" className={styles.promptSubmitBtn}>Add Type</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
