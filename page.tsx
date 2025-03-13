"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar/sidebar";
import api from "@/utils/api";

// Define the shape of the state object and API response
interface PatientInfo {
  firstname: string;
  lastname: string;
  address: string;
  bloodType: string;
  bmi: string;
  dateOfBirth: string;
  email: string;
  guardianContactNumber: string;
  guardianRelation: string;
  guardianName: string;
  height: string;
  medicationAllergies: { severity: string; type: string; name: string }[];
  nic: string;
  patientId: string;
  phoneNumber: string;
  profilepic: string;
  updateAt: string;
  weight: string;
}

const PatientDashboard = () => {
  const router = useRouter();
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    firstname: "",
    lastname: "",
    address: "",
    bloodType: "",
    bmi: "",
    dateOfBirth: "",
    email: "",
    guardianContactNumber: "",
    guardianRelation: "",
    guardianName: "",
    height: "",
    medicationAllergies: [],
    nic: "",
    patientId: "",
    phoneNumber: "",
    profilepic: "",
    updateAt: "",
    weight: "",
  });

  // fetchHomeData with proper typing for the API response
  const fetchHomeData = async () => {
    try {
      const response = await api.get<PatientInfo>("/patient/home");
      setPatientInfo({
        firstname: response.data.firstname || "",
        lastname: response.data.lastname || "",
        address: response.data.address || "",
        bloodType: response.data.bloodType || "",
        bmi: response.data.bmi || "",
        dateOfBirth: response.data.dateOfBirth || "",
        email: response.data.email || "",
        guardianContactNumber: response.data.guardianContactNumber || "",
        guardianRelation: response.data.guardianRelation || "",
        guardianName: response.data.guardianName || "",
        height: response.data.height || "",
        medicationAllergies: response.data.medicationAllergies || [],
        nic: response.data.nic || "",
        patientId: response.data.patientId || "",
        phoneNumber: response.data.phoneNumber || "",
        profilepic: response.data.profilepic || "",
        updateAt: response.data.updateAt || "",
        weight: response.data.weight || "",
      });
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "patient") {
      router.push("/auth/login/patient");
    } else {
      fetchHomeData();
    }
  }, [router]);

  return (
    <div className="bg-white min-h-screen flex font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4"></div>
            <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md">
              Patient
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">
                  {patientInfo.firstname
                    ? patientInfo.firstname.split(" ").map((n) => n[0]).join("")
                    : ""}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {patientInfo.firstname} {patientInfo.lastname}
                </h2>
                <p className="text-gray-600">DOB: {patientInfo.dateOfBirth}</p>
                <p className="text-gray-600">Blood Type: {patientInfo.bloodType}</p>
                <p className="text-gray-600">NIC: {patientInfo.nic}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-6">
            {/* Vital Statistics */}
            <div className="col-span-2 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Vital Statistics</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Height: {patientInfo.height}</p>
                <p className="text-gray-600">Weight: {patientInfo.weight}</p>
                <p className="text-gray-600">BMI: {patientInfo.bmi}</p>
                <p className="text-gray-400 text-sm mt-4">
                  Last updated: {patientInfo.updateAt}
                </p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">Name: {patientInfo.guardianName}</p>
                <p className="text-gray-600">Relation: {patientInfo.guardianRelation}</p>
                <p className="text-gray-600">Phone: {patientInfo.guardianContactNumber}</p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold">Allergies</h3>
            <div className="mt-4 space-y-3">
              {patientInfo.medicationAllergies.length > 0 ? (
                patientInfo.medicationAllergies.map((allergy, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 ${
                        allergy.severity === "Severe"
                          ? "bg-red-500"
                          : allergy.severity === "Moderate"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      } text-white text-sm rounded`}
                    >
                      {allergy.severity}
                    </span>
                    <span className="text-gray-600">
                      {allergy.type}: {allergy.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No allergies recorded.</p>
              )}
            </div>
          </div>

          {/* Medical Tracking Dashboard Access */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <p className="text-center text-lg font-medium">
              Do you want to access your medical tracking Dashboard?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="px-6 py-2 bg-red-500 text-white rounded-md">
                Yes
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-md">
                No
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;