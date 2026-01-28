import { createCourseDescription, withAlias } from "./utils";

const email = process.env.SEED_ADMIN_EMAIL;

if (!email) {
    console.error("❌ Missing SEED_ADMIN_EMAIL");
    process.exit(1);
}

export const departments = [
    {
        name: "Computer Science & Engineering",
        code: "CSE",
        website: "https://cse.university.edu",
    },
    {
        name: "Electrical Engineering",
        code: "EE",
        website: "https://ee.university.edu",
    },
    {
        name: "Mechanical Engineering",
        code: "ME",
        website: "https://me.university.edu",
    },
    {
        name: "Civil Engineering",
        code: "CE",
        website: "https://ce.university.edu",
    },
    {
        name: "Electronics & Communication",
        code: "ECE",
        website: "https://ece.university.edu",
    },
];

export const hods = [
    {
        name: "Dr. Rajesh Kumar",
        email: withAlias(email, "h1"),
        phoneNumber: "+919876543210",
        website: "https://rajesh-kumar.edu",
        employeeId: "+h1",
        deptCode: "CSE",
    },
    {
        name: "Dr. Priya Sharma",
        email: withAlias(email, "h2"),
        phoneNumber: "+919876543211",
        website: "https://priya-sharma.edu",
        employeeId: "+h2",
        deptCode: "EE",
    },
    {
        name: "Dr. Amit Patel",
        email: withAlias(email, "h3"),
        phoneNumber: "+919876543212",
        website: "https://amit-patel.edu",
        employeeId: "+h3",
        deptCode: "ME",
    },
    {
        name: "Dr. Sunita Verma",
        email: withAlias(email, "h4"),
        phoneNumber: "+919876543213",
        website: "https://sunita-verma.edu",
        employeeId: "+h4",
        deptCode: "CE",
    },
    {
        name: "Dr. Vikram Singh",
        email: withAlias(email, "h5"),
        phoneNumber: "+919876543214",
        website: "https://vikram-singh.edu",
        employeeId: "+h5",
        deptCode: "ECE",
    },
];

export const programs = [
    {
        name: "Bachelor of Technology in Computer Science",
        code: "BTCS",
        degreeType: "BACHELOR" as const,
        deptCode: "CSE",
    },
    {
        name: "Master of Technology in Computer Science",
        code: "MTCS",
        degreeType: "MASTER" as const,
        deptCode: "CSE",
    },
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
    {
        name: "Bachelor of Technology in Mechanical Engineering",
        code: "BTME",
        degreeType: "BACHELOR" as const,
        deptCode: "ME",
    },
    {
        name: "Doctor of Philosophy in Computer Science",
        code: "PHCS",
        degreeType: "PHD" as const,
        deptCode: "CSE",
    },
];

export const advisors = [
    {
        name: "Dr. Anita Desai",
        email: withAlias(email, "a1"),
        phoneNumber: "+919876543220",
        website: "https://anita-desai.edu",
        employeeId: "+a1",
        deptCode: "CSE",
    },
    {
        name: "Dr. Rahul Mehta",
        email: withAlias(email, "a2"),
        phoneNumber: "+919876543221",
        website: "https://rahul-mehta.edu",
        employeeId: "+a2",
        deptCode: "CSE",
    },
    {
        name: "Dr. Kavita Reddy",
        email: withAlias(email, "a3"),
        phoneNumber: "+919876543222",
        website: "https://kavita-reddy.edu",
        employeeId: "+a3",
        deptCode: "EE",
    },
    {
        name: "Dr. Sanjay Gupta",
        email: withAlias(email, "a4"),
        phoneNumber: "+919876543223",
        website: "https://sanjay-gupta.edu",
        employeeId: "+a4",
        deptCode: "EE",
    },
    {
        name: "Dr. Neha Joshi",
        email: withAlias(email, "a5"),
        phoneNumber: "+919876543224",
        website: "https://neha-joshi.edu",
        employeeId: "+a5",
        deptCode: "ME",
    },
    {
        name: "Dr. Arun Kumar",
        email: withAlias(email, "a6"),
        phoneNumber: "+919876543225",
        website: "https://arun-kumar.edu",
        employeeId: "+a6",
        deptCode: "CE",
    },
    {
        name: "Dr. Pooja Iyer",
        email: withAlias(email, "a7"),
        phoneNumber: "+919876543226",
        website: "https://pooja-iyer.edu",
        employeeId: "+a7",
        deptCode: "ECE",
    },
];

