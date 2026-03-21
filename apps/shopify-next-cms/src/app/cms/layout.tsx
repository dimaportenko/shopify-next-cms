import "@puckeditor/core/puck.css";
import "./cms.css";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return <div className="cms-editor-root">{children}</div>;
}
