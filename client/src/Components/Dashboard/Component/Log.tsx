import { ScrollArea } from "../../ui/scroll-area";
import { format } from "date-fns";
import { Separator } from "../../ui/separator";

const logData = [
  {
    name: "Olivia Martin",
    action: "Approved the sales report",
    timestamp: "2024-03-15T09:24:00Z",
  },
  {
    name: "Jackson Lee",
    action: "Reviewed the design proposal",
    timestamp: "2024-03-15T10:30:00Z",
  },
  {
    name: "Isabella Wang",
    action: "Updated the project timeline",
    timestamp: "2024-03-15T11:15:00Z",
  },
  {
    name: "Ethan Rodriguez",
    action: "Submitted the budget forecast",
    timestamp: "2024-03-15T13:45:00Z",
  },
  {
    name: "Sophia Chen",
    action: "Modified the client contract",
    timestamp: "2024-03-15T14:20:00Z",
  },
  {
    name: "Sophia Chen",
    action: "Modified the client contract",
    timestamp: "2024-03-15T14:20:00Z",
  },
  {
    name: "Sophia Chen",
    action: "Modified the client contract",
    timestamp: "2024-03-15T14:20:00Z",
  },
  {
    name: "Sophia Chen",
    action: "Modified the client contract",
    timestamp: "2024-03-15T14:20:00Z",
  },
];

const Log = () => {
  return (
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {logData.map((entry, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {entry.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.action}
                    </p>
                  </div>
                  <span className="text-sm pr-4 text-muted-foreground">
                    {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                  </span>
                </div>
                {index < logData.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
  );
};

export default Log;