import { useEffect, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { format } from "date-fns";
import { Separator } from "../../ui/separator";
import { getActivityLogsByTeacher } from "../../../apiCalls/classAPIs";

const Log = ({ teacherId }: { teacherId: string }) => {
  const [logData, setLogData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await getActivityLogsByTeacher(teacherId);
        setLogData(logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [teacherId]); 
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {logData.map((entry, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {entry.userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {entry.activity}
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
