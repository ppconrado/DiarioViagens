declare module "react-native-svg-charts" {
  import type { ComponentType } from "react";
  import type { StyleProp, ViewStyle } from "react-native";

  export type ChartDatum = {
    key?: string;
    label?: string;
    value: number;
    svg?: { fill?: string; stroke?: string; [key: string]: unknown };
  };

  export const PieChart: ComponentType<{
    data: ChartDatum[];
    valueAccessor: (args: { item: ChartDatum; index: number }) => number;
    style?: StyleProp<ViewStyle>;
    innerRadius?: number | string;
    outerRadius?: number | string;
    padAngle?: number;
  }>;

  export const BarChart: ComponentType<{
    data: ChartDatum[];
    yAccessor?: (args: { item: ChartDatum; index: number }) => number;
    style?: StyleProp<ViewStyle>;
    contentInset?: { top?: number; bottom?: number; left?: number; right?: number };
    gridMin?: number;
    spacingInner?: number;
    svg?: { fill?: string; stroke?: string; [key: string]: unknown };
  }>;
}
