import { TailwindCard } from "./Container";
import styles from './ViewContentLayout.module.css';

interface ViewContentLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const ViewContentLayout: React.FC<ViewContentLayoutProps> = ({
  header,
  children,
  footer,
}) => {
  return (
    <>
      <div className="p-2 container mx-auto">
        {header && <div className="p-2">{header}</div>}

        <TailwindCard className="text-sm">
          {children}
          {footer && (
            <div className="hidden md:flex">
              <div className="w-full p-4 pg-white mt-8 border-t-2 rounded-b-xl">
                {footer}
              </div>
            </div>
          )}
        </TailwindCard>
      </div>

      {footer && (
        <>
          {/* Invisible placeholder for the fixed footer */}
          <div className={`md:hidden ${styles.footerPlaceholder}`} />
          <div className="w-full px-2 py-4 bg-white fixed bottom-0 border-t-2 md:hidden">
            <div className="container mx-auto">{footer}</div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewContentLayout;