export const instructors = [
    {
        name: "Prof. Deepak Chopra",
        email: withAlias(email, "i1"),
        phoneNumber: "+919876543230",
        website: "https://deepak-chopra.edu",
        employeeId: "+i1",
        deptCode: "CSE",
        designation: "Associate Professor",
    },
    {
        name: "Prof. Meera Nair",
        email: withAlias(email, "i2"),
        phoneNumber: "+919876543231",
        website: "https://meera-nair.edu",
        employeeId: "+i2",
        deptCode: "CSE",
        designation: "Assistant Professor",
    },
    {
        name: "Prof. Kiran Rao",
        email: withAlias(email, "i3"),
        phoneNumber: "+919876543232",
        website: "https://kiran-rao.edu",
        employeeId: "+i3",
        deptCode: "CSE",
        designation: "Professor",
    },
    {
        name: "Prof. Suresh Pillai",
        email: withAlias(email, "i4"),
        phoneNumber: "+919876543233",
        website: "https://suresh-pillai.edu",
        employeeId: "+i4",
        deptCode: "EE",
        designation: "Associate Professor",
    },
    {
        name: "Prof. Lakshmi Menon",
        email: withAlias(email, "i5"),
        phoneNumber: "+919876543234",
        website: "https://lakshmi-menon.edu",
        employeeId: "+i5",
        deptCode: "EE",
        designation: "Assistant Professor",
    },
    {
        name: "Prof. Ravi Shankar",
        email: withAlias(email, "i6"),
        phoneNumber: "+919876543235",
        website: "https://ravi-shankar.edu",
        employeeId: "+i6",
        deptCode: "ME",
        designation: "Professor",
    },
    {
        name: "Prof. Gita Krishnan",
        email: withAlias(email, "i7"),
        phoneNumber: "+919876543236",
        website: "https://gita-krishnan.edu",
        employeeId: "+i7",
        deptCode: "ME",
        designation: "Assistant Professor",
    },
    {
        name: "Prof. Manoj Tiwari",
        email: withAlias(email, "i8"),
        phoneNumber: "+919876543237",
        website: "https://manoj-tiwari.edu",
        employeeId: "+i8",
        deptCode: "CE",
        designation: "Associate Professor",
    },
    {
        name: "Prof. Shweta Agarwal",
        email: withAlias(email, "i9"),
        phoneNumber: "+919876543238",
        website: "https://shweta-agarwal.edu",
        employeeId: "+i9",
        deptCode: "ECE",
        designation: "Professor",
    },
    {
        name: "Prof. Vijay Malhotra",
        email: withAlias(email, "i10"),
        phoneNumber: "+919876543239",
        website: "https://vijay-malhotra.edu",
        employeeId: "+i10",
        deptCode: "ECE",
        designation: "Assistant Professor",
    },
];

