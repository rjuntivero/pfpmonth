'use client';
import { Slide } from '@/types/Slide';
import styles from './SuggestionsModal.module.css';
import { Poll } from '@/types/Polls';

interface Props {
  themes?: Slide[];
  suggestions?: Poll[];
}

export default function SuggestionModal({ themes, suggestions }: Props) {
  return (
    <>
      <div className={styles.modalWrapper}>
        <div className={styles.content}>
          <div className={styles.suggestionsWrapper}>
            <h1>Suggested Themes:</h1>
            <ul>
              <li>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro, numquam! Iusto nam, quas magni incidunt quidem voluptatibus, unde dicta perferendis ipsa accusantium inventore neque cupiditate soluta exercitationem. Esse, eius libero!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
