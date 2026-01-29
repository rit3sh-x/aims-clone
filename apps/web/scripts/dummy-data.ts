import { createCourseDescription, withAlias } from "./utils";

const email = process.env.SEED_ADMIN_EMAIL;

if (!email) {
    console.error("❌ Missing SEED_ADMIN_EMAIL");
    process.exit(1);
}

// ============================================================================
// DEPARTMENTS - Based on typical Indian engineering institute structure
// ============================================================================
export const departments = [
    {
        name: "Computer Science & Engineering",
        code: "CSE",
        website: "https://cse.iitk.ac.in",
    },
    {
        name: "Electrical Engineering",
        code: "EE",
        website: "https://ee.iitk.ac.in",
    },
    {
        name: "Mechanical Engineering",
        code: "ME",
        website: "https://me.iitk.ac.in",
    },
    {
        name: "Civil Engineering",
        code: "CE",
        website: "https://ce.iitk.ac.in",
    },
    {
        name: "Electronics & Communication Engineering",
        code: "ECE",
        website: "https://ece.iitk.ac.in",
    },
    {
        name: "Chemical Engineering",
        code: "CHE",
        website: "https://che.iitk.ac.in",
    },
    {
        name: "Mathematics & Statistics",
        code: "MTH",
        website: "https://mth.iitk.ac.in",
    },
    {
        name: "Physics",
        code: "PHY",
        website: "https://phy.iitk.ac.in",
    },
];

// ============================================================================
// HEADS OF DEPARTMENTS
// ============================================================================
export const hods = [
    {
        name: "Dr. Sandeep Kumar Shukla",
        email: withAlias(email, "hod-cse"),
        phoneNumber: "+919876543101",
        website: "https://cse.iitk.ac.in/users/sandeeps",
        employeeId: "HOD001",
        deptCode: "CSE",
    },
    {
        name: "Dr. Shalabh Bhatnagar",
        email: withAlias(email, "hod-ee"),
        phoneNumber: "+919876543102",
        website: "https://ee.iitk.ac.in/users/shalabh",
        employeeId: "HOD002",
        deptCode: "EE",
    },
    {
        name: "Dr. Avinash Kumar Agarwal",
        email: withAlias(email, "hod-me"),
        phoneNumber: "+919876543103",
        website: "https://me.iitk.ac.in/users/akag",
        employeeId: "HOD003",
        deptCode: "ME",
    },
    {
        name: "Dr. Rajesh Srivastava",
        email: withAlias(email, "hod-ce"),
        phoneNumber: "+919876543104",
        website: "https://ce.iitk.ac.in/users/rajeshs",
        employeeId: "HOD004",
        deptCode: "CE",
    },
    {
        name: "Dr. Nandini Gupta",
        email: withAlias(email, "hod-ece"),
        phoneNumber: "+919876543105",
        website: "https://ece.iitk.ac.in/users/nandinig",
        employeeId: "HOD005",
        deptCode: "ECE",
    },
    {
        name: "Dr. Jayant Kumar Singh",
        email: withAlias(email, "hod-che"),
        phoneNumber: "+919876543106",
        website: "https://che.iitk.ac.in/users/jksingh",
        employeeId: "HOD006",
        deptCode: "CHE",
    },
    {
        name: "Dr. Debashish Goswami",
        email: withAlias(email, "hod-mth"),
        phoneNumber: "+919876543107",
        website: "https://mth.iitk.ac.in/users/dgoswami",
        employeeId: "HOD007",
        deptCode: "MTH",
    },
    {
        name: "Dr. Amit Dutta",
        email: withAlias(email, "hod-phy"),
        phoneNumber: "+919876543108",
        website: "https://phy.iitk.ac.in/users/adutta",
        employeeId: "HOD008",
        deptCode: "PHY",
    },
];

// ============================================================================
// ACADEMIC PROGRAMS
// ============================================================================
export const programs = [
    // CSE Programs
    {
        name: "Bachelor of Technology in Computer Science & Engineering",
        code: "BTCS",
        degreeType: "BACHELOR" as const,
        deptCode: "CSE",
    },
    {
        name: "Master of Technology in Computer Science & Engineering",
        code: "MTCS",
        degreeType: "MASTER" as const,
        deptCode: "CSE",
    },
    {
        name: "Doctor of Philosophy in Computer Science",
        code: "PHCS",
        degreeType: "PHD" as const,
        deptCode: "CSE",
    },
    // EE Programs
    {
        name: "Bachelor of Technology in Electrical Engineering",
        code: "BTEE",
        degreeType: "BACHELOR" as const,
        deptCode: "EE",
    },
    {
        name: "Master of Technology in Electrical Engineering",
        code: "MTEE",
        degreeType: "MASTER" as const,
        deptCode: "EE",
    },
    // ME Programs
    {
        name: "Bachelor of Technology in Mechanical Engineering",
        code: "BTME",
        degreeType: "BACHELOR" as const,
        deptCode: "ME",
    },
    {
        name: "Master of Technology in Mechanical Engineering",
        code: "MTME",
        degreeType: "MASTER" as const,
        deptCode: "ME",
    },
    // CE Programs
    {
        name: "Bachelor of Technology in Civil Engineering",
        code: "BTCE",
        degreeType: "BACHELOR" as const,
        deptCode: "CE",
    },
    // ECE Programs
    {
        name: "Bachelor of Technology in Electronics & Communication",
        code: "BTEC",
        degreeType: "BACHELOR" as const,
        deptCode: "ECE",
    },
    // CHE Programs
    {
        name: "Bachelor of Technology in Chemical Engineering",
        code: "BTCH",
        degreeType: "BACHELOR" as const,
        deptCode: "CHE",
    },
];

// ============================================================================
// ACADEMIC ADVISORS
// ============================================================================
export const advisors = [
    // CSE Advisors
    {
        name: "Dr. Arnab Bhattacharya",
        email: withAlias(email, "adv-cse1"),
        phoneNumber: "+919876543201",
        website: "https://cse.iitk.ac.in/users/arnabb",
        employeeId: "ADV001",
        deptCode: "CSE",
    },
    {
        name: "Dr. Purushottam Kar",
        email: withAlias(email, "adv-cse2"),
        phoneNumber: "+919876543202",
        website: "https://cse.iitk.ac.in/users/purushot",
        employeeId: "ADV002",
        deptCode: "CSE",
    },
    {
        name: "Dr. Nitin Saxena",
        email: withAlias(email, "adv-cse3"),
        phoneNumber: "+919876543203",
        website: "https://cse.iitk.ac.in/users/nitin",
        employeeId: "ADV003",
        deptCode: "CSE",
    },
    // EE Advisors
    {
        name: "Dr. Ketan Rajawat",
        email: withAlias(email, "adv-ee1"),
        phoneNumber: "+919876543204",
        website: "https://ee.iitk.ac.in/users/ketan",
        employeeId: "ADV004",
        deptCode: "EE",
    },
    {
        name: "Dr. Aditya Jagannatham",
        email: withAlias(email, "adv-ee2"),
        phoneNumber: "+919876543205",
        website: "https://ee.iitk.ac.in/users/adityaj",
        employeeId: "ADV005",
        deptCode: "EE",
    },
    // ME Advisors
    {
        name: "Dr. Bishakh Bhattacharya",
        email: withAlias(email, "adv-me1"),
        phoneNumber: "+919876543206",
        website: "https://me.iitk.ac.in/users/bishakh",
        employeeId: "ADV006",
        deptCode: "ME",
    },
    {
        name: "Dr. Sameer Khandekar",
        email: withAlias(email, "adv-me2"),
        phoneNumber: "+919876543207",
        website: "https://me.iitk.ac.in/users/samkhan",
        employeeId: "ADV007",
        deptCode: "ME",
    },
    // CE Advisors
    {
        name: "Dr. Vinod Tare",
        email: withAlias(email, "adv-ce1"),
        phoneNumber: "+919876543208",
        website: "https://ce.iitk.ac.in/users/vinod",
        employeeId: "ADV008",
        deptCode: "CE",
    },
    // ECE Advisors
    {
        name: "Dr. Utpal Das",
        email: withAlias(email, "adv-ece1"),
        phoneNumber: "+919876543209",
        website: "https://ece.iitk.ac.in/users/utpald",
        employeeId: "ADV009",
        deptCode: "ECE",
    },
    // CHE Advisors
    {
        name: "Dr. Naveen Tiwari",
        email: withAlias(email, "adv-che1"),
        phoneNumber: "+919876543210",
        website: "https://che.iitk.ac.in/users/naveen",
        employeeId: "ADV010",
        deptCode: "CHE",
    },
];

