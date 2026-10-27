import { MASCOTS } from "./model/catalog.js";
import { Image } from "../image/Image.jsx";
import styles from "./Mascot.module.css";

export const MascotGallery = () => {
  return (
    <section className={styles.gallery} aria-labelledby="meet-helpers">
      <h2 id="meet-helpers">A few familiar faces</h2>
      <p>
        Our little desktop crew keeps you company. You'll spot them tucked into
        forms, questions, and corners of Usof.
      </p>
      <div className={styles.crew}>
        {Object.values(MASCOTS).map((mascot) => (
          <figure key={mascot.id}>
            <Image
              src={mascot.poses.welcome}
              width={72}
              height={72}
              alt=""
            />
            <figcaption>
              <strong>{mascot.name}</strong>
              <p>{mascot.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