export const students = [
    {
        name: "Arjun Patel",
        email: withAlias(email, "s1"),
        rollNo: "2021CSE001",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "+a1",
    },
    {
        name: "Priya Singh",
        email: withAlias(email, "s2"),
        rollNo: "2021CSE002",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "+a1",
    },
    {
        name: "Rohan Kumar",
        email: withAlias(email, "s3"),
        rollNo: "2021CSE003",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "+a2",
    },
    {
        name: "Sneha Sharma",
        email: withAlias(email, "s4"),
        rollNo: "2021CSE004",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "+a2",
    },
    {
        name: "Amit Verma",
        email: withAlias(email, "s5"),
        rollNo: "2022CSE001",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "+a1",
    },
    {
        name: "Neha Reddy",
        email: withAlias(email, "s6"),
        rollNo: "2022CSE002",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "+a2",
    },
    {
        name: "Karan Mehta",
        email: withAlias(email, "s7"),
        rollNo: "2023CSE001",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "+a1",
    },
    {
        name: "Divya Gupta",
        email: withAlias(email, "s8"),
        rollNo: "2023CSE002",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "+a2",
    },
    {
        name: "Rahul Joshi",
        email: withAlias(email, "s9"),
        rollNo: "2021EE001",
        programCode: "BTEE",
        batchYear: 2021,
        advisorEmployeeId: "+a3",
    },
    {
        name: "Kavya Iyer",
        email: withAlias(email, "s10"),
        rollNo: "2021EE002",
        programCode: "BTEE",
        batchYear: 2021,
        advisorEmployeeId: "+a4",
    },
    {
        name: "Siddharth Nair",
        email: withAlias(email, "s11"),
        rollNo: "2022EE001",
        programCode: "BTEE",
        batchYear: 2022,
        advisorEmployeeId: "+a3",
    },
    {
        name: "Anjali Rao",
        email: withAlias(email, "s12"),
        rollNo: "2022EE002",
        programCode: "BTEE",
        batchYear: 2022,
        advisorEmployeeId: "+a4",
    },
    {
        name: "Varun Pillai",
        email: withAlias(email, "s13"),
        rollNo: "2023EE001",
        programCode: "BTEE",
        batchYear: 2023,
        advisorEmployeeId: "+a3",
    },
    {
        name: "Riya Menon",
        email: withAlias(email, "s14"),
        rollNo: "2023EE002",
        programCode: "BTEE",
        batchYear: 2023,
        advisorEmployeeId: "+a4",
    },
    {
        name: "Aditya Kumar",
        email: withAlias(email, "s15"),
        rollNo: "2021ME001",
        programCode: "BTME",
        batchYear: 2021,
        advisorEmployeeId: "+a5",
    },
    {
        name: "Simran Singh",
        email: withAlias(email, "s16"),
        rollNo: "2021ME002",
        programCode: "BTME",
        batchYear: 2021,
        advisorEmployeeId: "+a5",
    },
    {
        name: "Akash Sharma",
        email: withAlias(email, "s17"),
        rollNo: "2022ME001",
        programCode: "BTME",
        batchYear: 2022,
        advisorEmployeeId: "+a5",
    },
    {
        name: "Pooja Patel",
        email: withAlias(email, "s18"),
        rollNo: "2022ME002",
        programCode: "BTME",
        batchYear: 2022,
        advisorEmployeeId: "+a5",
    },
    {
        name: "Nikhil Verma",
        email: withAlias(email, "s19"),
        rollNo: "2023ME001",
        programCode: "BTME",
        batchYear: 2023,
        advisorEmployeeId: "+a5",
    },
    {
        name: "Ishita Reddy",
        email: withAlias(email, "s20"),
        rollNo: "2023ME002",
        programCode: "BTME",
        batchYear: 2023,
        advisorEmployeeId: "+a5",
    },
    {
        name: "Manish Gupta",
        email: withAlias(email, "s21"),
        rollNo: "2022CSE003",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "+a1",
    },
    {
        name: "Shruti Joshi",
        email: withAlias(email, "s22"),
        rollNo: "2022CSE004",
        programCode: "BTCS",
        batchYear: 2022,
        advisorEmployeeId: "+a2",
    },
    {
        name: "Harsh Iyer",
        email: withAlias(email, "s23"),
        rollNo: "2023CSE003",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "+a1",
    },
    {
        name: "Tanvi Nair",
        email: withAlias(email, "s24"),
        rollNo: "2023CSE004",
        programCode: "BTCS",
        batchYear: 2023,
        advisorEmployeeId: "+a2",
    },
    {
        name: "Vishal Rao",
        email: withAlias(email, "s25"),
        rollNo: "2021CSE005",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "+a1",
    },
    {
        name: "Megha Pillai",
        email: withAlias(email, "s26"),
        rollNo: "2021CSE006",
        programCode: "BTCS",
        batchYear: 2021,
        advisorEmployeeId: "+a2",
    },
    {
        name: "Shubham Menon",
        email: withAlias(email, "s27"),
        rollNo: "2022EE003",
        programCode: "BTEE",
        batchYear: 2022,
        advisorEmployeeId: "+a3",
    },
    {
        name: "Ananya Kumar",
        email: withAlias(email, "s28"),
        rollNo: "2022EE004",
        programCode: "BTEE",
        batchYear: 2022,
        advisorEmployeeId: "+a4",
    },
    {
        name: "Yash Singh",
        email: withAlias(email, "s29"),
        rollNo: "2023ME003",
        programCode: "BTME",
        batchYear: 2023,
        advisorEmployeeId: "+a5",
    },
    {
        name: "Kriti Sharma",
        email: withAlias(email, "s30"),
        rollNo: "2023ME004",
        programCode: "BTME",
        batchYear: 2023,
        advisorEmployeeId: "+a5",
    },
];

