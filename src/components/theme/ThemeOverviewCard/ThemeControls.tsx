import Button from '@/components/shared/Button/Button';
import styles from './ThemeOverviewCard.module.css';

interface Props {
  editing: boolean;
  type: string;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onReset?: () => void;
  onClaim?: () => void;
}

export default function ThemeControls({ editing, type, onSave, onCancel, onEdit, onReset, onClaim }: Props) {
  if (editing) {
    return (
      <div className={styles.controls}>
        <Button variant="theme-card" onClick={onSave}>
          save
        </Button>
        <Button variant="theme-card" onClick={onCancel}>
          cancel
        </Button>
      </div>
    );
  }

  if (type !== 'suggestion') {
    return (
      <div className={styles.controls}>
        <Button variant="theme-card" onClick={onEdit}>
          edit
        </Button>
        <Button variant="theme-card" onClick={onReset}>
          reset
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.controls}>
      <Button variant="theme-card">promote</Button>
      <Button variant="theme-card" onClick={onEdit}>
        edit
      </Button>
    </div>
  );
}
