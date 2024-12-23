import Gradients from "../Common/Gradients";
import InputContainer from "../Common/InputContainer";
import {
  faCircleUser,
  faUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import robotHeart from "../../assets/robot-with-heart.svg";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { registerUser } from "../../apiCalls/userApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!firstname || !lastname || !username || !password || !selectedOption) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser(
        firstname,
        lastname,
        username,
        password,
        selectedOption
      );

      toast.dark("Registration successful:", response);
      navigate("/login");
    } catch (error) {
      toast.error(
        "Username already exists or there was an error with the registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signup Main">
      {/* <main> */}
      <div className="container">
        <form action="" onSubmit={handleSignUp}>
          <h1>SIGN UP</h1>
          <InputContainer
            icon={faCircleUser}
            placeholder={"firstname"}
            value={firstname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
          />
          <InputContainer
            icon={faCircleUser}
            placeholder={"lastname"}
            value={lastname}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
          />
          <InputContainer
            icon={faUser}
            type={"text"}
            placeholder={"username"}
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <InputContainer
            icon={faLock}
            type={"password"}
            placeholder={"password"}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <div className="radio-container">
            <div className="radio">
              <input
                type="radio"
                id="student"
                name="options"
                value="Student"
                checked={selectedOption === "Student"}
                onChange={handleOptionChange}
              />
              <label htmlFor="student">Student</label>
            </div>
            <div className="radio">
              <input
                type="radio"
                id="teacher"
                name="options"
                value="Teacher"
                checked={selectedOption === "Teacher"}
                onChange={handleOptionChange}
              />
              <label htmlFor="teacher">Teacher</label>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <SyncLoader color="#fff" size={6} /> : "Signup"}
          </button>
        </form>

        <div className="img-container">
          <img src={robotHeart} alt="" />
          <p>
            Have an account?{" "}
            <span>
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        </div>
      </div>

      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default Signup;