export const courses = [
    {
        code: "CS101",
        title: "Introduction to Programming",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "This course provides a comprehensive introduction to the fundamental concepts of computer programming. Students will learn to design, implement, and test simple programs using a high-level language, focusing on logic building and syntax mastery.",
            [
                "Understand the basics of algorithmic thinking and problem-solving.",
                "Learn the syntax and semantics of a standard programming language.",
                "Master control structures, loops, and functional programming concepts.",
            ],
            [
                "Write, compile, and debug efficient code for basic computational problems.",
                "Demonstrate an understanding of structured programming principles.",
                "Develop simple applications involving file I/O and data manipulation.",
            ]
        ),
    },
    {
        code: "CS201",
        title: "Data Structures",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "This course explores the organization and management of data to increase the efficiency of algorithms. It covers linear and non-linear data structures, memory management, and complexity analysis.",
            [
                "Understand the abstract data types (ADTs) such as stacks, queues, and lists.",
                "Analyze the time and space complexity of different data structures.",
                "Learn the implementation of trees, graphs, and hash tables.",
            ],
            [
                "Select the appropriate data structure for a given problem scenario.",
                "Implement complex data structures from scratch.",
                "Optimize software performance by managing memory and processing time effectively.",
            ]
        ),
    },
    {
        code: "CS301",
        title: "Algorithms",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 6,
        credits: 3,
        deptCode: "CSE",
        description: createCourseDescription(
            "A deep dive into the design and analysis of algorithms. This course covers divide-and-conquer, dynamic programming, greedy algorithms, and graph algorithms, preparing students for complex computational problem solving.",
            [
                "Master asymptotic notation and algorithm efficiency analysis.",
                "Understand major algorithmic paradigms like Greedy and Dynamic Programming.",
                "Explore advanced graph traversals and shortest-path algorithms.",
            ],
            [
                "Analyze the correctness and performance of algorithms.",
                "Design efficient solutions for NP-hard problems using approximation techniques.",
                "Apply algorithmic strategies to real-world software engineering challenges.",
            ]
        ),
    },
    {
        code: "CS401",
        title: "Database Systems",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 5,
        credits: 3.5,
        deptCode: "CSE",
        description: createCourseDescription(
            "This course introduces the concepts of database design and management. It covers the relational model, SQL, normalization, transaction management, and concurrency control in modern DBMS.",
            [
                "Understand the architecture of Database Management Systems (DBMS).",
                "Master SQL for data definition and manipulation.",
                "Learn the principles of database normalization and schema design.",
            ],
            [
                "Design robust and scalable relational databases.",
                "Execute complex queries to retrieve and analyze data efficiently.",
                "Ensure data integrity and handle concurrent transactions effectively.",
            ]
        ),
    },
    {
        code: "CS501",
        title: "Machine Learning",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "An introduction to the field of Machine Learning, covering supervised and unsupervised learning techniques. Students will explore regression, classification, clustering, and neural networks.",
            [
                "Understand the mathematical foundations of machine learning algorithms.",
                "Differentiate between supervised, unsupervised, and reinforcement learning.",
                "Learn to evaluate model performance using metrics like accuracy and precision.",
            ],
            [
                "Build and train machine learning models using modern libraries.",
                "Apply ML techniques to solve problems in vision, text, and prediction.",
                "Critically analyze the ethical implications of AI and automated decision making.",
            ]
        ),
    },
    {
        code: "EE101",
        title: "Basic Electrical Engineering",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "EE",
        description: createCourseDescription(
            "Foundational course covering the principles of electrical circuits, electromagnetic fields, and electrical machines. It serves as a prerequisite for advanced studies in electrical and electronics engineering.",
            [
                "Understand Kirchhoff's laws and circuit analysis theorems.",
                "Learn the behavior of R, L, and C components in AC/DC circuits.",
                "Explore the working principles of transformers and motors.",
            ],
            [
                "Analyze simple DC and AC electrical circuits.",
                "Measure electrical quantities using standard laboratory equipment.",
                "Demonstrate knowledge of electrical safety and power generation basics.",
            ]
        ),
    },
    {
        code: "EE201",
        title: "Circuit Analysis",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 6,
        credits: 3,
        deptCode: "EE",
        description: createCourseDescription(
            "This course deals with advanced techniques for analyzing complex electrical networks. Topics include transient analysis, two-port networks, and Laplace transform applications in circuit theory.",
            [
                "Master network theorems for solving complex circuit problems.",
                "Understand time-domain and frequency-domain analysis.",
                "Learn to model electrical networks using mathematical tools.",
            ],
            [
                "Solve complex circuit problems involving transient responses.",
                "Apply Laplace transforms to analyze network stability.",
                "Design filters and signal conditioning circuits.",
            ]
        ),
    },
    {
        code: "EE301",
        title: "Digital Electronics",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 5,
        credits: 3.5,
        deptCode: "EE",
        description: createCourseDescription(
            "A comprehensive study of digital logic design. The course covers boolean algebra, combinational and sequential circuits, and an introduction to VHDL/Verilog for hardware description.",
            [
                "Understand binary number systems and Boolean algebra.",
                "Learn to design combinational logic circuits like adders and multiplexers.",
                "Master sequential logic including flip-flops, counters, and registers.",
            ],
            [
                "Design and simulate digital circuits for practical applications.",
                "Implement state machines for control logic.",
                "Troubleshoot and optimize digital systems.",
            ]
        ),
    },
    {
        code: "EE401",
        title: "Power Systems",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "EE",
        description: createCourseDescription(
            "This course focuses on the generation, transmission, and distribution of electric power. It covers load flow analysis, fault analysis, and the stability of power grids.",
            [
                "Understand the structure of modern power systems.",
                "Analyze transmission line parameters and performance.",
                "Learn methods for load flow studies and fault detection.",
            ],
            [
                "Model and analyze power system networks.",
                "Evaluate the stability and reliability of power grids.",
                "Design protection schemes for power system components.",
            ]
        ),
    },
    {
        code: "ME101",
        title: "Engineering Mechanics",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "ME",
        description: createCourseDescription(
            "A core engineering course dealing with forces, equilibrium, and motion. It covers statics and dynamics of particles and rigid bodies, providing the basis for structural analysis and mechanical design.",
            [
                "Understand the concepts of force vectors and equilibrium.",
                "Analyze the kinematics and kinetics of particles.",
                "Learn the principles of friction, work, and energy.",
            ],
            [
                "Solve problems related to static equilibrium in structures.",
                "Analyze the motion of mechanical systems under various forces.",
                "Apply mechanical principles to real-world engineering problems.",
            ]
        ),
    },
    {
        code: "ME201",
        title: "Thermodynamics",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 6,
        credits: 3,
        deptCode: "ME",
        description: createCourseDescription(
            "This course introduces the fundamental laws of thermodynamics and their application to energy systems. Topics include properties of pure substances, entropy, and thermodynamic cycles.",
            [
                "Understand the zeroth, first, and second laws of thermodynamics.",
                "Analyze thermodynamic cycles like Otto, Diesel, and Rankine.",
                "Learn the properties of ideal gases and real fluids.",
            ],
            [
                "Calculate energy transfer and efficiency in thermal systems.",
                "Analyze power and refrigeration cycles.",
                "Apply thermodynamic principles to design energy-efficient systems.",
            ]
        ),
    },
    {
        code: "ME301",
        title: "Fluid Mechanics",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 5,
        credits: 3.5,
        deptCode: "ME",
        description: createCourseDescription(
            "Study of fluids at rest and in motion. The course covers fluid properties, fluid statics, Bernoulli's equation, and flow through pipes, essential for hydraulic and aerodynamic engineering.",
            [
                "Understand fluid properties and the concept of continuum.",
                "Master the conservation laws of mass, momentum, and energy in fluids.",
                "Analyze laminar and turbulent flow in pipes.",
            ],
            [
                "Calculate fluid forces on submerged bodies.",
                "Design piping systems and hydraulic machinery.",
                "Apply fluid mechanics principles to aerodynamic problems.",
            ]
        ),
    },
    {
        code: "MATH101",
        title: "Calculus I",
        lectureHours: 4,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 5,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "Fundamental course in single-variable calculus. Topics include limits, continuity, differentiation, and integration, with applications to science and engineering problems.",
            [
                "Understand the rigorous definitions of limits and continuity.",
                "Master the techniques of differentiation and integration.",
                "Explore applications like optimization and related rates.",
            ],
            [
                "Solve complex mathematical problems using calculus.",
                "Model physical phenomena using differential equations.",
                "Apply calculus concepts to engineering analysis.",
            ]
        ),
    },
    {
        code: "MATH201",
        title: "Linear Algebra",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 6,
        credits: 3,
        deptCode: "CSE",
        description: createCourseDescription(
            "Study of vector spaces, linear transformations, and matrices. This course provides the mathematical foundation for computer graphics, machine learning, and systems engineering.",
            [
                "Understand vector spaces, subspaces, and basis.",
                "Master matrix operations, determinants, and inverses.",
                "Learn about eigenvalues, eigenvectors, and diagonalization.",
            ],
            [
                "Solve systems of linear equations efficiently.",
                "Apply linear algebra concepts to data science and engineering.",
                "Understand geometric transformations in n-dimensional space.",
            ]
        ),
    },
    {
        code: "CS102",
        title: "Object Oriented Programming",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "This course introduces the Object-Oriented paradigm. It covers classes, objects, inheritance, polymorphism, and encapsulation, using a modern OOP language like Java or C++.",
            [
                "Understand the four pillars of Object-Oriented Programming.",
                "Learn to design modular and reusable code structures.",
                "Master exception handling and multithreading concepts.",
            ],
            [
                "Design complex software systems using OOP principles.",
                "Implement robust and maintainable codebases.",
                "Refactor procedural code into object-oriented architecture.",
            ]
        ),
    },
    {
        code: "CS202",
        title: "Operating Systems",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 5,
        credits: 3.5,
        deptCode: "CSE",
        description: createCourseDescription(
            "An in-depth study of operating system internals. Topics include process management, memory management, file systems, concurrency, and virtualization.",
            [
                "Understand the role of the kernel and system calls.",
                "Analyze scheduling algorithms and deadlock prevention mechanisms.",
                "Learn virtual memory concepts including paging and segmentation.",
            ],
            [
                "Write system-level code to interact with the OS kernel.",
                "Troubleshoot system performance and synchronization issues.",
                "Understand the architecture of modern operating systems like Linux.",
            ]
        ),
    },
    {
        code: "CS302",
        title: "Computer Networks",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "CSE",
        description: createCourseDescription(
            "This course covers the design and implementation of computer networks. It focuses on the TCP/IP stack, routing protocols, network security, and distributed systems.",
            [
                "Understand the OSI and TCP/IP reference models.",
                "Master network protocols like IP, TCP, UDP, and HTTP.",
                "Learn the principles of routing, switching, and congestion control.",
            ],
            [
                "Configure and troubleshoot network infrastructure.",
                "Analyze network traffic and optimize performance.",
                "Implement secure communication channels over public networks.",
            ]
        ),
    },
    {
        code: "CS402",
        title: "Software Engineering",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 6,
        credits: 3,
        deptCode: "CSE",
        description: createCourseDescription(
            "A study of the software development lifecycle (SDLC). The course covers requirements analysis, software architecture, testing methodologies, and project management (Agile/Scrum).",
            [
                "Understand various software development models (Waterfall, Agile).",
                "Learn techniques for requirements gathering and system design.",
                "Master testing strategies including unit, integration, and system testing.",
            ],
            [
                "Manage software projects using industry-standard tools.",
                "Produce high-quality software documentation and design specs.",
                "Collaborate effectively in a software development team.",
            ]
        ),
    },
    {
        code: "EE102",
        title: "Electronics",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "EE",
        description: createCourseDescription(
            "Introduction to electronic components and circuits. The course covers diodes, transistors (BJT, FET), amplifiers, and operational amplifiers.",
            [
                "Understand the physics of semiconductors and PN junctions.",
                "Analyze biasing and amplification in transistor circuits.",
                "Learn the applications of Operational Amplifiers (Op-Amps).",
            ],
            [
                "Design basic electronic circuits for signal processing.",
                "Troubleshoot electronic hardware and PCBs.",
                "Simulate circuit behavior using SPICE tools.",
            ]
        ),
    },
    {
        code: "EE202",
        title: "Signals and Systems",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        selfStudyHours: 6,
        credits: 3,
        deptCode: "EE",
        description: createCourseDescription(
            "This course provides a mathematical framework for analyzing signals and systems. It covers Fourier series, Fourier transforms, and Z-transforms for continuous and discrete-time systems.",
            [
                "Understand the classification of signals and systems.",
                "Master frequency domain analysis using Fourier Transforms.",
                "Learn sampling theory and signal reconstruction.",
            ],
            [
                "Analyze the response of linear time-invariant (LTI) systems.",
                "Apply signal processing techniques to audio and image data.",
                "Design filters to remove noise from signals.",
            ]
        ),
    },
    {
        code: "ME102",
        title: "Manufacturing Processes",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 2,
        selfStudyHours: 5,
        credits: 3.5,
        deptCode: "ME",
        description: createCourseDescription(
            "Overview of modern manufacturing technologies. The course covers casting, forming, machining, welding, and additive manufacturing (3D printing).",
            [
                "Understand the principles of material removal and addition.",
                "Learn about casting and molding techniques for different materials.",
                "Explore advanced manufacturing techniques like CNC and laser cutting.",
            ],
            [
                "Select the appropriate manufacturing process for a given part design.",
                "Optimize manufacturing parameters for cost and quality.",
                "Operate basic machine tools and fabrication equipment.",
            ]
        ),
    },
    {
        code: "ME202",
        title: "Machine Design",
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 2,
        selfStudyHours: 4,
        credits: 4,
        deptCode: "ME",
        description: createCourseDescription(
            "This course focuses on the design of mechanical elements. It covers stress analysis, failure theories, and the design of gears, bearings, shafts, and fasteners.",
            [
                "Understand theories of failure for static and dynamic loading.",
                "Learn to design mechanical joints and transmission elements.",
                "Master the selection of materials for machine components.",
            ],
            [
                "Design safe and efficient mechanical components.",
                "Perform fatigue and stress analysis on machine parts.",
                "Create detailed engineering drawings for manufacturing.",
            ]
        ),
    },
];

