import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";

import { useState, useEffect, useRef } from "react";
import { fetchAllStudents } from "@/apiCalls/userApi";
import { addStudentToClass } from "@/apiCalls/studentApi";
import { useClass } from "@/Components/Context/ClassContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ScrollArea } from "@/Components/ui/scroll-area";

interface Student {
  userid: string;
  username: string;
  firstname: string;
  lastname: string;
}

const AddStudentV2 = () => {
  const [studentName, setStudentName] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { clickedClass } = useClass();
  const classId = clickedClass?.classid;
  const [userTyping, setUserTyping] = useState<string>("");
  const typingTimerRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await fetchAllStudents();
        setAllStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        toast.error("Error fetching students");
      }
    };

    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentName(value);
    setShowDropdown(true);
    setFilteredStudents(
      allStudents.filter((student) =>
        `${student.firstname} ${student.lastname}`
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
  };

  const handleDropdownBlur = () => {
    const username = studentName.split(" ").pop();
    const matchedStudent = allStudents.find(
      (student) => `${student.username}` === username
    );

    if (matchedStudent) {
      setSelectedStudent(matchedStudent);
    } else {
      setSelectedStudent(null);
    }

    setShowDropdown(false);
    console.log(showDropdown);
  };

  const handleAddStudent = async () => {
    if (selectedStudent) {
      if (!classId) {
        toast.error("Class ID is missing. Please try again.");
        return;
      }
      setLoading(true);
      try {
        await addStudentToClass(selectedStudent.userid, classId);
        toast.dark("Student added successfully!");
        setTimeout(() => {
          navigate(`/dashboard/class`);
        }, 500);
      } catch (error) {
        setLoading(false);
        toast.error("Error adding student");
      }
    } else {
      toast.error("Please select a student before adding.");
    }
  };

  const handleValueChange = (e: any): void => {
    setStudentName(e);
  };

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center h-full">
        <div className="h-[300px]">
          <h2 className="mb-5">Add Student</h2>

          <Command
            className=" rounded-lg border shadow-md md:min-w-[700px]"
            value={studentName}
            onValueChange={handleValueChange}
          >
            <CommandInput
              placeholder={userTyping ? studentName : "Enter a student name"}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading="Suggestions">
                <ScrollArea
                  className={`${
                    filteredStudents.length > 4 && userTyping === ""
                      ? "h-[100px]"
                      : ""
                  }`}
                >
                  {filteredStudents.map((student) => (
                    <CommandItem key={student.username}>
                      <span>
                        {student.firstname.charAt(0).toUpperCase() +
                          student.firstname.slice(1)}{" "}
                        {student.lastname.charAt(0).toUpperCase() +
                          student.lastname.slice(1)}
                      </span>
                      <span className="text-xs text-slate-400">
                        @{student.username}
                      </span>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  );
};

export default AddStudentV2;
