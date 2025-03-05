export type TSessionItem = {
  logo?: string;
  name?: string;
  url?: string;
  topic?: string;
  type?: string;
};

export type TSessionItemProps = {
  item: TSessionItem;
  onDelete: () => void;
};