export const prerequisites = [
    { courseCode: "CS201", prerequisiteCode: "CS101" },
    { courseCode: "CS301", prerequisiteCode: "CS201" },
    { courseCode: "CS401", prerequisiteCode: "CS201" },
    { courseCode: "CS501", prerequisiteCode: "CS301" },
    { courseCode: "CS501", prerequisiteCode: "MATH201" },
    { courseCode: "CS202", prerequisiteCode: "CS101" },
    { courseCode: "CS302", prerequisiteCode: "CS201" },
    { courseCode: "CS402", prerequisiteCode: "CS201" },
    { courseCode: "EE201", prerequisiteCode: "EE101" },
    { courseCode: "EE301", prerequisiteCode: "EE201" },
    { courseCode: "EE401", prerequisiteCode: "EE201" },
    { courseCode: "ME201", prerequisiteCode: "ME101" },
    { courseCode: "ME301", prerequisiteCode: "ME101" },
];

export const semesters = [
    {
        year: 2024,
        semester: "EVEN" as const,
        startDate: new Date("2024-08-01"),
        enrollmentDeadline: new Date("2024-08-15"),
        feedbackFormStartDate: new Date("2024-11-15"),
        endDate: new Date("2024-12-15"),
        status: "COMPLETED" as const,
    },
    {
        year: 2025,
        semester: "SUMMER" as const,
        startDate: new Date("2025-01-10"),
        enrollmentDeadline: new Date("2025-01-20"),
        feedbackFormStartDate: new Date("2025-04-20"),
        endDate: new Date("2025-05-20"),
        status: "ONGOING" as const,
    },
    {
        year: 2025,
        semester: "ODD" as const,
        startDate: new Date("2025-08-01"),
        enrollmentDeadline: new Date("2025-08-15"),
        feedbackFormStartDate: new Date("2025-11-15"),
        endDate: new Date("2025-12-15"),
        status: "UPCOMING" as const,
    },
];

