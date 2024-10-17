const ListItemDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="text-slate-600 text-right text-xs whitespace-pre-line">
    {children}
  </div>
);

export default ListItemDescription;
