"use client";
import React from 'react';
import { FaUserMd, FaUser, FaFlask, FaPrescriptionBottleAlt } from "react-icons/fa";
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HomePage = () => {
  const accountTypes = [
    {
      href: "/auth/login/doctor",
      icon: <FaUserMd className="text-5xl text-blue-600" />,
      title: "Doctor",
      description: "Medical professional account",
    },
    {
      href: "/auth/login/patient",
      icon: <FaUser className="text-5xl text-blue-600" />,
      title: "Patient",
      description: "Patient account for appointments",
    },
    {
      href: "/auth/login/lab",
      icon: <FaFlask className="text-5xl text-blue-600" />,
      title: "Laboratory",
      description: "Lab testing facility account",
    },
    {
      href: "/auth/login/pharmacy",
      icon: <FaPrescriptionBottleAlt className="text-5xl text-blue-600" />,
      title: "Pharmacy",
      description: "Pharmacy store account",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to CuraSync
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Choose your account type to continue
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accountTypes.map((type, index) => (
              <Link href={type.href} key={index}>
                <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-center items-center mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{type.title}</h3>
                  <p className="text-gray-600">{type.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;