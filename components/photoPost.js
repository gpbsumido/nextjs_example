import GamePageStyles from '../styles/GamePage.module.css';
import landingPageStyles from '../styles/LandingPage.module.css';

export default function PhotoPost({image,text,date,removeImage}){
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
      <button
        className={landingPageStyles.loadMore}
        onClick={async ()=> removeImage(text)}
      >
        Delete: "{ text.length > 15 ? (text.slice(0,15) + '...') : text }"
      </button>
    </div>
  );
}