import mongoose from "mongoose";
import { Question } from "./src/models/question.model.js";
import dotenv from "dotenv";
dotenv.config();

const questions = [
  {
    exam: "GATE", subject: "Data Structures", topic: "Arrays", difficulty: "easy",
    questionText: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctOption: "C",
    explanation: "Array elements are stored in contiguous memory, so direct index access is O(1)."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Arrays", difficulty: "medium",
    questionText: "What is the worst-case time complexity of inserting an element at the beginning of an array of size n?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctOption: "C",
    explanation: "All n elements must shift right by one position, making it O(n)."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Linked Lists", difficulty: "easy",
    questionText: "Which of the following is an advantage of a linked list over an array?",
    options: ["Random access", "Better cache performance", "Dynamic size", "Less memory usage"],
    correctOption: "C",
    explanation: "Linked lists grow and shrink dynamically; arrays have fixed size."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Linked Lists", difficulty: "medium",
    questionText: "What is the time complexity of deleting a node from the middle of a singly linked list given a pointer to that node?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctOption: "A",
    explanation: "With a direct pointer, you copy next node's data and skip it — O(1)."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Stacks", difficulty: "easy",
    questionText: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Heap", "Tree"],
    correctOption: "B",
    explanation: "Stack follows Last In First Out (LIFO)."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Stacks", difficulty: "medium",
    questionText: "Which of the following applications uses a stack?",
    options: ["CPU scheduling", "Breadth-first search", "Function call management", "Shortest path"],
    correctOption: "C",
    explanation: "The call stack manages function calls and returns using LIFO order."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Binary Trees", difficulty: "easy",
    questionText: "What is the maximum number of nodes in a binary tree of height h?",
    options: ["2h", "2h - 1", "2^h - 1", "2^(h+1) - 1"],
    correctOption: "D",
    explanation: "A perfect binary tree of height h has 2^(h+1) - 1 nodes."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Binary Trees", difficulty: "medium",
    questionText: "In which tree traversal does the root node get visited last?",
    options: ["Inorder", "Preorder", "Postorder", "Level order"],
    correctOption: "C",
    explanation: "Postorder visits left, right, then root — so root is always last."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Binary Trees", difficulty: "hard",
    questionText: "What is the time complexity of searching in a balanced Binary Search Tree?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctOption: "C",
    explanation: "In a balanced BST, each comparison halves the search space — O(log n)."
  },
  {
    exam: "GATE", subject: "Data Structures", topic: "Sorting", difficulty: "easy",
    questionText: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    correctOption: "C",
    explanation: "Merge Sort runs in O(n log n) average and worst case consistently."
  },
  {
    exam: "GATE", subject: "Operating Systems", topic: "Processes", difficulty: "easy",
    questionText: "What is a process in operating systems?",
    options: ["A program stored on disk", "A program in execution", "A thread of execution", "A system call"],
    correctOption: "B",
    explanation: "A process is a program that has been loaded into memory and is executing."
  },
  {
    exam: "GATE", subject: "Operating Systems", topic: "Processes", difficulty: "medium",
    questionText: "Which of the following is NOT a valid process state?",
    options: ["Ready", "Running", "Suspended", "Compiling"],
    correctOption: "D",
    explanation: "Compiling is a development-time activity, not a process execution state."
  },
  {
    exam: "GATE", subject: "Operating Systems", topic: "Deadlocks", difficulty: "medium",
    questionText: "Which of the following is NOT a necessary condition for deadlock?",
    options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"],
    correctOption: "C",
    explanation: "Deadlock requires NO preemption — preemption actually prevents deadlock."
  },
  {
    exam: "GATE", subject: "Operating Systems", topic: "Deadlocks", difficulty: "hard",
    questionText: "Banker's algorithm is used for:",
    options: ["Deadlock detection", "Deadlock avoidance", "Deadlock recovery", "Deadlock prevention"],
    correctOption: "B",
    explanation: "Banker's algorithm checks if resource allocation leads to a safe state — avoidance."
  },
  {
    exam: "GATE", subject: "Operating Systems", topic: "Memory Management", difficulty: "easy",
    questionText: "What does virtual memory allow?",
    options: [
        "Running programs faster",
        "Running programs larger than physical memory",
        "Eliminating page faults",
        "Direct hardware access"
    ],
    correctOption: "B",
    explanation: "Virtual memory uses disk space to extend RAM, allowing larger programs to run."
  },
  {
    exam: "GATE", subject: "Operating Systems", topic: "Memory Management", difficulty: "medium",
    questionText: "Which page replacement algorithm suffers from Belady's anomaly?",
    options: ["LRU", "Optimal", "FIFO", "LFU"],
    correctOption: "C",
    explanation: "FIFO can have more page faults with more frames — this is Belady's anomaly."
  },
  {
    exam: "GATE", subject: "Computer Networks", topic: "OSI Model", difficulty: "easy",
    questionText: "How many layers does the OSI model have?",
    options: ["4", "5", "6", "7"],
    correctOption: "D",
    explanation: "OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application."
  },
  {
    exam: "GATE", subject: "Computer Networks", topic: "OSI Model", difficulty: "medium",
    questionText: "Which layer of the OSI model is responsible for routing?",
    options: ["Data Link", "Transport", "Network", "Session"],
    correctOption: "C",
    explanation: "The Network layer (Layer 3) handles logical addressing and routing via IP."
  },
  {
    exam: "GATE", subject: "Computer Networks", topic: "TCP/IP", difficulty: "medium",
    questionText: "Which protocol provides reliable, connection-oriented communication?",
    options: ["UDP", "IP", "TCP", "ARP"],
    correctOption: "C",
    explanation: "TCP provides reliability via handshaking, acknowledgments, and retransmission."
  },
  {
    exam: "GATE", subject: "Computer Networks", topic: "TCP/IP", difficulty: "hard",
    questionText: "What is the size of an IPv4 address?",
    options: ["16 bits", "32 bits", "64 bits", "128 bits"],
    correctOption: "B",
    explanation: "IPv4 addresses are 32 bits long, written as four 8-bit octets (e.g., 192.168.1.1)."
  }
];

const seed = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log("✅ 20 questions seeded successfully");
    mongoose.connection.close();
};

seed().catch(console.error);