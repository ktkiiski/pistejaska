import Card from "./Card";
import styles from "./ViewContentLayout.module.css";

interface ViewContentLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const ViewContentLayout: React.FC<ViewContentLayoutProps> = ({
  header,
  children,
  footer,
  className,
}) => {
  return (
    <>
      <div className={`p-2 container mx-auto ${className || ""}`}>
        {header && <div className="p-2">{header}</div>}

        <Card className="text-sm p-0">
          <div className="p-2">{children}</div>

          {/* Desktop footer */}
          {footer && (
            <div className="hidden md:flex">
              <div className="w-full p-4 bg-white mt-8 border-t-2 rounded-b-xl">
                {footer}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Mobile footer */}
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