// ============================================================================
// INSTRUCTORS
// ============================================================================
export const instructors = [
    // CSE Instructors
    {
        name: "Prof. Manindra Agrawal",
        email: withAlias(email, "inst-cse1"),
        phoneNumber: "+919876543301",
        website: "https://cse.iitk.ac.in/users/manindra",
        employeeId: "INS001",
        deptCode: "CSE",
        designation: "Professor",
    },
    {
        name: "Prof. Sanjeev Saxena",
        email: withAlias(email, "inst-cse2"),
        phoneNumber: "+919876543302",
        website: "https://cse.iitk.ac.in/users/ssax",
        employeeId: "INS002",
        deptCode: "CSE",
        designation: "Professor",
    },
    {
        name: "Dr. Sumit Ganguly",
        email: withAlias(email, "inst-cse3"),
        phoneNumber: "+919876543303",
        website: "https://cse.iitk.ac.in/users/sganguly",
        employeeId: "INS003",
        deptCode: "CSE",
        designation: "Associate Professor",
    },
    {
        name: "Dr. Ashish Choudhury",
        email: withAlias(email, "inst-cse4"),
        phoneNumber: "+919876543304",
        website: "https://cse.iitk.ac.in/users/ashishc",
        employeeId: "INS004",
        deptCode: "CSE",
        designation: "Assistant Professor",
    },
    {
        name: "Dr. Satyadev Nandakumar",
        email: withAlias(email, "inst-cse5"),
        phoneNumber: "+919876543305",
        website: "https://cse.iitk.ac.in/users/satyadev",
        employeeId: "INS005",
        deptCode: "CSE",
        designation: "Assistant Professor",
    },
    // EE Instructors
    {
        name: "Prof. K. S. Venkatesh",
        email: withAlias(email, "inst-ee1"),
        phoneNumber: "+919876543306",
        website: "https://ee.iitk.ac.in/users/venkats",
        employeeId: "INS006",
        deptCode: "EE",
        designation: "Professor",
    },
    {
        name: "Dr. Vipul Singh",
        email: withAlias(email, "inst-ee2"),
        phoneNumber: "+919876543307",
        website: "https://ee.iitk.ac.in/users/vipul",
        employeeId: "INS007",
        deptCode: "EE",
        designation: "Associate Professor",
    },
    {
        name: "Dr. Adrish Banerjee",
        email: withAlias(email, "inst-ee3"),
        phoneNumber: "+919876543308",
        website: "https://ee.iitk.ac.in/users/adrish",
        employeeId: "INS008",
        deptCode: "EE",
        designation: "Assistant Professor",
    },
    // ME Instructors
    {
        name: "Prof. Nachiketa Tiwari",
        email: withAlias(email, "inst-me1"),
        phoneNumber: "+919876543309",
        website: "https://me.iitk.ac.in/users/ntiwari",
        employeeId: "INS009",
        deptCode: "ME",
        designation: "Professor",
    },
    {
        name: "Dr. Sawan Suman Sinha",
        email: withAlias(email, "inst-me2"),
        phoneNumber: "+919876543310",
        website: "https://me.iitk.ac.in/users/sawans",
        employeeId: "INS010",
        deptCode: "ME",
        designation: "Associate Professor",
    },
    // CE Instructors
    {
        name: "Prof. Sudhir Misra",
        email: withAlias(email, "inst-ce1"),
        phoneNumber: "+919876543311",
        website: "https://ce.iitk.ac.in/users/sudhir",
        employeeId: "INS011",
        deptCode: "CE",
        designation: "Professor",
    },
    // ECE Instructors
    {
        name: "Dr. Abhishek Srivastava",
        email: withAlias(email, "inst-ece1"),
        phoneNumber: "+919876543312",
        website: "https://ece.iitk.ac.in/users/abhis",
        employeeId: "INS012",
        deptCode: "ECE",
        designation: "Associate Professor",
    },
    // MTH Instructors (teach service courses to all departments)
    {
        name: "Prof. Debasis Kundu",
        email: withAlias(email, "inst-mth1"),
        phoneNumber: "+919876543313",
        website: "https://mth.iitk.ac.in/users/kundu",
        employeeId: "INS013",
        deptCode: "MTH",
        designation: "Professor",
    },
    {
        name: "Dr. Amit Mitra",
        email: withAlias(email, "inst-mth2"),
        phoneNumber: "+919876543314",
        website: "https://mth.iitk.ac.in/users/amitra",
        employeeId: "INS014",
        deptCode: "MTH",
        designation: "Associate Professor",
    },
    // PHY Instructors (teach service courses)
    {
        name: "Prof. Tapan Mishra",
        email: withAlias(email, "inst-phy1"),
        phoneNumber: "+919876543315",
        website: "https://phy.iitk.ac.in/users/tapan",
        employeeId: "INS015",
        deptCode: "PHY",
        designation: "Professor",
    },
];

