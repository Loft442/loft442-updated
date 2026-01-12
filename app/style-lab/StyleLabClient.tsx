import type { ReactNode } from "react";
import styles from "./stylelab.module.css";

type StyleLabClientProps = {
  children: ReactNode;
};

export default function StyleLabClient({ children }: StyleLabClientProps) {
  return <div className={styles.labRoot}>{children}</div>;
}
