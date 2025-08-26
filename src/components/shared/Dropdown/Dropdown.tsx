import styles from './Dropdown.module.css';

interface Props {
  className?: string;
  children?: string[];
  selected?: string;
  onSelect: (value: string) => void;
}

export default function Dropdown({ className, children, selected, onSelect }: Props) {
  const dropdownContent = children;
  return (
    <div className={styles.wrapper}>
      <ul className={`${styles.content} ${className}`}>
        {dropdownContent?.map((item) => (
          <li key={item} onClick={() => onSelect(item)} className={`${item === selected ? styles.selected : ''}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