// ============================================================================
// STUDENTS - Realistic Indian names with proper roll number format
// ============================================================================
export const students = [
    // 2021 Batch - CSE (4th year)
    {
        name: "Aarav Sharma",
        email: withAlias(email, "s21cs01"),
        rollNo: "210101",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "ADV001",
    },
    {
        name: "Diya Patel",
        email: withAlias(email, "s21cs02"),
        rollNo: "210102",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "ADV001",
    },
    {
        name: "Vivaan Gupta",
        email: withAlias(email, "s21cs03"),
        rollNo: "210103",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "ADV002",
    },
    {
        name: "Ananya Singh",
        email: withAlias(email, "s21cs04"),
        rollNo: "210104",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "ADV002",
    },
    {
        name: "Aditya Reddy",
        email: withAlias(email, "s21cs05"),
        rollNo: "210105",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "ADV003",
    },
    {
        name: "Ishita Joshi",
        email: withAlias(email, "s21cs06"),
        rollNo: "210106",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "ADV003",
    },
    // 2022 Batch - CSE (3rd year)
    {
        name: "Arjun Verma",
        email: withAlias(email, "s22cs01"),
        rollNo: "220101",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "ADV001",
    },
    {
        name: "Kavya Nair",
        email: withAlias(email, "s22cs02"),
        rollNo: "220102",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "ADV001",
    },
    {
        name: "Rohan Iyer",
        email: withAlias(email, "s22cs03"),
        rollNo: "220103",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "ADV002",
    },
    {
        name: "Meera Krishnan",
        email: withAlias(email, "s22cs04"),
        rollNo: "220104",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "ADV002",
    },
    {
        name: "Siddharth Menon",
        email: withAlias(email, "s22cs05"),
        rollNo: "220105",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "ADV003",
    },
    {
        name: "Priya Agarwal",
        email: withAlias(email, "s22cs06"),
        rollNo: "220106",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "ADV003",
    },
    // 2023 Batch - CSE (2nd year)
    {
        name: "Kabir Malhotra",
        email: withAlias(email, "s23cs01"),
        rollNo: "230101",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "ADV001",
    },
    {
        name: "Aisha Khan",
        email: withAlias(email, "s23cs02"),
        rollNo: "230102",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "ADV001",
    },
    {
        name: "Vihaan Chopra",
        email: withAlias(email, "s23cs03"),
        rollNo: "230103",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "ADV002",
    },
    {
        name: "Riya Banerjee",
        email: withAlias(email, "s23cs04"),
        rollNo: "230104",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "ADV002",
    },
    // 2024 Batch - CSE (1st year)
    {
        name: "Ayaan Chauhan",
        email: withAlias(email, "s24cs01"),
        rollNo: "240101",
        programCode: "BTCS",
        batchYear: 2024,
        advisorEmployeeId: "ADV001",
    },
    {
        name: "Saanvi Kapoor",
        email: withAlias(email, "s24cs02"),
        rollNo: "240102",
        programCode: "BTCS",
        batchYear: 2024,
        advisorEmployeeId: "ADV002",
    },
    {
        name: "Reyansh Deshmukh",
        email: withAlias(email, "s24cs03"),
        rollNo: "240103",
        programCode: "BTCS",
        batchYear: 2024,
        advisorEmployeeId: "ADV003",
    },
    {
        name: "Kiara Rao",
        email: withAlias(email, "s24cs04"),
        rollNo: "240104",
        programCode: "BTCS",
        batchYear: 2024,
        advisorEmployeeId: "ADV003",
    },
    // 2021 Batch - EE (4th year)
    {
        name: "Arnav Saxena",
        email: withAlias(email, "s21ee01"),
        rollNo: "210201",
        programCode: "BTEE",
        batchYear: 2021,
        advisorEmployeeId: "ADV004",
    },
    {
        name: "Tanvi Mishra",
        email: withAlias(email, "s21ee02"),
        rollNo: "210202",
        programCode: "BTEE",
        batchYear: 2021,
        advisorEmployeeId: "ADV004",
    },
    {
        name: "Dhruv Sinha",
        email: withAlias(email, "s21ee03"),
        rollNo: "210203",
        programCode: "BTEE",
        batchYear: 2021,
        advisorEmployeeId: "ADV005",
    },
    {
        name: "Nisha Pandey",
        email: withAlias(email, "s21ee04"),
        rollNo: "210204",
        programCode: "BTEE",
        batchYear: 2021,
        advisorEmployeeId: "ADV005",
    },
    // 2022 Batch - EE (3rd year)
    {
        name: "Parth Srivastava",
        email: withAlias(email, "s22ee01"),
        rollNo: "220201",
        programCode: "BTEE",
        batchYear: 2022,
        advisorEmployeeId: "ADV004",
    },
    {
        name: "Simran Kaur",
        email: withAlias(email, "s22ee02"),
        rollNo: "220202",
        programCode: "BTEE",
        batchYear: 2022,
        advisorEmployeeId: "ADV005",
    },
    // 2023 Batch - EE (2nd year)
    {
        name: "Yash Tiwari",
        email: withAlias(email, "s23ee01"),
        rollNo: "230201",
        programCode: "BTEE",
        batchYear: 2023,
        advisorEmployeeId: "ADV004",
    },
    {
        name: "Shreya Dubey",
        email: withAlias(email, "s23ee02"),
        rollNo: "230202",
        programCode: "BTEE",
        batchYear: 2023,
        advisorEmployeeId: "ADV005",
    },
    // 2024 Batch - EE (1st year)
    {
        name: "Lakshay Kumar",
        email: withAlias(email, "s24ee01"),
        rollNo: "240201",
        programCode: "BTEE",
        batchYear: 2024,
        advisorEmployeeId: "ADV004",
    },
    {
        name: "Aditi Sharma",
        email: withAlias(email, "s24ee02"),
        rollNo: "240202",
        programCode: "BTEE",
        batchYear: 2024,
        advisorEmployeeId: "ADV005",
    },
    // 2021 Batch - ME (4th year)
    {
        name: "Kartik Bhatt",
        email: withAlias(email, "s21me01"),
        rollNo: "210301",
        programCode: "BTME",
        batchYear: 2021,
        advisorEmployeeId: "ADV006",
    },
    {
        name: "Nandini Yadav",
        email: withAlias(email, "s21me02"),
        rollNo: "210302",
        programCode: "BTME",
        batchYear: 2021,
        advisorEmployeeId: "ADV007",
    },
    // 2022 Batch - ME (3rd year)
    {
        name: "Shaurya Mehta",
        email: withAlias(email, "s22me01"),
        rollNo: "220301",
        programCode: "BTME",
        batchYear: 2022,
        advisorEmployeeId: "ADV006",
    },
    {
        name: "Aarna Goyal",
        email: withAlias(email, "s22me02"),
        rollNo: "220302",
        programCode: "BTME",
        batchYear: 2022,
        advisorEmployeeId: "ADV007",
    },
    // 2023 Batch - ME (2nd year)
    {
        name: "Om Prakash Singh",
        email: withAlias(email, "s23me01"),
        rollNo: "230301",
        programCode: "BTME",
        batchYear: 2023,
        advisorEmployeeId: "ADV006",
    },
    {
        name: "Navya Rastogi",
        email: withAlias(email, "s23me02"),
        rollNo: "230302",
        programCode: "BTME",
        batchYear: 2023,
        advisorEmployeeId: "ADV007",
    },
    // 2024 Batch - ME (1st year)
    {
        name: "Rudra Jain",
        email: withAlias(email, "s24me01"),
        rollNo: "240301",
        programCode: "BTME",
        batchYear: 2024,
        advisorEmployeeId: "ADV006",
    },
    {
        name: "Myra Agnihotri",
        email: withAlias(email, "s24me02"),
        rollNo: "240302",
        programCode: "BTME",
        batchYear: 2024,
        advisorEmployeeId: "ADV007",
    },
    // 2022 Batch - CE
    {
        name: "Harsh Vardhan",
        email: withAlias(email, "s22ce01"),
        rollNo: "220401",
        programCode: "BTCE",
        batchYear: 2022,
        advisorEmployeeId: "ADV008",
    },
    {
        name: "Tanya Kulkarni",
        email: withAlias(email, "s22ce02"),
        rollNo: "220402",
        programCode: "BTCE",
        batchYear: 2022,
        advisorEmployeeId: "ADV008",
    },
    // 2023 Batch - ECE
    {
        name: "Atharv Khatri",
        email: withAlias(email, "s23ec01"),
        rollNo: "230501",
        programCode: "BTEC",
        batchYear: 2023,
        advisorEmployeeId: "ADV009",
    },
    {
        name: "Zara Hussain",
        email: withAlias(email, "s23ec02"),
        rollNo: "230502",
        programCode: "BTEC",
        batchYear: 2023,
        advisorEmployeeId: "ADV009",
    },
    // 2023 Batch - CHE
    {
        name: "Advait Venkatesh",
        email: withAlias(email, "s23ch01"),
        rollNo: "230601",
        programCode: "BTCH",
        batchYear: 2023,
        advisorEmployeeId: "ADV010",
    },
    {
        name: "Ira Mahajan",
        email: withAlias(email, "s23ch02"),
        rollNo: "230602",
        programCode: "BTCH",
        batchYear: 2023,
        advisorEmployeeId: "ADV010",
    },
];

