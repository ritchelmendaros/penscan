import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useClass } from "../../../../Context/ClassContext";
import { fetchAllStudents } from "@/apiCalls/userApi";
import { addStudentToClass } from "@/apiCalls/studentApi";
import { Button } from "@/Components/ui/button";
import BtnWithRobot from "../../../../Common/BtnWithRobot";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";

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
  const [loading, setLoading] = useState(false);
  const { clickedClass } = useClass();
  const classId = clickedClass?.classid;
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

  const handleInputchange = (value: string) => {
    setStudentName(value);
    setFilteredStudents(
      allStudents.filter((student) =>
        `${student.firstname} ${student.lastname}`
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
  };

  const handleAddStudent = async () => {
    if (selectedStudent) {
      if (!classId) {
        toast.error("Class ID is missing. Please try again.");
        return;
      }
      setLoading(true); 
      try {
        await addStudentToClass(
          selectedStudent.userid,
          classId
        );
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

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentName(`${student.firstname} ${student.lastname}`);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-2xl space-y-6 p-4">
        <h2 className="text-2xl font-bold">Add Student</h2>

        <div className="relative">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search for a student..."
              value={studentName}
              onValueChange={handleInputchange}
            />
            <CommandList>
              <CommandEmpty>No students found.</CommandEmpty>
              <CommandGroup heading="Students">
                <ScrollArea className="h-72">
                  {filteredStudents.map((student) => (
                    <CommandItem
                      key={student.userid}
                      onSelect={() => handleSelectStudent(student)}
                      className="flex items-center justify-between p-2"
                    >
                      <span className="flex-1">
                        {student.firstname} {student.lastname}
                      </span>
                      <span className="text-sm text-slate-400">
                        @{student.username}
                      </span>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <div className="flex justify-end">
          <BtnWithRobot name={"Add"} onClick={handleAddStudent} loading={loading}/>{" "}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AddStudentV2;
