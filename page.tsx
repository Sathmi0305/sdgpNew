"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/sidebar";
import { toast } from "sonner";
import api from "@/utils/api";

// Define the shape of the allergy item
interface AllergyItem {
  name: string;
  severity: "Severe" | "Moderate" | "Low";
}

// Define the shape of the patient data
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
  medicationAllergies: AllergyItem[];
  nic: string;
  patientId: string;
  phoneNumber: string;
  profilepic: string;
  updateAt: string;
  weight: string;
}

const SettingsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch settings data from the API
  const fetchSettingsData = async () => {
    try {
      const response = await api.get<PatientInfo>("/patient/settings");
      setPatientInfo(response.data); // Set the entire patient info object
      console.log("Fetched settings data:", response.data);
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Failed to load settings data");
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings data to the API
  const handleSaveProfile = async () => {
    try {
      await api.put("/patient/settings", patientInfo);
      toast.success("Profile updated successfully");
      localStorage.setItem("patientData", JSON.stringify(patientInfo));
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save profile");
    }
  };

  // Handle profile picture change
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPatientInfo((prev) => ({
          ...prev,
          profilepic: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => {
      let newValue = value;
      if ((name === "height" || name === "weight") && value !== "") {
        newValue = Math.max(0, parseFloat(value)).toString();
      }

      const newData = { ...prev, [name]: newValue };

      // Recalculate BMI if height or weight changes
      if (name === "height" || name === "weight") {
        const heightInMeters = name === "height" ? parseFloat(newValue) / 100 : parseFloat(prev.height) / 100;
        const weightInKg = name === "weight" ? parseFloat(newValue) : parseFloat(prev.weight);
        if (heightInMeters && weightInKg) {
          newData.bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        }
      }

      return newData;
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/auth/login/patient");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "patient") {
      router.push("/auth/login/patient");
    } else {
      fetchSettingsData();
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            {/* Remove the Save Changes button from here */}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Profile Picture */}
            <div className="flex items-center pb-8 border-b border-gray-200">
              <div className="relative w-20 h-20 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center">
                {patientInfo.profilepic ? (
                  <img
                    src={patientInfo.profilepic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 text-2xl font-semibold">
                    {patientInfo.firstname[0]}
                    {patientInfo.lastname[0]}
                  </span>
                )}
                <label
                  htmlFor="profile-pic"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    id="profile-pic"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              <div className="ml-6">
                <p className="text-xl font-medium">
                  {patientInfo.firstname} {patientInfo.lastname}
                </p>
                <p className="text-base text-blue-500">{patientInfo.email}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-6 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient ID - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientInfo.patientId}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>

              {/* NIC - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                <input
                  type="text"
                  value={patientInfo.nic}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={patientInfo.firstname}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={patientInfo.lastname}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={patientInfo.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={patientInfo.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={patientInfo.dateOfBirth}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={patientInfo.address}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={patientInfo.height}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={patientInfo.weight}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BMI - Calculated */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BMI (Calculated)
                </label>
                <input
                  type="text"
                  value={patientInfo.bmi}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  disabled
                />
              </div>

              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <input
                  type="text"
                  name="bloodType"
                  value={patientInfo.bloodType}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Guardian Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={patientInfo.guardianName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Guardian Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Contact Number
                </label>
                <input
                  type="tel"
                  name="guardianContactNumber"
                  value={patientInfo.guardianContactNumber}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Guardian Relation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Relation
                </label>
                <input
                  type="text"
                  name="guardianRelation"
                  value={patientInfo.guardianRelation}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Add Save Changes button here, right before the Logout button */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <SettingsIcon className="w-4 h-4 mr-2" /> Save Changes
            </button>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;