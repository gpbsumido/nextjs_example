import GamePageStyles from '../styles/GamePage.module.css';

export default function GamePage({props,index}){
  return (
    <div className={GamePageStyles.gamePageDiv}>
      <a href={`https://test.refmint.xyz/a/g/${props.custom_url}`}>{props.name}</a>
    </div>
  );
}