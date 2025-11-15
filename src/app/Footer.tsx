import {getVersion} from "@/helpers/release";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className={styles.footer}>
      <div className={styles.copyright}>
        <span>
          ©️ 2025
          {currentYear > 2025 ? ` - ${currentYear}` : ""} Fabio Lazzaroni
        </span>
      </div>
      <small className={styles.version}>Versione {getVersion()}</small>
    </div>
  );
}
