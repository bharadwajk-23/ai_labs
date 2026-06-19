import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import styles from './DemoRequestModal.module.css';

interface DemoRequestModalProps {
  onClose: () => void;
  preselectedProjectId?: string | null;
}

export default function DemoRequestModal({ onClose, preselectedProjectId }: DemoRequestModalProps) {
  const projects = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    projectId: preselectedProjectId || '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Handle outside click to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    // Lock background scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setStatus('submitting');
    
    // Simulate API lead capture call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  const handleClose = () => {
    // Clear the search param to close
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('demo');
    setSearchParams(newParams);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div 
        className={`${styles.modal} ${status === 'success' ? styles.successModal : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
          ✕
        </button>

        {status !== 'success' ? (
          <>
            <div className={styles.header}>
              <h2 id="modal-title" className={styles.title}>Book a Consultation</h2>
              <p className={styles.subtitle}>
                Discuss your business workflow requirements and explore how custom AI integrations can cut operational timelines.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="John Doe"
                    disabled={status === 'submitting'}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Work Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="john@company.com"
                    disabled={status === 'submitting'}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>Company / Practice Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Acme Corp"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="industry" className={styles.label}>Industry Focus</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={styles.select}
                    disabled={status === 'submitting'}
                  >
                    <option value="">Select Industry</option>
                    <option value="Healthcare">Healthcare / Medical</option>
                    <option value="Recruitment">Hiring / Talent Acquisition</option>
                    <option value="Insurance">Insurance Services</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Tech">Software & Technology</option>
                    <option value="Other">Other Enterprise</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="projectId" className={styles.label}>AI Agent of Interest</label>
                <select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={status === 'submitting'}
                >
                  <option value="">General Custom Integration</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} (by {p.client.split(' / ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Tell us about your manual bottlenecks</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="E.g., Our clinicians spend 12 hours a week typing documentation..."
                  disabled={status === 'submitting'}
                  rows={3}
                />
              </div>

              <button 
                type="submit" 
                className={`${styles.submitBtn} ${status === 'submitting' ? styles.loadingBtn : ''}`}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <span className={styles.spinner}></span>
                ) : (
                  'Submit Consultation Request'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successScreen}>
            <div className={styles.successIconWrapper}>
              <svg className={styles.successIcon} width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M20 6L9 17L4 12" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Request Submitted!</h2>
            <p className={styles.successText}>
              Thank you, <strong>{formData.name}</strong>. Our AI solutions specialist will reach out to <strong>{formData.email}</strong> within 1 business day to schedule your technical consultation.
            </p>
            <div className={styles.successLeadDetails}>
              {formData.projectId && (
                <div className={styles.detailRow}>
                  <span>Interest:</span>
                  <strong>{projects.find(p => p.id === formData.projectId)?.title}</strong>
                </div>
              )}
              {formData.company && (
                <div className={styles.detailRow}>
                  <span>Company:</span>
                  <strong>{formData.company}</strong>
                </div>
              )}
            </div>
            <button className={styles.successCloseBtn} onClick={handleClose}>
              Back to Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