// ============================================================================
// COURSES - Realistic engineering curriculum
// ============================================================================
export const courses = [
    // First Year Common Courses
    {
        code: "ESC101",
        title: "Fundamentals of Computing",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 3,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Introduction to computing concepts and programming fundamentals. Students learn problem-solving using Python/C, covering variables, control flow, functions, arrays, and basic file handling.",
            [
                "Understand computational thinking and algorithmic problem solving",
                "Learn Python/C syntax and programming constructs",
                "Develop skills in debugging and testing programs",
            ],
            [
                "Write programs to solve mathematical and engineering problems",
                "Implement algorithms using appropriate data structures",
                "Design modular programs with proper documentation",
            ]
        ),
    },
    {
        code: "MTH101",
        title: "Mathematics I",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 4,
        deptCode: "MTH",
        description: createCourseDescription(
            "Single and multivariable calculus covering limits, continuity, differentiation, integration, sequences, series, and their applications to engineering problems.",
            [
                "Master techniques of differentiation and integration",
                "Understand convergence of sequences and series",
                "Apply calculus to optimization and rate problems",
            ],
            [
                "Solve complex integration problems using various techniques",
                "Analyze functions using Taylor and Maclaurin series",
                "Apply calculus concepts to engineering applications",
            ]
        ),
    },
    {
        code: "MTH102",
        title: "Mathematics II",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 4,
        deptCode: "MTH",
        description: createCourseDescription(
            "Linear algebra and ordinary differential equations. Topics include vector spaces, matrices, eigenvalues, first and second order ODEs, Laplace transforms, and applications.",
            [
                "Understand vector spaces and linear transformations",
                "Solve systems of linear equations using matrix methods",
                "Apply ODE techniques to model physical systems",
            ],
            [
                "Compute eigenvalues and eigenvectors for system analysis",
                "Solve initial value problems using analytical methods",
                "Model engineering systems using differential equations",
            ]
        ),
    },
    {
        code: "PHY101",
        title: "Physics I",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "PHY",
        description: createCourseDescription(
            "Classical mechanics, oscillations, waves, and thermodynamics. Emphasis on problem-solving and physical intuition development.",
            [
                "Understand Newton's laws and their applications",
                "Analyze oscillatory and wave phenomena",
                "Apply thermodynamic principles to physical systems",
            ],
            [
                "Solve mechanics problems using energy and momentum methods",
                "Analyze wave propagation and interference patterns",
                "Calculate thermodynamic quantities for ideal systems",
            ]
        ),
    },
    {
        code: "PHY102",
        title: "Physics II",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "PHY",
        description: createCourseDescription(
            "Electromagnetism, optics, and introduction to modern physics. Covers Maxwell's equations, electromagnetic waves, interference, diffraction, and quantum concepts.",
            [
                "Understand electromagnetic theory and Maxwell's equations",
                "Analyze optical phenomena using wave theory",
                "Introduction to quantum mechanics and atomic physics",
            ],
            [
                "Solve boundary value problems in electrostatics",
                "Design and analyze optical systems",
                "Apply quantum concepts to atomic and molecular systems",
            ]
        ),
    },

    // CSE Core Courses
    {
        code: "CS201",
        title: "Data Structures",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Fundamental data structures and their implementations. Covers arrays, linked lists, stacks, queues, trees, heaps, graphs, and hash tables with complexity analysis.",
            [
                "Understand abstract data types and their implementations",
                "Analyze time and space complexity of algorithms",
                "Choose appropriate data structures for given problems",
            ],
            [
                "Implement and manipulate complex data structures",
                "Design efficient algorithms using proper data organization",
                "Apply data structures to solve real-world problems",
            ]
        ),
    },
    {
        code: "CS220",
        title: "Introduction to Algorithms",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "CSE",
        description: createCourseDescription(
            "Design and analysis of algorithms. Covers sorting, searching, divide-and-conquer, dynamic programming, greedy algorithms, graph algorithms, and NP-completeness.",
            [
                "Master algorithm design paradigms",
                "Prove correctness and analyze complexity of algorithms",
                "Understand computational complexity theory",
            ],
            [
                "Design efficient algorithms for optimization problems",
                "Analyze algorithms using amortized and probabilistic methods",
                "Recognize and handle NP-hard problems",
            ]
        ),
    },
    {
        code: "CS330",
        title: "Operating Systems",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Principles of operating system design and implementation. Covers processes, threads, scheduling, synchronization, memory management, file systems, and virtualization.",
            [
                "Understand OS abstractions for hardware resources",
                "Analyze concurrency and synchronization mechanisms",
                "Implement system-level programs using OS interfaces",
            ],
            [
                "Design and implement process schedulers",
                "Develop concurrent programs avoiding race conditions",
                "Understand virtual memory and file system internals",
            ]
        ),
    },
    {
        code: "CS340",
        title: "Theory of Computation",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "CSE",
        description: createCourseDescription(
            "Formal languages, automata theory, and computability. Covers finite automata, regular expressions, context-free grammars, pushdown automata, Turing machines, and undecidability.",
            [
                "Understand computational models and their capabilities",
                "Prove properties of languages using mathematical techniques",
                "Recognize decidable and undecidable problems",
            ],
            [
                "Design automata and grammars for language recognition",
                "Apply pumping lemmas to prove non-regularity",
                "Reduce problems to prove undecidability",
            ]
        ),
    },
    {
        code: "CS345",
        title: "Database Management Systems",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Database design, implementation, and querying. Covers relational model, SQL, normalization, query processing, transaction management, and modern database systems.",
            [
                "Design normalized relational database schemas",
                "Write complex SQL queries for data manipulation",
                "Understand transaction processing and recovery",
            ],
            [
                "Model real-world data using ER diagrams and relations",
                "Optimize database queries for performance",
                "Implement database applications with proper ACID properties",
            ]
        ),
    },
    {
        code: "CS355",
        title: "Computer Networks",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Computer networking principles and protocols. Covers layered architectures, TCP/IP stack, routing, transport protocols, application layer protocols, and network security.",
            [
                "Understand network layering and protocol design",
                "Analyze routing algorithms and congestion control",
                "Implement network applications using socket programming",
            ],
            [
                "Configure and troubleshoot network infrastructure",
                "Design protocols for reliable data transfer",
                "Analyze network performance and security threats",
            ]
        ),
    },
    {
        code: "CS425",
        title: "Computer Architecture",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "CSE",
        description: createCourseDescription(
            "Computer organization and architecture. Covers instruction set design, pipelining, memory hierarchy, I/O systems, and parallel architectures.",
            [
                "Understand CPU design and instruction execution",
                "Analyze performance of pipelined processors",
                "Design cache and memory hierarchy systems",
            ],
            [
                "Evaluate architectural tradeoffs in processor design",
                "Optimize programs for modern architectures",
                "Understand parallel and multicore systems",
            ]
        ),
    },
    {
        code: "CS771",
        title: "Machine Learning",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Introduction to machine learning algorithms and applications. Covers supervised learning, unsupervised learning, neural networks, and practical ML system design.",
            [
                "Understand mathematical foundations of ML algorithms",
                "Implement and evaluate ML models on real datasets",
                "Apply appropriate techniques for different problem types",
            ],
            [
                "Build end-to-end ML pipelines for classification and regression",
                "Design and train neural networks using modern frameworks",
                "Evaluate model performance and handle overfitting",
            ]
        ),
    },

    // EE Core Courses
    {
        code: "EE210",
        title: "Introduction to Electrical Engineering",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "EE",
        description: createCourseDescription(
            "Fundamentals of electrical circuits and systems. Covers circuit analysis, DC and AC circuits, operational amplifiers, and introduction to semiconductor devices.",
            [
                "Apply circuit analysis techniques using KVL and KCL",
                "Analyze AC circuits using phasor methods",
                "Understand basic semiconductor device operation",
            ],
            [
                "Design and analyze resistive and reactive circuits",
                "Use operational amplifiers in signal conditioning",
                "Build and test basic electronic circuits",
            ]
        ),
    },
    {
        code: "EE250",
        title: "Signals and Systems",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "EE",
        description: createCourseDescription(
            "Mathematical representation of signals and systems. Covers convolution, Fourier analysis, Laplace transforms, Z-transforms, and sampling theory.",
            [
                "Represent and analyze continuous and discrete signals",
                "Apply transform techniques to system analysis",
                "Understand sampling and reconstruction of signals",
            ],
            [
                "Analyze LTI systems using convolution and transforms",
                "Design filters for signal processing applications",
                "Implement signal processing algorithms in software",
            ]
        ),
    },
    {
        code: "EE320",
        title: "Digital Electronics",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "EE",
        description: createCourseDescription(
            "Digital logic design and implementation. Covers Boolean algebra, combinational circuits, sequential circuits, state machines, and introduction to HDL.",
            [
                "Design combinational and sequential logic circuits",
                "Implement finite state machines",
                "Use HDL for digital circuit description",
            ],
            [
                "Minimize logic functions and implement using gates",
                "Design counters, registers, and memory systems",
                "Simulate and synthesize digital circuits using Verilog",
            ]
        ),
    },
    {
        code: "EE370",
        title: "Control Systems",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "EE",
        description: createCourseDescription(
            "Analysis and design of feedback control systems. Covers system modeling, stability analysis, root locus, frequency response methods, and PID controller design.",
            [
                "Model physical systems using transfer functions",
                "Analyze system stability using various criteria",
                "Design controllers to meet performance specifications",
            ],
            [
                "Apply root locus and Bode plot techniques",
                "Design and tune PID controllers",
                "Implement control systems in simulation and hardware",
            ]
        ),
    },
    {
        code: "EE380",
        title: "Power Electronics",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "EE",
        description: createCourseDescription(
            "Power semiconductor devices and converter circuits. Covers rectifiers, DC-DC converters, inverters, and applications in motor drives and power systems.",
            [
                "Understand power semiconductor device characteristics",
                "Analyze and design AC-DC and DC-DC converters",
                "Apply power electronics to motor control",
            ],
            [
                "Design switching converters for power supplies",
                "Implement PWM techniques for voltage control",
                "Select components for power electronic circuits",
            ]
        ),
    },

    // ME Core Courses
    {
        code: "ME201",
        title: "Thermodynamics",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "ME",
        description: createCourseDescription(
            "Classical thermodynamics and its applications. Covers first and second laws, entropy, thermodynamic cycles, and properties of pure substances.",
            [
                "Apply first and second laws to closed and open systems",
                "Analyze power cycles and refrigeration cycles",
                "Use property tables and equations of state",
            ],
            [
                "Calculate efficiency of thermodynamic devices",
                "Design thermal systems for engineering applications",
                "Evaluate exergy and irreversibility in processes",
            ]
        ),
    },
    {
        code: "ME231",
        title: "Fluid Mechanics",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "ME",
        description: createCourseDescription(
            "Fundamentals of fluid statics and dynamics. Covers fluid properties, conservation laws, boundary layers, pipe flow, and introduction to compressible flow.",
            [
                "Apply conservation principles to fluid flow problems",
                "Analyze internal and external flow phenomena",
                "Understand boundary layer theory and drag",
            ],
            [
                "Design piping systems and calculate losses",
                "Measure flow quantities using experimental techniques",
                "Apply dimensional analysis to fluid problems",
            ]
        ),
    },
    {
        code: "ME251",
        title: "Solid Mechanics",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "ME",
        description: createCourseDescription(
            "Mechanics of deformable bodies. Covers stress, strain, beam bending, torsion, column buckling, and introduction to energy methods.",
            [
                "Analyze stress and strain in structural elements",
                "Apply beam theory for bending and deflection",
                "Evaluate failure criteria for design",
            ],
            [
                "Design structural members for given loading conditions",
                "Calculate deflections using energy methods",
                "Analyze statically indeterminate structures",
            ]
        ),
    },
    {
        code: "ME311",
        title: "Heat Transfer",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "ME",
        description: createCourseDescription(
            "Fundamentals of heat and mass transfer. Covers conduction, convection, radiation, heat exchangers, and introduction to mass transfer.",
            [
                "Analyze steady and unsteady conduction problems",
                "Apply convection correlations to heat transfer",
                "Design heat exchangers for thermal systems",
            ],
            [
                "Solve fin and extended surface problems",
                "Calculate radiation exchange between surfaces",
                "Design cooling systems for electronic equipment",
            ]
        ),
    },
    {
        code: "ME321",
        title: "Manufacturing Processes",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 3,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "ME",
        description: createCourseDescription(
            "Overview of manufacturing methods and processes. Covers casting, forming, machining, joining, and additive manufacturing.",
            [
                "Understand fundamentals of material processing",
                "Select appropriate manufacturing processes",
                "Analyze process parameters for quality control",
            ],
            [
                "Design products considering manufacturability",
                "Operate basic machine tools and fabrication equipment",
                "Apply quality control methods in manufacturing",
            ]
        ),
    },

    // CE Courses
    {
        code: "CE201",
        title: "Structural Analysis",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "CE",
        description: createCourseDescription(
            "Analysis of determinate and indeterminate structures. Covers influence lines, energy methods, matrix methods, and introduction to structural dynamics.",
            [
                "Analyze statically determinate structures",
                "Apply energy methods to structural analysis",
                "Use matrix methods for frame analysis",
            ],
            [
                "Calculate member forces in trusses and frames",
                "Draw influence lines for moving loads",
                "Analyze structures using computer programs",
            ]
        ),
    },
    {
        code: "CE231",
        title: "Geotechnical Engineering",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 3,
        credits: 4,
        deptCode: "CE",
        description: createCourseDescription(
            "Soil mechanics and foundation engineering. Covers soil properties, stress distribution, consolidation, shear strength, and shallow foundations.",
            [
                "Classify soils and determine engineering properties",
                "Analyze stress distribution in soil masses",
                "Design shallow foundations for buildings",
            ],
            [
                "Perform laboratory tests on soil samples",
                "Calculate settlements and bearing capacity",
                "Evaluate slope stability for earthworks",
            ]
        ),
    },

    // Elective Courses
    {
        code: "CS671",
        title: "Deep Learning",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Advanced deep learning techniques and architectures. Covers CNNs, RNNs, transformers, GANs, and applications in vision and NLP.",
            [
                "Understand deep neural network architectures",
                "Implement models using PyTorch/TensorFlow",
                "Apply transfer learning and fine-tuning techniques",
            ],
            [
                "Design CNN architectures for computer vision",
                "Build sequence models for NLP applications",
                "Train and evaluate large-scale deep learning models",
            ]
        ),
    },
    {
        code: "CS682",
        title: "Cryptography",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 3,
        deptCode: "CSE",
        description: createCourseDescription(
            "Mathematical foundations of cryptography. Covers symmetric encryption, public-key cryptography, digital signatures, hash functions, and protocols.",
            [
                "Understand mathematical foundations of crypto primitives",
                "Analyze security of cryptographic protocols",
                "Apply cryptography to secure systems design",
            ],
            [
                "Implement symmetric and asymmetric encryption",
                "Design secure protocols using standard primitives",
                "Evaluate security of cryptographic implementations",
            ]
        ),
    },
];

