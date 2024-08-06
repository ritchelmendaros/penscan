interface ClassInterface {
    classid: string;
    classname: string;
    teacherid: string;
    classCode: string | null;
    studentid: string[]; // Assuming `studentid` should be an array of strings
}

export type { ClassInterface };
