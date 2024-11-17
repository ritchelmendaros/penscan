import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../Common/Header";
import BtnWithRobot from "../../../Common/BtnWithRobot";
import Gradients from "../../../Common/Gradients";
import DropdownContainer from "../../../Common/DropdownContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "./Component/Search";

interface Student {
  userid: string;
  username: string;
  firstname: string;
  lastname: string;
}

const AddStudent: React.FC = () => {
  return (
    // <div className="AddStudent Main MainContent">
    //   <Search/>
    //   <Header />
    //   <main>
    //     <div className="content">
    //       <h2>Add Student</h2>
    //       <DropdownContainer
    //         icon={faPlus}
    //         type="text"
    //         placeholder="Enter Student Name"
    //         value={studentName}
    //         onChange={handleInputChange}
    //         onBlur={handleDropdownBlur}
    //         list="students"
    //       />
    //       <datalist id="students">
    //         {filteredStudents.map((student) => (
    //           <option
    //             key={student.userid}
    //             value={`${student.firstname} ${student.lastname} - ${student.username}`}
    //           />
    //         ))}
    //       </datalist>
    //       <BtnWithRobot name={"Add"} onClick={handleAddStudent} loading={loading}/>{" "}
    //     </div>
    //   </main>

    //   <Gradients />
    //   <ToastContainer />
    // </div>
    <>
      <Header />
      <main>
        <Search />
      </main>
    </>
  );
};

export default AddStudent;
