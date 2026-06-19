import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  name: string;
  description: string;
}

export function FeatureCard({ name, description }: FeatureCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div className={styles.card} onMouseMove={handleMouseMove}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