// ============================================================================
// PREREQUISITES - Course dependencies
// ============================================================================
export const prerequisites = [
    // CSE Prerequisites
    { courseCode: "CS201", prerequisiteCode: "ESC101" },
    { courseCode: "CS220", prerequisiteCode: "CS201" },
    { courseCode: "CS330", prerequisiteCode: "CS201" },
    { courseCode: "CS340", prerequisiteCode: "CS201" },
    { courseCode: "CS345", prerequisiteCode: "CS201" },
    { courseCode: "CS355", prerequisiteCode: "CS201" },
    { courseCode: "CS425", prerequisiteCode: "CS201" },
    { courseCode: "CS771", prerequisiteCode: "CS220" },
    { courseCode: "CS771", prerequisiteCode: "MTH102" },
    { courseCode: "CS671", prerequisiteCode: "CS771" },
    { courseCode: "CS682", prerequisiteCode: "MTH102" },
    // EE Prerequisites
    { courseCode: "EE250", prerequisiteCode: "MTH102" },
    { courseCode: "EE320", prerequisiteCode: "EE210" },
    { courseCode: "EE370", prerequisiteCode: "EE250" },
    { courseCode: "EE380", prerequisiteCode: "EE210" },
    // ME Prerequisites
    { courseCode: "ME231", prerequisiteCode: "MTH101" },
    { courseCode: "ME251", prerequisiteCode: "PHY101" },
    { courseCode: "ME311", prerequisiteCode: "ME201" },
    { courseCode: "ME321", prerequisiteCode: "ME251" },
    // CE Prerequisites
    { courseCode: "CE201", prerequisiteCode: "ME251" },
    { courseCode: "CE231", prerequisiteCode: "PHY101" },
];

