import styles from './DropdownContent.module.css';

interface Props {
  className?: string;
  items?: string[];
  selected?: string;
  onSelect: (value: string) => void;
}

export default function DropdownContent({ className, items, selected, onSelect }: Props) {
  return (
    <div className={styles.wrapper}>
      <ul className={`${styles.content} ${className}`}>
        {items?.map((item) => (
          <li key={item} onClick={() => onSelect(item)} className={`${item === selected ? styles.selected : ''}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
