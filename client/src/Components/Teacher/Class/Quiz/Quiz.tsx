import React, { useEffect, useState } from "react";
import Header from "../../../Common/Header";
import Gradients from "../../../Common/Gradients";
import SmilingRobot from "../../../Common/SmilingRobot";
import { getAllQuizScores } from "../../../../apiCalls/QuizAPIs";
import { useQuiz } from "../../../Context/QuizContext";
import { StudentQuiz } from "../../../Interface/Quiz";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import {
  uploadStudentQuiz,
  deleteStudentQuiz,
} from "../../../../apiCalls/studentQuizApi";
import { SyncLoader } from "react-spinners";
import Analysis from "./Analysis";
import noDataGif from "../../../../assets/nodata.gif";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmationModal from "../../../Modal/ConfirmationModal";
import BackBtn from "../../../Common/BackBtn";

const Quiz = () => {
  const navigate = useNavigate();
  const [studentsWithScores, setStudentsWithScores] = useState<StudentQuiz[]>(
    []
  );
  const { selectedQuiz, setSelectedStudentResult, setStudentScoreResults } =
    useQuiz();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [analysisTab, setAnalysisTab] = useState(false);
  const [refreshScores, setRefreshScores] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentQuiz | null>(
    null
  );

  useEffect(() => {
    if (selectedQuiz?.quizid) {
      setIsFetching(true);
      getAllQuizScores(selectedQuiz.quizid)
        .then((student) => {
          const values = Object.values(student);
          values.sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toUpperCase();
            const nameB = `${b.firstName} ${b.lastName}`.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          setStudentsWithScores(values);
          setStudentScoreResults(values);
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [selectedQuiz, refreshScores]);

  const handleViewStudentScore = (student: StudentQuiz) => {
    setSelectedStudentResult(student);
    navigate(`/dashboard/class/quiz/quiz-result`);
  };

  // const handleEditStudentScore = (student: StudentQuiz) => {
  //   setSelectedStudentResult(student);
  //   navigate(`/dashboard/class/quiz/quiz-result-edit`);
  // };

  const handleDownloadExcel = () => {
    const data = studentsWithScores.map((student) => ({
      "Student Name": `${student.firstName} ${student.lastName}`,
      Score: student.finalScore,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");
    XLSX.writeFile(workbook, "StudentScores.xlsx");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && selectedQuiz) {
      setIsLoading(true);
      try {
        await uploadStudentQuiz(selectedQuiz.quizid, selectedFile);
        toast.success("File uploaded successfully!");
        setSelectedFile(null);
        setIsModalOpen(false);
        setRefreshScores(true);
      } catch (error) {
        toast.error("File upload failed.");
        setSelectedFile(null);
        setIsModalOpen(false);
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
        setSelectedFile(null);
      }
    } else {
      toast.warn(
        "Please select a file to upload and ensure a quiz is selected."
      );
    }
  };

  const handleDeleteStudentScore = (student: StudentQuiz) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete && selectedQuiz?.quizid) {
      try {
        await deleteStudentQuiz(studentToDelete.userId, selectedQuiz.quizid);
        setRefreshScores(true);
      } catch (error) {
        toast.error("Failed to delete the score.");
      } finally {
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
      }
    }
  };

  const formatDueDate = (dueDateTime: string): string => {
    const date = new Date(dueDateTime);

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date
      .toLocaleTimeString(undefined, timeOptions)
      .replace(":00 ", " ");

    return `${formattedDate} | ${formattedTime}`;
  };

  return (
    <div className="Quiz Main MainContent">
      <Header />
      <BackBtn />
      <main>
        <div className="btn-container">
          <div>
            <button
              onClick={() => setAnalysisTab(false)}
              className={`${analysisTab ? "inactive" : "active"}`}
            >
              Quiz Files
            </button>
            <button
              onClick={() => setAnalysisTab(true)}
              className={`${analysisTab ? "active" : "inactive"}`}
            >
              Analysis
            </button>
          </div>
          {selectedQuiz?.dueDateTime && (
            <h5 style={{ marginLeft: "10px", fontStyle: "italic" }}>
              Due Date: {formatDueDate(selectedQuiz.dueDateTime)}
            </h5>
          )}
          <div className="upload-download">
            {/* <button onClick={() => setIsModalOpen(true)}>Upload</button> */}
            <button onClick={handleDownloadExcel}>Download Excel</button>
          </div>
        </div>
        {analysisTab ? (
          <Analysis />
        ) : (
          <div className="table">
            <ul className="thead">
              <li className="th">
                <p className="td">Student Name</p>
                <p className="td">Score</p>
                <p className="td" style={{ marginLeft: "-5px" }}>
                  Status
                </p>
                <p className="td" style={{ marginLeft: "-5px" }}>
                  Last Modified
                </p>
                <p className="td">Actions</p>
              </li>
            </ul>
            <ul className="tbody">
              {isFetching ? (
                <div className="loader-container">
                  <SyncLoader
                    size={10}
                    color={"#416edf"}
                    loading={isFetching}
                  />
                </div>
              ) : studentsWithScores.length === 0 ? (
                <div className="no-data-container">
                  <img src={noDataGif} alt="No Data Found" />
                </div>
              ) : (
                studentsWithScores.map((student, i) => (
                  <li
                    key={i}
                    className={`tr ${
                      student.editedStatus === "Edited"
                        ? "highlight-edited"
                        : student.editedStatus === "Approved"
                        ? "highlight-approved"
                        : ""
                    }`}
                  >
                    <p className="td">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="td" style={{ marginLeft: "20px" }}>
                      {student.finalScore}
                    </p>
                    <p className="td">{student.editedStatus}</p>
                    <p className="td">{formatDueDate(student.lastModified)}</p>
                    <div>
                      <button
                        className="view"
                        onClick={() => handleViewStudentScore(student)}
                      >
                        View
                      </button>
                      {/* <button
                        className="edit"
                        onClick={() => handleEditStudentScore(student)}
                      >
                        Edit
                      </button> */}
                      <button
                        className="delete"
                        style={{marginLeft: "50px"}}
                        onClick={() => handleDeleteStudentScore(student)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{
                            color: "red",
                            backgroundColor: "transparent",
                          }}
                        />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
      {isModalOpen && (
        <div className="modalquiz-overlay">
          <div className="modalquiz-content">
            <h3>Please Upload a File</h3> <br></br>
            <input
              className="modalquiz-input"
              type="file"
              onChange={handleFileChange}
            />
            {isLoading ? (
              <div className="loader">
                <SyncLoader size={10} color={"#416edf"} loading={isLoading} />
              </div>
            ) : (
              <div className="modalquiz-buttons">
                <button className="modalsubmit" onClick={handleUpload}>
                  Submit
                </button>
                <button
                  className="modalcancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        message="Are you sure you want to delete this student quiz?"
        loading={isLoading}
      />

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default Quiz;