// ============================================================================
// SEMESTERS - Academic calendar (with historical completed semesters)
// ============================================================================
export const semesters = [
    // Historical semesters for student records (COMPLETED)
    {
        year: 2021,
        semester: "ODD" as const,
        startDate: new Date("2021-07-26"),
        enrollmentDeadline: new Date("2021-08-09"),
        feedbackFormStartDate: new Date("2021-11-01"),
        endDate: new Date("2021-11-30"),
        status: "COMPLETED" as const,
    },
    {
        year: 2022,
        semester: "EVEN" as const,
        startDate: new Date("2022-01-10"),
        enrollmentDeadline: new Date("2022-01-24"),
        feedbackFormStartDate: new Date("2022-04-15"),
        endDate: new Date("2022-05-15"),
        status: "COMPLETED" as const,
    },
    {
        year: 2022,
        semester: "ODD" as const,
        startDate: new Date("2022-07-25"),
        enrollmentDeadline: new Date("2022-08-08"),
        feedbackFormStartDate: new Date("2022-11-01"),
        endDate: new Date("2022-11-30"),
        status: "COMPLETED" as const,
    },
    {
        year: 2023,
        semester: "EVEN" as const,
        startDate: new Date("2023-01-09"),
        enrollmentDeadline: new Date("2023-01-23"),
        feedbackFormStartDate: new Date("2023-04-15"),
        endDate: new Date("2023-05-14"),
        status: "COMPLETED" as const,
    },
    {
        year: 2023,
        semester: "ODD" as const,
        startDate: new Date("2023-07-24"),
        enrollmentDeadline: new Date("2023-08-07"),
        feedbackFormStartDate: new Date("2023-11-01"),
        endDate: new Date("2023-11-30"),
        status: "COMPLETED" as const,
    },
    {
        year: 2024,
        semester: "EVEN" as const,
        startDate: new Date("2024-01-08"),
        enrollmentDeadline: new Date("2024-01-22"),
        feedbackFormStartDate: new Date("2024-04-15"),
        endDate: new Date("2024-05-12"),
        status: "COMPLETED" as const,
    },
    {
        year: 2024,
        semester: "ODD" as const,
        startDate: new Date("2024-07-22"),
        enrollmentDeadline: new Date("2024-08-05"),
        feedbackFormStartDate: new Date("2024-11-01"),
        endDate: new Date("2024-11-30"),
        status: "COMPLETED" as const,
    },
    {
        year: 2025,
        semester: "EVEN" as const,
        startDate: new Date("2025-01-06"),
        enrollmentDeadline: new Date("2025-01-20"),
        feedbackFormStartDate: new Date("2025-04-15"),
        endDate: new Date("2025-05-10"),
        status: "ONGOING" as const,
    },
    {
        year: 2025,
        semester: "ODD" as const,
        startDate: new Date("2025-07-28"),
        enrollmentDeadline: new Date("2025-08-11"),
        feedbackFormStartDate: new Date("2025-11-03"),
        endDate: new Date("2025-11-28"),
        status: "UPCOMING" as const,
    },
];

// ============================================================================
// CLASSROOMS - Lecture halls, labs, tutorial rooms
// ============================================================================
export const classrooms = [
    // Lecture Halls (L-prefix)
    { room: "L1", capacity: 250, type: "LECTURE" as const },
    { room: "L2", capacity: 250, type: "LECTURE" as const },
    { room: "L3", capacity: 150, type: "LECTURE" as const },
    { room: "L4", capacity: 150, type: "LECTURE" as const },
    { room: "L7", capacity: 120, type: "LECTURE" as const },
    { room: "L8", capacity: 120, type: "LECTURE" as const },
    // Tutorial Rooms (T-prefix)
    { room: "T101", capacity: 40, type: "TUTORIAL" as const },
    { room: "T102", capacity: 40, type: "TUTORIAL" as const },
    { room: "T103", capacity: 35, type: "TUTORIAL" as const },
    { room: "T104", capacity: 35, type: "TUTORIAL" as const },
    // Computer Labs
    { room: "CC-LAB1", capacity: 60, type: "LAB" as const },
    { room: "CC-LAB2", capacity: 60, type: "LAB" as const },
    { room: "CSE-LAB", capacity: 40, type: "LAB" as const },
    // EE Labs
    { room: "EE-LAB1", capacity: 30, type: "LAB" as const },
    { room: "EE-LAB2", capacity: 30, type: "LAB" as const },
    // ME Labs
    { room: "ME-WSHOP", capacity: 25, type: "LAB" as const },
    { room: "ME-THERM", capacity: 25, type: "LAB" as const },
    // Seminar Halls
    { room: "SH1", capacity: 100, type: "SEMINAR" as const },
    { room: "SH2", capacity: 80, type: "SEMINAR" as const },
];

// ============================================================================
// TIME SLOTS - Weekly schedule slots
// ============================================================================
export const timeSlots = [
    // Monday Theory
    {
        dayOfWeek: "MONDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-1" as const,
    },
    {
        dayOfWeek: "MONDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-2" as const,
    },
    {
        dayOfWeek: "MONDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-3" as const,
    },
    {
        dayOfWeek: "MONDAY" as const,
        sessionType: "LAB" as const,
        labPeriod: "LAB-3H-1" as const,
    },
    // Tuesday
    {
        dayOfWeek: "TUESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-1" as const,
    },
    {
        dayOfWeek: "TUESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-2" as const,
    },
    {
        dayOfWeek: "TUESDAY" as const,
        sessionType: "TUTORIAL" as const,
        tutorialPeriod: "T-PC-1" as const,
    },
    {
        dayOfWeek: "TUESDAY" as const,
        sessionType: "TUTORIAL" as const,
        tutorialPeriod: "T-PC-2" as const,
    },
    // Wednesday
    {
        dayOfWeek: "WEDNESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-1" as const,
    },
    {
        dayOfWeek: "WEDNESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-2" as const,
    },
    {
        dayOfWeek: "WEDNESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-3" as const,
    },
    {
        dayOfWeek: "WEDNESDAY" as const,
        sessionType: "LAB" as const,
        labPeriod: "LAB-2H-1" as const,
    },
    // Thursday
    {
        dayOfWeek: "THURSDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-1" as const,
    },
    {
        dayOfWeek: "THURSDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-2" as const,
    },
    {
        dayOfWeek: "THURSDAY" as const,
        sessionType: "TUTORIAL" as const,
        tutorialPeriod: "T-PC-1" as const,
    },
    {
        dayOfWeek: "THURSDAY" as const,
        sessionType: "LAB" as const,
        labPeriod: "LAB-3H-2" as const,
    },
    // Friday
    {
        dayOfWeek: "FRIDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-1" as const,
    },
    {
        dayOfWeek: "FRIDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-2" as const,
    },
    {
        dayOfWeek: "FRIDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-3" as const,
    },
    {
        dayOfWeek: "FRIDAY" as const,
        sessionType: "TUTORIAL" as const,
        tutorialPeriod: "T-PC-2" as const,
    },
];

// ============================================================================
// FEEDBACK QUESTIONS - Course evaluation survey
// ============================================================================
export const feedbackQuestions = [
    {
        questionText:
            "The course content was well-organized and followed a logical sequence",
        questionType: "RATING" as const,
        isRequired: true,
        order: 1,
    },
    {
        questionText:
            "The instructor explained concepts clearly and effectively",
        questionType: "RATING" as const,
        isRequired: true,
        order: 2,
    },
    {
        questionText: "The instructor was well-prepared for lectures",
        questionType: "RATING" as const,
        isRequired: true,
        order: 3,
    },
    {
        questionText:
            "The course materials (slides, notes, textbook) were helpful for learning",
        questionType: "RATING" as const,
        isRequired: true,
        order: 4,
    },
    {
        questionText:
            "The assignments and projects helped reinforce the course concepts",
        questionType: "RATING" as const,
        isRequired: true,
        order: 5,
    },
    {
        questionText: "The pace of the course was appropriate",
        questionType: "RATING" as const,
        isRequired: true,
        order: 6,
    },
    {
        questionText:
            "The instructor was approachable and responsive to questions",
        questionType: "RATING" as const,
        isRequired: true,
        order: 7,
    },
    {
        questionText:
            "The examinations were fair and reflected the course content",
        questionType: "RATING" as const,
        isRequired: true,
        order: 8,
    },
    {
        questionText: "Would you recommend this course to other students?",
        questionType: "YES_NO" as const,
        isRequired: true,
        order: 9,
    },
    {
        questionText: "What aspects of the course did you find most valuable?",
        questionType: "DESCRIPTIVE" as const,
        isRequired: false,
        order: 10,
    },
    {
        questionText: "What suggestions do you have for improving this course?",
        questionType: "DESCRIPTIVE" as const,
        isRequired: false,
        order: 11,
    },
    {
        questionText: "Any additional comments about the course or instructor?",
        questionType: "DESCRIPTIVE" as const,
        isRequired: false,
        order: 12,
    },
];

