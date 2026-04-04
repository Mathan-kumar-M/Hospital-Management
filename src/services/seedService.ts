import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const departments = [
  { 
    id: "cardiology", 
    name: "Cardiology", 
    icon: "Heart", 
    description: "Comprehensive heart care including diagnostics, interventional cardiology, and advanced cardiac surgery.", 
    doctorCount: 4,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "neurology", 
    name: "Neurology", 
    icon: "Brain", 
    description: "Expert diagnosis and treatment for complex neurological disorders, including epilepsy, stroke, and MS.", 
    doctorCount: 3,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "orthopedics", 
    name: "Orthopedics", 
    icon: "Bone", 
    description: "Specialized care for bones, joints, and musculoskeletal issues, from sports injuries to joint replacements.", 
    doctorCount: 3,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "pediatrics", 
    name: "Pediatrics", 
    icon: "Baby", 
    description: "Compassionate healthcare for infants, children, and adolescents in a child-friendly environment.", 
    doctorCount: 3,
    image: "https://plus.unsplash.com/premium_photo-1661608036940-0a6736cb86ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UGVkaWF0cmljc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  { 
    id: "ophthalmology", 
    name: "Ophthalmology", 
    icon: "Eye", 
    description: "Advanced eye care, vision correction, and surgical procedures for all types of vision conditions.", 
    doctorCount: 2,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "dermatology", 
    name: "Dermatology", 
    icon: "Sparkles", 
    description: "Comprehensive care for skin, hair, and nail conditions, including medical and cosmetic dermatology.", 
    doctorCount: 2,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "gastroenterology", 
    name: "Gastroenterology", 
    icon: "Activity", 
    description: "Expert care for digestive system disorders, including liver, gallbladder, and pancreatic conditions.", 
    doctorCount: 2,
    image: "https://media.istockphoto.com/id/2195632768/photo/doctor-explain-colonoscopy-exam.jpg?s=612x612&w=0&k=20&c=EJFKVezvPOOski1zvXE1X5r-GRvrKej65NaQa16ACRE="
  },
  { 
    id: "oncology", 
    name: "Oncology", 
    icon: "Microscope", 
    description: "Advanced cancer treatment and research, providing personalized care and support for patients.", 
    doctorCount: 2,
    image: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "psychiatry", 
    name: "Psychiatry", 
    icon: "Brain", 
    description: "Compassionate mental health services, including therapy and medication management for all ages.", 
    doctorCount: 2,
    image: "https://plus.unsplash.com/premium_photo-1682148383444-19e334062543?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UHN5Y2hpYXRyeSUyMGRlcGFydG1lbnR8ZW58MHx8MHx8fDA%3D"
  },
  { 
    id: "ent", 
    name: "ENT", 
    icon: "Ear", 
    description: "Specialized treatment for ear, nose, and throat conditions, including hearing and balance disorders.", 
    doctorCount: 2,
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800"
  },
];

const doctors = [
  {
    id: "dr-smith",
    name: "Dr. Sarah Smith",
    specialization: "Senior Cardiologist",
    departmentId: "cardiology",
    photo: "https://images.unsplash.com/photo-1559839734-2b71f153678e?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Sarah Smith is a world-renowned cardiologist with over 15 years of experience in interventional cardiology. She specializes in minimally invasive heart procedures and cardiac rehabilitation.",
    rating: 4.9,
    experience: "15+ Years",
    availability: ["Mon", "Wed", "Fri"]
  },
  {
    id: "dr-johnson",
    name: "Dr. Michael Johnson",
    specialization: "Neurologist",
    departmentId: "neurology",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Michael Johnson specializes in treating complex neurological conditions including epilepsy, multiple sclerosis, and Parkinson's disease. He is a lead researcher in neuro-regeneration.",
    rating: 4.8,
    experience: "12+ Years",
    availability: ["Tue", "Thu", "Sat"]
  },
  {
    id: "dr-williams",
    name: "Dr. Emily Williams",
    specialization: "Orthopedic Surgeon",
    departmentId: "orthopedics",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Emily Williams is an expert in joint replacement surgery and sports medicine. She has worked with professional athletes and specializes in arthroscopic surgery.",
    rating: 4.7,
    experience: "10+ Years",
    availability: ["Mon", "Tue", "Thu"]
  },
  {
    id: "dr-chen",
    name: "Dr. David Chen",
    specialization: "Pediatrician",
    departmentId: "pediatrics",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. David Chen provides compassionate care for children of all ages. He focuses on preventive medicine and developmental milestones.",
    rating: 4.9,
    experience: "8+ Years",
    availability: ["Wed", "Thu", "Fri"]
  },
  {
    id: "dr-garcia",
    name: "Dr. Maria Garcia",
    specialization: "Ophthalmologist",
    departmentId: "ophthalmology",
    photo: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Maria Garcia specializes in advanced cataract surgery and laser vision correction. She is dedicated to preserving and restoring vision for her patients.",
    rating: 4.8,
    experience: "14+ Years",
    availability: ["Mon", "Wed", "Sat"]
  },
  {
    id: "dr-patel",
    name: "Dr. Anita Patel",
    specialization: "Dermatologist",
    departmentId: "dermatology",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Anita Patel is an expert in both medical and cosmetic dermatology. She specializes in skin cancer screening and advanced laser treatments.",
    rating: 4.7,
    experience: "9+ Years",
    availability: ["Tue", "Thu", "Fri"]
  },
  {
    id: "dr-brown",
    name: "Dr. Robert Brown",
    specialization: "Gastroenterologist",
    departmentId: "gastroenterology",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Robert Brown is a specialist in digestive health, with a focus on inflammatory bowel disease and hepatology. He has over 20 years of clinical experience.",
    rating: 4.8,
    experience: "20+ Years",
    availability: ["Mon", "Tue", "Wed"]
  },
  {
    id: "dr-davis",
    name: "Dr. Linda Davis",
    specialization: "Oncologist",
    departmentId: "oncology",
    photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Linda Davis is dedicated to providing personalized cancer care. She specializes in immunotherapy and targeted treatments for solid tumors.",
    rating: 4.9,
    experience: "18+ Years",
    availability: ["Tue", "Thu", "Fri"]
  },
  {
    id: "dr-wilson",
    name: "Dr. James Wilson",
    specialization: "Psychiatrist",
    departmentId: "psychiatry",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. James Wilson provides comprehensive mental health services, specializing in anxiety disorders and depression. He uses an integrated approach to treatment.",
    rating: 4.7,
    experience: "11+ Years",
    availability: ["Mon", "Wed", "Fri"]
  },
  {
    id: "dr-miller",
    name: "Dr. Susan Miller",
    specialization: "ENT Specialist",
    departmentId: "ent",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=500",
    bio: "Dr. Susan Miller is an expert in treating ear, nose, and throat conditions. She specializes in sinus surgery and hearing restoration procedures.",
    rating: 4.8,
    experience: "13+ Years",
    availability: ["Tue", "Thu", "Sat"]
  }
];

export const seedDatabase = async () => {
  try {
    // Seed Departments
    for (const dept of departments) {
      await setDoc(doc(db, "departments", dept.id), dept);
    }

    // Seed Doctors
    for (const doctor of doctors) {
      await setDoc(doc(db, "doctors", doctor.id), doctor);
    }

    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};
