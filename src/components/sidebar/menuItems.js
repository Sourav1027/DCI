import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTachometerAlt,faUsers,faSms,faBook,faSchool,faSearchLocation,faChalkboardTeacher,faBookOpen,faPersonDotsFromLine,faScrewdriverWrench,
faBookBookmark,faClock,faCreditCard,faFileAlt,
faUser,
faMoneyBill,
faMoneyCheck,
faUserGraduate
} from "@fortawesome/free-solid-svg-icons";

import Dashboard from "../Dashboard/dashboard";
import Student from "../../Screens/Students/student";
import ExamManagement from "../../Screens/Super Admin/ExamManagement/examManagement";
import SMS from "../../Screens/Super Admin/SMS/sms";
import Course from "../Masters/course/course";
import Batch from "../Masters/Batch/batch";
import CenterManagement from "../../Screens/Super Admin/CenterManagement/centerManagement";
import EnquiryManagement from "../../Screens/Super Admin/EnquiryManagement/enquiryManagement";
import Trainer from "../../Screens/Super Admin/TrainerManagement/trainer";
import Syllabus from "../../Screens/Super Admin/syllabus/syllabus";
import FeeManagement from "../../Screens/Super Admin/FeeManagement/feeManagement";
import SoftSkills from "../../Screens/Super Admin/softSkills/softSkills";
import FeeUpdate from "../../Screens/centerAdmin/feeUpdate/updatefee";
import Profile from "../utils/profile/profile";
import StudentList from "../../Screens/Accountant/studentList/studentList";
import PendingPayment from "../../Screens/Accountant/pendingPayment/pendingpayment";
import RecievedPayment from "../../Screens/Accountant/recievedPayment/recievedPayment";
import StudentCompletion from "../../Screens/completedCouse/completedCourse";
// import Certificate from "../../Screens/Certificates/certificate";



export const menuItems = [
  {
    title: "Dashboard",
    icon: <FontAwesomeIcon icon={faTachometerAlt} />,
    path: "/dashboard",
    component: Dashboard,
  },
  {
    title: "Profile",
    icon: <FontAwesomeIcon icon={faUser} />,
    path: "/student-profile",
    component: Profile,
  },
  {
    title: "Centers",
    icon: <FontAwesomeIcon icon={faSchool} />,
    path: "/center-management",
    component: CenterManagement,
  },
  {
    title: "Enquiry",
    icon: <FontAwesomeIcon icon={faSearchLocation} />,
    path: "/enquiry-management",
    component: EnquiryManagement,
  },
  {
    title: "Students",
    icon: <FontAwesomeIcon icon={faUsers} />,
    path: "/students",
    component: Student,
  },
  {
    title: "Trainers",
    icon: <FontAwesomeIcon icon={faChalkboardTeacher} />,
    path: "/trainer-management",
    component: Trainer,
  },
  {
    title: "Syllabus",
    icon: <FontAwesomeIcon icon={faBookOpen} />,
    path: "/syllabus-management",
    component: Syllabus,
  },
  {
    title: "SMS",
    icon: <FontAwesomeIcon icon={faSms} />,
    path: "/sms",
    component: SMS,
  },
  {
    title: "Fee Management",
    icon: <FontAwesomeIcon icon={faCreditCard} />,
    path: "/fee-management",
    component: FeeManagement,
  },
  {
    title: "Exam Structure",
    icon: <FontAwesomeIcon icon={faBook} />,
    path: "/exam-management",
    component: ExamManagement,
  },
  {
    title: "Soft skills",
    icon: <FontAwesomeIcon icon={faPersonDotsFromLine} />,
    path: "/soft-skills",
    component: SoftSkills,
  },
  {
    title: "Fee Update",
    icon: <FontAwesomeIcon icon={faCreditCard} />,
    path: "/fee-update",
    component: FeeUpdate,
  },
  {
    title: "Student List",
    icon: <FontAwesomeIcon icon={faUsers} />,
    path: "/student-list",
    component: StudentList,
  },
  {
    title: "Pending Fee",
    icon: <FontAwesomeIcon icon={faMoneyBill} />,
    path: "/pending-fee",
    component: PendingPayment,
  },
  {
    title: "Recieved Fee",
    icon: <FontAwesomeIcon icon={faMoneyCheck} />,
    path: "/recieved-fee",
    component: RecievedPayment,
  },
  {
    title: "Completed Course",
    icon: <FontAwesomeIcon icon={faUserGraduate} />,
    path: "/complete-course",
    component: StudentCompletion,
  },
  {
    title: "Master",
    icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
    path: "/master",
    hasSubmenu: true,
    submenuItems: [
      {
        title: "Course",
        path: "/master/course",
        icon: <FontAwesomeIcon icon={faBookBookmark} />,
        component: Course,
      },
      {
        title: "Batch",
        path: "/master/batch",
        icon: <FontAwesomeIcon icon={faClock} />,
        component: Batch,
      },
    ],
  },
];