// ============================================================================
// HISTORICAL COURSE OFFERINGS - For student records (COMPLETED semesters)
// Maps: semesterKey -> array of offerings
// ============================================================================
export const historicalCourseOfferings: Record<
    string,
    Array<{
        courseCode: string;
        instructorEmployeeIds: string[];
        headEmployeeId: string;
        batchYears: number[];
        programCodes: string[];
    }>
> = {
    // 2021 ODD - First semester for 2021 batch
    "2021-ODD": [
        {
            courseCode: "ESC101",
            instructorEmployeeIds: ["INS001", "INS004"],
            headEmployeeId: "INS001",
            batchYears: [2021],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
        {
            courseCode: "MTH101",
            instructorEmployeeIds: ["INS013"],
            headEmployeeId: "INS013",
            batchYears: [2021],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
        {
            courseCode: "PHY101",
            instructorEmployeeIds: ["INS015"],
            headEmployeeId: "INS015",
            batchYears: [2021],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
    ],
    // 2022 EVEN - Second semester for 2021 batch
    "2022-EVEN": [
        {
            courseCode: "MTH102",
            instructorEmployeeIds: ["INS013", "INS014"],
            headEmployeeId: "INS013",
            batchYears: [2021],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
        {
            courseCode: "PHY102",
            instructorEmployeeIds: ["INS015"],
            headEmployeeId: "INS015",
            batchYears: [2021],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
    ],
    // 2022 ODD - Third semester for 2021 batch, First for 2022 batch
    "2022-ODD": [
        // 2021 batch courses
        {
            courseCode: "CS201",
            instructorEmployeeIds: ["INS002"],
            headEmployeeId: "INS002",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE210",
            instructorEmployeeIds: ["INS006"],
            headEmployeeId: "INS006",
            batchYears: [2021],
            programCodes: ["BTEE"],
        },
        {
            courseCode: "ME201",
            instructorEmployeeIds: ["INS009"],
            headEmployeeId: "INS009",
            batchYears: [2021],
            programCodes: ["BTME"],
        },
        // 2022 batch first year courses
        {
            courseCode: "ESC101",
            instructorEmployeeIds: ["INS001", "INS005"],
            headEmployeeId: "INS001",
            batchYears: [2022],
            programCodes: ["BTCS", "BTEE", "BTME", "BTCE"],
        },
        {
            courseCode: "MTH101",
            instructorEmployeeIds: ["INS013"],
            headEmployeeId: "INS013",
            batchYears: [2022],
            programCodes: ["BTCS", "BTEE", "BTME", "BTCE"],
        },
        {
            courseCode: "PHY101",
            instructorEmployeeIds: ["INS015"],
            headEmployeeId: "INS015",
            batchYears: [2022],
            programCodes: ["BTCS", "BTEE", "BTME", "BTCE"],
        },
    ],
    // 2023 EVEN
    "2023-EVEN": [
        // 2021 batch 4th semester
        {
            courseCode: "CS220",
            instructorEmployeeIds: ["INS001"],
            headEmployeeId: "INS001",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE250",
            instructorEmployeeIds: ["INS007"],
            headEmployeeId: "INS007",
            batchYears: [2021],
            programCodes: ["BTEE"],
        },
        {
            courseCode: "ME231",
            instructorEmployeeIds: ["INS010"],
            headEmployeeId: "INS010",
            batchYears: [2021],
            programCodes: ["BTME"],
        },
        // 2022 batch 2nd semester
        {
            courseCode: "MTH102",
            instructorEmployeeIds: ["INS013"],
            headEmployeeId: "INS013",
            batchYears: [2022],
            programCodes: ["BTCS", "BTEE", "BTME", "BTCE"],
        },
        {
            courseCode: "PHY102",
            instructorEmployeeIds: ["INS015"],
            headEmployeeId: "INS015",
            batchYears: [2022],
            programCodes: ["BTCS", "BTEE", "BTME", "BTCE"],
        },
    ],
    // 2023 ODD
    "2023-ODD": [
        // 2021 batch 5th semester
        {
            courseCode: "CS330",
            instructorEmployeeIds: ["INS003"],
            headEmployeeId: "INS003",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "CS345",
            instructorEmployeeIds: ["INS004"],
            headEmployeeId: "INS004",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE320",
            instructorEmployeeIds: ["INS008"],
            headEmployeeId: "INS008",
            batchYears: [2021],
            programCodes: ["BTEE"],
        },
        {
            courseCode: "ME311",
            instructorEmployeeIds: ["INS009"],
            headEmployeeId: "INS009",
            batchYears: [2021],
            programCodes: ["BTME"],
        },
        // 2022 batch 3rd semester
        {
            courseCode: "CS201",
            instructorEmployeeIds: ["INS002", "INS005"],
            headEmployeeId: "INS002",
            batchYears: [2022],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE210",
            instructorEmployeeIds: ["INS006"],
            headEmployeeId: "INS006",
            batchYears: [2022],
            programCodes: ["BTEE", "BTEC"],
        },
        {
            courseCode: "ME201",
            instructorEmployeeIds: ["INS009"],
            headEmployeeId: "INS009",
            batchYears: [2022],
            programCodes: ["BTME", "BTCH"],
        },
        {
            courseCode: "ME251",
            instructorEmployeeIds: ["INS010"],
            headEmployeeId: "INS010",
            batchYears: [2022],
            programCodes: ["BTCE"],
        },
        // 2023 batch first year courses
        {
            courseCode: "ESC101",
            instructorEmployeeIds: ["INS001", "INS004"],
            headEmployeeId: "INS001",
            batchYears: [2023],
            programCodes: ["BTCS", "BTEE", "BTME", "BTEC", "BTCH"],
        },
        {
            courseCode: "MTH101",
            instructorEmployeeIds: ["INS013", "INS014"],
            headEmployeeId: "INS013",
            batchYears: [2023],
            programCodes: ["BTCS", "BTEE", "BTME", "BTEC", "BTCH"],
        },
        {
            courseCode: "PHY101",
            instructorEmployeeIds: ["INS015"],
            headEmployeeId: "INS015",
            batchYears: [2023],
            programCodes: ["BTCS", "BTEE", "BTME", "BTEC", "BTCH"],
        },
    ],
    // 2024 EVEN
    "2024-EVEN": [
        // 2021 batch 6th semester
        {
            courseCode: "CS355",
            instructorEmployeeIds: ["INS005"],
            headEmployeeId: "INS005",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "CS340",
            instructorEmployeeIds: ["INS002"],
            headEmployeeId: "INS002",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE370",
            instructorEmployeeIds: ["INS006", "INS007"],
            headEmployeeId: "INS006",
            batchYears: [2021],
            programCodes: ["BTEE"],
        },
        {
            courseCode: "ME321",
            instructorEmployeeIds: ["INS010"],
            headEmployeeId: "INS010",
            batchYears: [2021],
            programCodes: ["BTME"],
        },
        // 2022 batch 4th semester
        {
            courseCode: "CS220",
            instructorEmployeeIds: ["INS001"],
            headEmployeeId: "INS001",
            batchYears: [2022],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE250",
            instructorEmployeeIds: ["INS007"],
            headEmployeeId: "INS007",
            batchYears: [2022],
            programCodes: ["BTEE"],
        },
        {
            courseCode: "ME231",
            instructorEmployeeIds: ["INS010"],
            headEmployeeId: "INS010",
            batchYears: [2022],
            programCodes: ["BTME"],
        },
        {
            courseCode: "CE201",
            instructorEmployeeIds: ["INS011"],
            headEmployeeId: "INS011",
            batchYears: [2022],
            programCodes: ["BTCE"],
        },
        // 2023 batch 2nd semester
        {
            courseCode: "MTH102",
            instructorEmployeeIds: ["INS013"],
            headEmployeeId: "INS013",
            batchYears: [2023],
            programCodes: ["BTCS", "BTEE", "BTME", "BTEC", "BTCH"],
        },
        {
            courseCode: "PHY102",
            instructorEmployeeIds: ["INS015"],
            headEmployeeId: "INS015",
            batchYears: [2023],
            programCodes: ["BTCS", "BTEE", "BTME", "BTEC", "BTCH"],
        },
    ],
    // 2024 ODD
    "2024-ODD": [
        // 2021 batch 7th semester (electives)
        {
            courseCode: "CS771",
            instructorEmployeeIds: ["INS003", "INS004"],
            headEmployeeId: "INS003",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "CS425",
            instructorEmployeeIds: ["INS001"],
            headEmployeeId: "INS001",
            batchYears: [2021],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE380",
            instructorEmployeeIds: ["INS008"],
            headEmployeeId: "INS008",
            batchYears: [2021],
            programCodes: ["BTEE"],
        },
        // 2022 batch 5th semester
        {
            courseCode: "CS330",
            instructorEmployeeIds: ["INS003"],
            headEmployeeId: "INS003",
            batchYears: [2022],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "CS345",
            instructorEmployeeIds: ["INS004"],
            headEmployeeId: "INS004",
            batchYears: [2022],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE320",
            instructorEmployeeIds: ["INS008"],
            headEmployeeId: "INS008",
            batchYears: [2022],
            programCodes: ["BTEE"],
        },
        {
            courseCode: "ME311",
            instructorEmployeeIds: ["INS009"],
            headEmployeeId: "INS009",
            batchYears: [2022],
            programCodes: ["BTME"],
        },
        {
            courseCode: "CE231",
            instructorEmployeeIds: ["INS011"],
            headEmployeeId: "INS011",
            batchYears: [2022],
            programCodes: ["BTCE"],
        },
        // 2023 batch 3rd semester
        {
            courseCode: "CS201",
            instructorEmployeeIds: ["INS002", "INS005"],
            headEmployeeId: "INS002",
            batchYears: [2023],
            programCodes: ["BTCS"],
        },
        {
            courseCode: "EE210",
            instructorEmployeeIds: ["INS006"],
            headEmployeeId: "INS006",
            batchYears: [2023],
            programCodes: ["BTEE", "BTEC"],
        },
        {
            courseCode: "ME201",
            instructorEmployeeIds: ["INS009"],
            headEmployeeId: "INS009",
            batchYears: [2023],
            programCodes: ["BTME", "BTCH"],
        },
        // 2024 batch first year courses
        {
            courseCode: "ESC101",
            instructorEmployeeIds: ["INS001", "INS004"],
            headEmployeeId: "INS001",
            batchYears: [2024],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
        {
            courseCode: "MTH101",
            instructorEmployeeIds: ["INS013", "INS014"],
            headEmployeeId: "INS013",
            batchYears: [2024],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
        {
            courseCode: "PHY101",
            instructorEmployeeIds: ["INS015"],
            headEmployeeId: "INS015",
            batchYears: [2024],
            programCodes: ["BTCS", "BTEE", "BTME"],
        },
    ],
};

// ============================================================================
// CURRENT SEMESTER COURSE OFFERINGS - 2025 EVEN (ONGOING)
// ============================================================================
export const courseOfferings2025Even = [
    // 2021 batch 8th semester (final year electives/projects)
    {
        courseCode: "CS671",
        instructorEmployeeIds: ["INS003", "INS004"],
        headEmployeeId: "INS003",
        batchYears: [2021, 2022],
        programCodes: ["BTCS"],
    },
    {
        courseCode: "CS682",
        instructorEmployeeIds: ["INS002"],
        headEmployeeId: "INS002",
        batchYears: [2021],
        programCodes: ["BTCS"],
    },
    // 2022 batch 6th semester
    {
        courseCode: "CS355",
        instructorEmployeeIds: ["INS005"],
        headEmployeeId: "INS005",
        batchYears: [2022],
        programCodes: ["BTCS"],
    },
    {
        courseCode: "CS340",
        instructorEmployeeIds: ["INS002"],
        headEmployeeId: "INS002",
        batchYears: [2022],
        programCodes: ["BTCS"],
    },
    {
        courseCode: "EE370",
        instructorEmployeeIds: ["INS006", "INS007"],
        headEmployeeId: "INS006",
        batchYears: [2022],
        programCodes: ["BTEE"],
    },
    {
        courseCode: "ME321",
        instructorEmployeeIds: ["INS010"],
        headEmployeeId: "INS010",
        batchYears: [2022],
        programCodes: ["BTME"],
    },
    // 2023 batch 4th semester
    {
        courseCode: "CS220",
        instructorEmployeeIds: ["INS001"],
        headEmployeeId: "INS001",
        batchYears: [2023],
        programCodes: ["BTCS"],
    },
    {
        courseCode: "EE250",
        instructorEmployeeIds: ["INS007"],
        headEmployeeId: "INS007",
        batchYears: [2023],
        programCodes: ["BTEE", "BTEC"],
    },
    {
        courseCode: "ME231",
        instructorEmployeeIds: ["INS010"],
        headEmployeeId: "INS010",
        batchYears: [2023],
        programCodes: ["BTME", "BTCH"],
    },
    // 2024 batch 2nd semester
    {
        courseCode: "MTH102",
        instructorEmployeeIds: ["INS013"],
        headEmployeeId: "INS013",
        batchYears: [2024],
        programCodes: ["BTCS", "BTEE", "BTME"],
    },
    {
        courseCode: "PHY102",
        instructorEmployeeIds: ["INS015"],
        headEmployeeId: "INS015",
        batchYears: [2024],
        programCodes: ["BTCS", "BTEE", "BTME"],
    },
];

// Keep old export for backward compatibility
export const courseOfferings2025Spring = courseOfferings2025Even;

// ============================================================================
// GRADE DISTRIBUTION HELPER - For realistic grade generation
// ============================================================================
export const gradeDistribution = {
    excellent: ["A", "A", "A", "A-"] as const,
    good: ["A-", "B", "B", "B-"] as const,
    average: ["B", "B-", "C", "C-"] as const,
    poor: ["C-", "D", "D", "F"] as const,
};

// Student performance profiles (affects grade generation in seed script)
export const studentPerformanceProfiles: Record<
    string,
    "excellent" | "good" | "average" | "poor"
> = {
    "210101": "excellent", // Aarav Sharma - top performer
    "210102": "good", // Diya Patel
    "210103": "excellent", // Vivaan Gupta
    "210104": "good", // Ananya Singh
    "210105": "average", // Aditya Reddy
    "210106": "good", // Ishita Joshi
    "220101": "excellent", // Arjun Verma
    "220102": "good", // Kavya Nair
    "220103": "average", // Rohan Iyer
    "220104": "good", // Meera Krishnan
    "220105": "good", // Siddharth Menon
    "220106": "excellent", // Priya Agarwal
    "230101": "good", // Kabir Malhotra
    "230102": "excellent", // Aisha Khan
    "230103": "average", // Vihaan Chopra
    "230104": "good", // Riya Banerjee
    "240101": "good", // Ayaan Chauhan
    "240102": "excellent", // Saanvi Kapoor
    "240103": "average", // Reyansh Deshmukh
    "240104": "good", // Kiara Rao
    // EE students
    "210201": "good",
    "210202": "excellent",
    "210203": "average",
    "210204": "good",
    "220201": "good",
    "220202": "excellent",
    "230201": "good",
    "230202": "average",
    "240201": "good",
    "240202": "excellent",
    // ME students
    "210301": "excellent",
    "210302": "good",
    "220301": "good",
    "220302": "average",
    "230301": "good",
    "230302": "excellent",
    "240301": "average",
    "240302": "good",
    // CE students
    "220401": "good",
    "220402": "excellent",
    // ECE students
    "230501": "good",
    "230502": "excellent",
    // CHE students
    "230601": "average",
    "230602": "good",
};
