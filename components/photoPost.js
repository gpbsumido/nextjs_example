import GamePageStyles from '../styles/GamePage.module.css';
import Image from 'next/image'

export default function PhotoPost({image,text,date}){
  return (
    <div
      className={GamePageStyles.photoPostContainer}
    >
      <div
        className={GamePageStyles.photoDiv}
      >
        <img
          className={GamePageStyles.photoPostPhoto}
          src={image}
          alt={text.slice(0,9)}
        />
      </div>
      <p
        className={GamePageStyles.dateStyle}
      >
        {date}
      </p>
      <p
        className={GamePageStyles.photoPostText}
      >
        { text }
      </p>
    </div>
  );
}