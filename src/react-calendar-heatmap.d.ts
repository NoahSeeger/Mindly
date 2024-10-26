declare module "react-calendar-heatmap" {
  import { ComponentType } from "react";

  interface HeatmapValue {
    date: string;
    count: number;
  }

  interface CalendarHeatmapProps {
    startDate: Date;
    endDate: Date;
    values: HeatmapValue[];
    classForValue?: (value: HeatmapValue | null) => string;
    // Add other props as needed
  }

  const CalendarHeatmap: ComponentType<CalendarHeatmapProps>;

  export default CalendarHeatmap;
}
