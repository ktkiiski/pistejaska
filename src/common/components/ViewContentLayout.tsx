import { TailwindCard } from "./Container";

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
      <div className="p-2">
        {header && <div className="p-2">{header}</div>}

        <TailwindCard className="text-center text-sm p-0">
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

      <div className="w-full p-4 bg-white mt-8 sticky bottom-0 border-t-2 md:hidden">
        {footer}
      </div>
    </>
  );
};

export default ViewContentLayout;
