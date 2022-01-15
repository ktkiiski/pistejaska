const ListItemText: React.VFC<{
  title: string;
  description?: string;
}> = ({ title, description }) => (
  <div className="flex-1 pl-1 mr-8">
    <div className="font-medium">{title}</div>
    <div className="text-gray-600 text-sm">{description}</div>
  </div>
);

export default ListItemText;
