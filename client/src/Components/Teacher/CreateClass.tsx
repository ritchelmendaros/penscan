import BtnWithRobot from "../Common/BtnWithRobot";
import Header from "../Common/Header";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import Gradients from "../Common/Gradients";
import InputContainer from "../Common/InputContainer";
import { useNavigate } from "react-router-dom";
import React, { useState, ChangeEvent } from "react";
import { useCurrUser } from "../Context/UserContext";
import { postCreateClass } from "../../apiCalls/classAPIs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../../Components/Modal/ConfirmationModal";
import BackBtn from "../Common/BackBtn";

const CreateClass: React.FC = () => {
  const navigate = useNavigate();

  const [className, setClassName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useCurrUser();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const handleCreateClass = () => {
    if (className.trim() === "") {
      toast.error("Class name is required.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (user?.userid) {
      setLoading(true);
      try {
        await postCreateClass(className, user.userid);
        navigate("/dashboard");
      } catch (err) {
        toast.error("Error creating class");
      } finally {
        setLoading(false);
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="CreateClass Main MainContent">
      <Header />
      <BackBtn />
      <main>
        <div className="content">
          <h2>Create class</h2>

          <InputContainer
            icon={faFolder}
            placeholder={"Create class"}
            value={className}
            onChange={handleInputChange}
          />

          <BtnWithRobot
            name={"Create"}
            onClick={handleCreateClass}
            loading={loading}
          />
        </div>
      </main>

      <Gradients />
      <ToastContainer />
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="Are you sure you want to create this class?"
        loading={loading}
      />
    </div>
  );
};

export default CreateClass;
