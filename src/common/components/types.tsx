export type TailwindStyle = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
};

export type TailwindListStyle = TailwindStyle & {
  key: string;
};