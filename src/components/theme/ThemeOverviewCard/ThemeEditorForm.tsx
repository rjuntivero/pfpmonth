import styles from './ThemeOverviewCard.module.css';

interface Props {
  name: string;
  description: string;
  onChange: (data: { name: string; description: string }) => void;
}

export default function ThemeEditorForm({ name, description, onChange }: Props) {
  return (
    <div className={styles.inputControls}>
      <div className={styles.nameInput}>
        <label htmlFor="name">Theme name:</label>
        <input id="name" className={styles.input} value={name} onChange={(e) => onChange({ name: e.target.value, description })} />
      </div>
      <div className={styles.descriptionInput}>
        <label htmlFor="description">Description:</label>
        <textarea id="description" className={styles.input} value={description} onChange={(e) => onChange({ name, description: e.target.value })} />
      </div>
    </div>
  );
}