export const classrooms = [
    { room: "A101", capacity: 60, type: "LECTURE" as const },
    { room: "A102", capacity: 60, type: "LECTURE" as const },
    { room: "A103", capacity: 40, type: "TUTORIAL" as const },
    { room: "B201", capacity: 50, type: "LECTURE" as const },
    { room: "B202", capacity: 30, type: "LAB" as const },
    { room: "B203", capacity: 30, type: "LAB" as const },
    { room: "C301", capacity: 80, type: "SEMINAR" as const },
    { room: "C302", capacity: 40, type: "TUTORIAL" as const },
    { room: "D101", capacity: 25, type: "LAB" as const },
    { room: "D102", capacity: 60, type: "LECTURE" as const },
];

export const timeSlots = [
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
        sessionType: "LAB" as const,
        labPeriod: "LAB-3H-1" as const,
    },
    {
        dayOfWeek: "TUESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-3" as const,
    },
    {
        dayOfWeek: "TUESDAY" as const,
        sessionType: "TUTORIAL" as const,
        tutorialPeriod: "T-PC-1" as const,
    },
    {
        dayOfWeek: "WEDNESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PC-4" as const,
    },
    {
        dayOfWeek: "WEDNESDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PCPE" as const,
    },
    {
        dayOfWeek: "THURSDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "HSME" as const,
    },
    {
        dayOfWeek: "THURSDAY" as const,
        sessionType: "LAB" as const,
        labPeriod: "LAB-2H-1" as const,
    },
    {
        dayOfWeek: "FRIDAY" as const,
        sessionType: "THEORY" as const,
        theoryPeriod: "PCDE" as const,
    },
    {
        dayOfWeek: "FRIDAY" as const,
        sessionType: "TUTORIAL" as const,
        tutorialPeriod: "T-PC-2" as const,
    },
];

