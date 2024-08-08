
export type WidgetLayoutIdType = 'type1' | 'type2' | 'type3' | 'type4';

export interface WidgetsProps {
  layout: WidgetLayoutIdType;
  position: number;
  name: 'full' | 'box-default' | 'box-mini' | 'box-horizontal';
}