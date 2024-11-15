import { CardContent } from "../../ui/card";
import { Calendar } from "../../ui/calendar";
import { useState } from "react";

const CalendarUI = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <CardContent className="flex-1 pb-0">
      <Calendar mode="single" selected={date} onSelect={setDate} />
    </CardContent>
  );
};

export default CalendarUI;
