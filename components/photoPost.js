import GamePageStyles from '../styles/GamePage.module.css';
import Image from 'next/image'

export default function PhotoPost({image,text}){
  return (
    <div
      className={GamePageStyles.photoPostContainer}
    >
      <Image
        src={image}
        alt={text.slice(0,9)}
      />
      <p
        className={GamePageStyles.photoPostText}
      >
        { text }
      </p>
    </div>
  );
}