export const feedbackQuestions = [
    {
        questionText: "The course content was well-organized and clear",
        questionType: "RATING" as const,
        isRequired: true,
        order: 1,
    },
    {
        questionText:
            "The instructor was knowledgeable and explained concepts effectively",
        questionType: "RATING" as const,
        isRequired: true,
        order: 2,
    },
    {
        questionText:
            "The course materials (slides, notes, references) were helpful",
        questionType: "RATING" as const,
        isRequired: true,
        order: 3,
    },
    {
        questionText: "The assignments and projects enhanced my understanding",
        questionType: "RATING" as const,
        isRequired: true,
        order: 4,
    },
    {
        questionText:
            "The instructor was accessible and responsive to questions",
        questionType: "RATING" as const,
        isRequired: true,
        order: 5,
    },
    {
        questionText: "Would you recommend this course to other students?",
        questionType: "YES_NO" as const,
        isRequired: true,
        order: 6,
    },
    {
        questionText: "What did you like most about this course?",
        questionType: "DESCRIPTIVE" as const,
        isRequired: false,
        order: 7,
    },
    {
        questionText: "What improvements would you suggest for this course?",
        questionType: "DESCRIPTIVE" as const,
        isRequired: false,
        order: 8,
    },
    {
        questionText: "The pace of the course was appropriate",
        questionType: "RATING" as const,
        isRequired: true,
        order: 9,
    },
    {
        questionText: "The grading system was fair and transparent",
        questionType: "RATING" as const,
        isRequired: true,
        order: 10,
    },
];

