import { serverURL } from "@/utils/utils";
import axios from "axios";
import { usePathname } from "next/navigation";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

const MainContext = createContext<any>(null);

function Context({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [limits, setLimits] = useState<any>({});

    const [evaluators, setEvaluators] = useState<any[]>([]);
    const [selectedEvaluator, setSelectedEvaluator] = useState<number>(-1);
    const [loadingEvaluator, setLoadingEvaluator] = useState<boolean>(false);
    const [creatingEvaluator, setCreatingEvaluator] = useState<boolean>(false);
    const [newEvaluatorTitle, setNewEvaluatorTitle] = useState<string>("");
    const [newEvaluatorClassId, setNewEvaluatorClassId] = useState<string>("-1");
    const [newEvaluatorQuestionPapers, setNewEvaluatorQuestionPapers] = useState<string[]>([]);
    const [newEvaluatorAnswerKeys, setNewEvaluatorAnswerKeys] = useState<string[]>([]);
    const [editEvaluatorTitle, setEditEvaluatorTitle] = useState<string>("");
    const [editEvaluatorClassId, setEditEvaluatorClassId] = useState<string>("-1");

    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<number>(-1);
    const [newClassName, setNewClassName] = useState<string>("");
    const [newClassSection, setNewClassSection] = useState<string>("");
    const [newClassSubject, setNewClassSubject] = useState<string>("");
    const [editClassName, setEditClassName] = useState<string>("");
    const [editClassSection, setEditClassSection] = useState<string>("");
    const [editClassSubject, setEditClassSubject] = useState<string>("");
    const [loadingClass, setLoadingClass] = useState<boolean>(false);
    const [creatingClass, setCreatingClass] = useState<boolean>(false);

    const [students, setStudents] = useState<any[]>([]);
    const [newStudentName, setNewStudentName] = useState<string>("");
    const [newStudentRollNo, setNewStudentRollNo] = useState<number>(0);
    const [editStudentName, setEditStudentName] = useState<string>("");
    const [editStudentRollNo, setEditStudentRollNo] = useState<number>(-1);
    const [addingStudent, setAddingStudent] = useState<boolean>(false);
    const [deleteStudentRollNo, setDeleteStudentRollNo] = useState<number>(-1);

    const [answerSheets, setAnswerSheets] = useState<any>([]);

    const [evaluating, setEvaluating] = useState<number>(-1);
    const [evaluationData, setEvaluationData] = useState<any>({});
    const [revaluating, setRevaluating] = useState<boolean>(false);

    const [resultData, setResultData] = useState<any>({});
    const [resultDataTable, setResultDataTable] = useState<any>([]);

    const [imgPreviewURL, setImgPreviewURL] = useState<string>("");

    const getLimits = () => {
        const config = {
            method: "GET",
            url: `${serverURL}/evaluate/evaluators`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        };

        axios(config).then((response) => {
            setLimits(response.data.limits);
        });
    }

    const getEvaluators = () => {
        const config = {
            method: "GET",
            url: `${serverURL}/evaluate/evaluators`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        };

        axios(config).then((response) => {
            setEvaluators(response.data.evaluators);
            setUser(response.data.user);
            setLimits(response.data.limits);

            const selectedEvaluatorLocalData = parseInt(localStorage.getItem("selectedEvaluator") || "-1");
            setSelectedEvaluator(selectedEvaluatorLocalData);

            if (response.data.evaluators.length === 0 && (pathname.includes("evaluators"))) {
                localStorage.setItem("selectedEvaluator", "-1");
                setSelectedEvaluator(-1);
                window.location.href = "/home";
            }
            else if (response.data.evaluators.length > 0 && !pathname.includes("evaluators") && !pathname.includes("classes") && !pathname.includes("admin")) {
                localStorage.setItem("selectedEvaluator", "0");
                setSelectedEvaluator(0);
                window.location.href = "/home/evaluators";
            }

            getStudents(response.data.evaluators[selectedEvaluatorLocalData]?.classId);
            getEvaluation(response.data.evaluators[selectedEvaluatorLocalData]?._id);
        });
    }

    const getClasses = () => {
        const config = {
            method: "GET",
            url: `${serverURL}/class`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        };

        axios(config).then((response) => {
            setClasses(response.data);
            if (response.data.length > 0 && pathname.includes("classes") && selectedClass === -1) {
                setSelectedClass(0);
            }
        });
    }

    const editEvaluator = () => {
        if (editEvaluatorClassId === "-1" || editEvaluatorTitle === '') {
            return toast.error("Please fill all the fields!");
        }

        setCreatingEvaluator(true);

        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluators/update`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "evaluatorId": evaluators[selectedEvaluator]?._id,
                "title": editEvaluatorTitle,
                "classId": editEvaluatorClassId,
            }
        };

        axios(config).then((response) => {
            toast.success("Evaluator saved!");
            setEditEvaluatorTitle("");
            setEditEvaluatorClassId("-1");
            getEvaluators();
            setCreatingEvaluator(false);
        }).catch((error) => {
            toast.error("Something went wrong!");
            setCreatingEvaluator(false);
        });
    }

    const createEvaluator = () => {
        if (newEvaluatorClassId === "-1" || newEvaluatorTitle === '' || newEvaluatorQuestionPapers.length === 0 || newEvaluatorAnswerKeys.length === 0) {
            return toast.error("Please fill all the fields!");
        }

        setCreatingEvaluator(true);

        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluators/create`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "title": newEvaluatorTitle,
                "classId": newEvaluatorClassId,
                "questionPapers": newEvaluatorQuestionPapers,
                "answerKeys": newEvaluatorAnswerKeys,
            }
        };

        axios(config).then((response) => {
            toast.success("Evaluator Created!");
            setNewEvaluatorTitle("");
            setNewEvaluatorQuestionPapers([]);
            setNewEvaluatorAnswerKeys([]);
            setSelectedEvaluator(0);
            getEvaluators();
            setCreatingEvaluator(false);
            window.location.href = "/home/evaluators";
        }).catch((error) => {
            toast.error("Something went wrong!");
            setCreatingEvaluator(false);
        });
    }

    const deleteEvaluator = async () => {
        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluators/delete`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                evaluatorId: evaluators[selectedEvaluator]?._id
            }
        };

        axios(config)
            .then((response) => {
                getEvaluators();
                toast.success("Evaluator deleted!");
                window.location.href = "/home";
            })
            .catch((error) => {
                toast.error("Failed to delete evaluator");
            });
    }

    const createClass = () => {
        if (newClassName === '' || newClassSection === '' || newClassSubject === '') {
            return toast.error("Please fill all the fields!");
        }

        setCreatingClass(true);

        const config = {
            method: "POST",
            url: `${serverURL}/class/create`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "name": newClassName,
                "section": newClassSection,
                "subject": newClassSubject,
            }
        };

        axios(config).then((response) => {
            toast.success("Class Created!");
            setNewClassName("");
            setNewClassSection("");
            setNewClassSubject("");
            setSelectedClass(0);
            getClasses();
            setCreatingClass(false);
        }).catch((error) => {
            toast.error("Something went wrong!");
            setCreatingClass(false);
        });
    }

    const editClass = () => {
        if (editClassName === '' || editClassSection === '' || editClassSubject === '') {
            return toast.error("Please fill all the fields!");
        }

        setCreatingClass(true);

        const config = {
            method: "POST",
            url: `${serverURL}/class/update`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "classId": classes[selectedClass]._id,
                "name": editClassName,
                "section": editClassSection,
                "subject": editClassSubject,
            }
        };

        axios(config).then((response) => {
            toast.success("Class Saved!");
            setEditClassName("");
            setEditClassSection("");
            setEditClassSubject("");
            getClasses();
            setCreatingClass(false);
        }).catch((error) => {
            toast.error("Failed to save class!");
            setCreatingClass(false);
        });
    }

    const deleteClass = async () => {
        const config = {
            method: "POST",
            url: `${serverURL}/class/delete`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                classId: classes[selectedClass]?._id
            }
        };

        axios(config)
            .then((response) => {
                getClasses();
                setSelectedClass(-1);
                toast.success("Class deleted!");
            })
            .catch((error) => {
                toast.error("Failed to delete class");
            });
    }

    const getStudents = (classId?: string) => {
        if (!classId && !classes[selectedClass]?._id) return;
        const config = {
            method: "POST",
            url: `${serverURL}/class/students`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                classId: classId ?? classes[selectedClass]?._id
            }
        };

        axios(config).then((response) => {
            setStudents(response.data);
        });
    }

    const addStudent = () => {
        if (newStudentName === '') {
            return toast.error("Please fill all the fields!");
        }

        setAddingStudent(true);

        const config = {
            method: "POST",
            url: `${serverURL}/class/add-student`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "classId": classes[selectedClass]._id,
                "name": newStudentName,
                "rollNo": newStudentRollNo,
            }
        };

        axios(config).then((response) => {
            toast.success("Student added!");
            setNewStudentName("");
            setNewStudentRollNo(0);
            getStudents();
            setAddingStudent(false);
        }).catch((error) => {
            toast.error(error.response.data);
            setAddingStudent(false);
        });
    }

    const editStudent = () => {
        if (editStudentName === '') {
            return toast.error("Please fill all the fields!");
        }

        setAddingStudent(true);

        const config = {
            method: "POST",
            url: `${serverURL}/class/students/update`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "classId": classes[selectedClass]._id,
                "rollNo": editStudentRollNo,
                "name": editStudentName,
            }
        };

        axios(config).then((response) => {
            toast.success("Student saved!");
            setEditStudentName("");
            setEditStudentRollNo(-1);
            getStudents();
            setAddingStudent(false);
        }).catch((error) => {
            toast.error(error.response.data);
            setAddingStudent(false);
        });
    }

    const deleteStudent = () => {
        setAddingStudent(true);

        const config = {
            method: "POST",
            url: `${serverURL}/class/students/delete`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": `application/json`,
            },
            data: {
                "classId": classes[selectedClass]._id,
                "rollNo": deleteStudentRollNo,
            }
        };

        axios(config).then((response) => {
            toast.success("Student deleted!");
            setNewStudentName("");
            setNewStudentRollNo(0);
            setDeleteStudentRollNo(-1);
            getStudents();
            setAddingStudent(false);
        }).catch((error) => {
            toast.error(error.response.data);
            setAddingStudent(false);
        });
    }

    const getEvaluation = (evaluatorId?: string) => {
        if (!evaluators[selectedEvaluator]?._id && !evaluatorId) return;

        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluations/get`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluators[selectedEvaluator]?._id ?? evaluatorId
            }
        };

        axios(config).then((response) => {
            const data = response.data.answerSheets ?? [];
            setAnswerSheets([...data]);
            setEvaluationData(response.data.data ?? {});
        });
    }

    const updateEvaluation = (evaluatorId: string, answerSheets: any) => {
        if (!evaluatorId) return;
        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluations/update`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluatorId,
                answerSheets: answerSheets,
            }
        };

        axios(config);
    }

    const evaluate = async (rollNo: number) => {
        setEvaluating(rollNo);
        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluators/evaluate`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluators[selectedEvaluator]?._id,
                rollNo: rollNo,
            }
        };

        try {
            var response = await axios(config);
            getLimits();
            return response.data;
        }
        catch (err: any) {
            if (err.response.status === 500) {
                return -3;
            }
            if (err.response.data === "Evaluation limit exceeded") {
                return -2;
            }
            return -1;
        }
    }

    const revaluate = async (evaluatorId: string, rollNo: number, prompt: string) => {
        setEvaluating(rollNo);
        setRevaluating(true);
        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluators/revaluate`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluatorId,
                rollNo: rollNo,
                prompt: !prompt ? "null" : prompt,
            }
        };

        try {
            var response = await axios(config);
            getLimits();
            getResults(evaluatorId, rollNo);
            setEvaluating(-1);
            setRevaluating(false);
            return response.data;
        }
        catch (err) {
            return -1;
        }
    }

    const getResults = (evaluatorId?: string, rollNo?: number) => {
        if (!evaluatorId) return;
        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluations/results`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluatorId,
                rollNo: rollNo,
            }
        };

        axios(config).then((response) => {
            setResultData(response.data);
        });
    }

    const getResultsTable = (evaluatorId?: string) => {
        if (!evaluatorId) return;
        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluations/results/all`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluatorId,
            }
        };

        axios(config).then((response) => {
            setResultDataTable(response.data);
        });
    }

    const deleteEvaluation = async (evaluatorId?: string) => {
        if (!evaluatorId) return;

        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluations/delete`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluatorId,
            }
        };

        await axios(config);
        getEvaluation();
    }

    const saveResult = async (evaluatorId: string, rollNo: number, resultData: any) => {
        const config = {
            method: "POST",
            url: `${serverURL}/evaluate/evaluations/results/save`,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                evaluatorId: evaluatorId,
                rollNo: rollNo,
                results: resultData,
            }
        };

        await axios(config);
        toast.success("Result saved!");
        getResults(evaluatorId, rollNo);
    }


    return (
        <MainContext.Provider value={{
            moreMenuOpen,
            setMoreMenuOpen,
            showMenu,
            setShowMenu,
            user,
            setUser,
            loading,
            setLoading,
            selectedTab,
            setSelectedTab,
            limits,
            evaluators,
            setEvaluators,
            selectedEvaluator,
            setSelectedEvaluator,
            newEvaluatorTitle,
            setNewEvaluatorTitle,
            loadingEvaluator,
            setLoadingEvaluator,
            creatingEvaluator,
            setCreatingEvaluator,
            newEvaluatorQuestionPapers,
            setNewEvaluatorQuestionPapers,
            newEvaluatorAnswerKeys,
            setNewEvaluatorAnswerKeys,
            classes,
            setClasses,
            selectedClass,
            setSelectedClass,
            newClassName,
            setNewClassName,
            newClassSection,
            setNewClassSection,
            newClassSubject,
            setNewClassSubject,
            loadingClass,
            setLoadingClass,
            creatingClass,
            setCreatingClass,
            students,
            setStudents,
            newStudentName,
            setNewStudentName,
            newStudentRollNo,
            setNewStudentRollNo,
            addingStudent,
            setAddingStudent,
            deleteStudentRollNo,
            setDeleteStudentRollNo,
            getEvaluators,
            getClasses,
            createEvaluator,
            deleteEvaluator,
            createClass,
            deleteClass,
            getStudents,
            addStudent,
            deleteStudent,
            getEvaluation,
            updateEvaluation,
            answerSheets,
            setAnswerSheets,
            newEvaluatorClassId,
            setNewEvaluatorClassId,
            evaluate,
            setEvaluating,
            evaluating,
            evaluationData,
            getResults,
            setResultData,
            resultData,
            deleteEvaluation,
            setImgPreviewURL,
            imgPreviewURL,
            getResultsTable,
            resultDataTable,
            editClassName,
            setEditClassName,
            editClassSection,
            setEditClassSection,
            editClassSubject,
            setEditClassSubject,
            editClass,
            editStudentName,
            setEditStudentName,
            editStudentRollNo,
            setEditStudentRollNo,
            editStudent,
            editEvaluatorTitle,
            setEditEvaluatorTitle,
            editEvaluatorClassId,
            setEditEvaluatorClassId,
            editEvaluator,
            saveResult,
            revaluate,
            revaluating
        }}>
            {children}
        </MainContext.Provider>
    );
}

export { MainContext, Context };