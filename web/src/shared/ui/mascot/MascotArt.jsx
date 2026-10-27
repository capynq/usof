import { Image } from "../image/Image.jsx";
import { MASCOTS } from "./model/catalog.js";
import { CAMEO_ART } from "./model/cameoArt.js";
import styles from "./PassiveMascot.module.css";

export const MascotArt = ({
  characterId,
  placement = "portrait",
  pose = "idle",
  className = "",
}) => {
  const mascot = MASCOTS[characterId] ?? MASCOTS.byte;
  const art = CAMEO_ART[mascot.id]?.[placement] ?? {
    src: mascot.poses[pose] ?? mascot.poses.idle,
    width: 48,
    height: 48,
  };
  return (
    <Image
      src={art.src}
      width={art.width}
      height={art.height}
      alt=""
      aria-hidden="true"
      data-mascot-id={mascot.id}
      data-mascot-placement={placement}
      className={`${styles.art} ${className}`}
      fallback={
        <span
          className={`${styles.art} ${className}`}
          data-mascot-id={mascot.id}
          data-mascot-placement={placement}
          aria-hidden="true"
        >
          ✦
        </span>
      }
    />
  );
};
