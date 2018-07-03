export interface Notific8Options {
  closeHelpText?: string;
  closeReject?: Function;
  closeResolve?: Function;
  horizontalEdge?: 'top'|'bottom';
  id?: string;
  imageAltText?: string;
  imageUrl?: string;
  life?: number;
  queue?: boolean;
  sticky?: boolean;
  styleNamespace?: string;
  title?: string;
  theme?: string;
  themeColor?: string;
  verticalEdge?: 'left'|'right';
  zIndex?: number;
  [key: string]: string|number|boolean|Function|undefined;
}