export const courseOfferings2025Spring = [
    {
        courseCode: "CS101",
        instructorEmployeeIds: ["+i1", "+i2"],
        headEmployeeId: "+i1",
        batchYears: [2023],
        programCode: "BTCS",
    },
    {
        courseCode: "CS201",
        instructorEmployeeIds: ["+i2"],
        headEmployeeId: "+i2",
        batchYears: [2022],
        programCode: "BTCS",
    },
    {
        courseCode: "CS301",
        instructorEmployeeIds: ["+i3"],
        headEmployeeId: "+i3",
        batchYears: [2021],
        programCode: "BTCS",
    },
    {
        courseCode: "CS102",
        instructorEmployeeIds: ["+i1"],
        headEmployeeId: "+i1",
        batchYears: [2023],
        programCode: "BTCS",
    },
    {
        courseCode: "CS202",
        instructorEmployeeIds: ["+i2", "+i3"],
        headEmployeeId: "+i2",
        batchYears: [2022],
        programCode: "BTCS",
    },
    {
        courseCode: "EE101",
        instructorEmployeeIds: ["+i4"],
        headEmployeeId: "+i4",
        batchYears: [2023],
        programCode: "BTEE",
    },
    {
        courseCode: "EE201",
        instructorEmployeeIds: ["+i5"],
        headEmployeeId: "+i5",
        batchYears: [2022],
        programCode: "BTEE",
    },
    {
        courseCode: "EE301",
        instructorEmployeeIds: ["+i4"],
        headEmployeeId: "+i4",
        batchYears: [2021],
        programCode: "BTEE",
    },
    {
        courseCode: "ME101",
        instructorEmployeeIds: ["+i6"],
        headEmployeeId: "+i6",
        batchYears: [2023],
        programCode: "BTME",
    },
    {
        courseCode: "ME201",
        instructorEmployeeIds: ["+i7"],
        headEmployeeId: "+i7",
        batchYears: [2022],
        programCode: "BTME",
    },
    {
        courseCode: "MATH101",
        instructorEmployeeIds: ["+i3"],
        headEmployeeId: "+i3",
        batchYears: [2023],
        programCode: "BTCS",
    },
    {
        courseCode: "MATH201",
        instructorEmployeeIds: ["+i2"],
        headEmployeeId: "+i2",
        batchYears: [2022],
        programCode: "BTCS",
    },
];
