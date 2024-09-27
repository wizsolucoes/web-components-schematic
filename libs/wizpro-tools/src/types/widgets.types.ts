
export type WidgetLayoutIdType = 'type1' | 'type2' | 'type3' | 'type4';

export type WidgetBoxType = 'box-full' | 'box-default' | 'box-mini' | 'box-horizontal';

export interface WidgetsProps {
  layout: WidgetLayoutIdType;
  position: number;
  name: WidgetBoxType;
}