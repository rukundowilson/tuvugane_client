"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Nav from './components/Nav';
import Footer from './components/Footer';

const Tuvugane: React.FC = () => {
  return (
    <>
      <Head>
        <title>Tuvugane - Citizen Complaints and Engagement System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="antialiased text-gray-700 font-['Inter'] bg-white">
        {/* Navigation */}
        <Nav/>

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
          <div className="absolute inset-0 bg-[url('/tuvugane-rw.png')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-300/10 rounded-full blur-xl"></div>
          
          <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-10 md:mb-0 text-center md:text-left">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100/20 backdrop-blur-sm rounded-full text-blue-100 text-sm font-medium mb-6">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Government of Rwanda Official Platform
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                  Your Voice Matters in Building
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Better Communities
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                  Submit complaints, track progress, and see real change happen in your community through our transparent citizen engagement platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/register" className="group bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1">
                    <span className="flex items-center justify-center">
                      Register Account
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                  <Link href="/submit-anonymous" className="bg-blue-700/50 backdrop-blur-sm text-white border-2 border-blue-400/30 px-8 py-4 rounded-xl hover:bg-blue-600/50 hover:border-blue-300/50 font-semibold transition-all duration-300">
                    Submit Anonymously
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/3 md:pl-10">
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                      <p className="text-blue-100 text-sm">Get help whenever you need it</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-4">
                Platform Features
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                Everything You Need for 
                <span className="text-blue-600"> Effective Engagement</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Government of Rwanda platform designed to streamline the process of submitting complaints, tracking progress, and ensuring accountability through innovative technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards with enhanced design */}
              {[
                {
                  icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                  title: "Easy Submission",
                  description: "Simple and intuitive interface to submit complaints or feedback about public services with just a few clicks.",
                  color: "blue"
                },
                {
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                  title: "Smart Categorization",
                  description: "Automatic categorization and routing to the appropriate government agencies to ensure efficient handling.",
                  color: "green"
                },
                {
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  title: "Real-time Tracking",
                  description: "Monitor the status of your complaint in real-time with updates at every stage of the process.",
                  color: "purple"
                },
                {
                  icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
                  title: "Direct Communication",
                  description: "Engage in direct communication with government officials responsible for resolving your issue.",
                  color: "orange"
                },
                {
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: "Transparent Process",
                  description: "Clear visibility into the complaint handling process and expected timelines for resolution.",
                  color: "teal"
                },
                {
                  icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055zM20.488 9H15V3.512A9.025 9.025 0 0120.488 9z",
                  title: "Analytical Insights",
                  description: "Access to dashboards showing patterns and trends in citizen complaints to drive policy improvements.",
                  color: "indigo"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className={`bg-${feature.color}-100 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-${feature.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-48 translate-x-48"></div>
          
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm font-medium mb-4">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our streamlined process makes it easy to submit and track your complaints from start to finish with complete transparency.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connection lines */}
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 transform -translate-y-1/2"></div>
              
              {[
                {
                  number: "1",
                  title: "Submit Your Complaint",
                  description: "Fill out our simple form with details about your issue. Add photos or supporting documents if needed.",
                  color: "blue",
                  icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                },
                {
                  number: "2",
                  title: "Automatic Routing",
                  description: "Our system automatically categorizes and routes your complaint to the appropriate government agency.",
                  color: "green",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z"
                },
                {
                  number: "3",
                  title: "Track & Communicate",
                  description: "Track progress in real-time, receive updates, and communicate directly with officials working on your issue.",
                  color: "purple",
                  icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center relative z-10">
                    <div className={`bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 text-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <span className="text-2xl font-bold">{step.number}</span>
                    </div>
                    
                    <div className={`bg-${step.color}-100 rounded-xl w-12 h-12 flex items-center justify-center mx-auto mb-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${step.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={step.icon} />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/submit-anonymous" className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1">
                  <span className="flex items-center justify-center">
                    Submit Anonymously
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  href="/admin/login"
                  className="bg-gray-800 text-white border-2 border-gray-700 px-10 py-4 rounded-xl hover:bg-gray-900 hover:border-gray-600 font-semibold transition-all duration-300"
                >
                  Super Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* User Benefits Section */}
        <section id="user-benefits" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-4">
                Why Choose Tuvugane
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                Empowering Citizens & 
                <span className="text-purple-600"> Government Together</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Learn how Tuvugane bridges the gap between citizens and government, creating a more responsive and accountable public service system.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Citizens Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 border border-blue-200">
                <div className="flex items-center mb-8">
                  <div className="bg-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900">For Citizens</h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Voice Your Concerns",
                      description: "Easily report issues in your community through a user-friendly platform designed for accessibility"
                    },
                    {
                      title: "Stay Informed",
                      description: "Receive automatic updates as your complaint progresses through the system with complete transparency"
                    },
                    {
                      title: "Build Better Communities",
                      description: "Contribute to improving public services and infrastructure in your area through civic engagement"
                    },
                    {
                      title: "Transparent Communication",
                      description: "Direct communication with the officials responsible for addressing your concerns"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">{benefit.title}</h4>
                        <p className="text-blue-800 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Government Benefits */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-10 border border-green-200">
                <div className="flex items-center mb-8">
                  <div className="bg-green-600 rounded-2xl w-16 h-16 flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-green-900">For Government Officials</h3>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Streamlined Workflow",
                      description: "Receive properly categorized and routed complaints to improve efficiency and response times"
                    },
                    {
                      title: "Data-Driven Insights",
                      description: "Access analytics and trends to make informed policy and resource allocation decisions"
                    },
                    {
                      title: "Improved Accountability",
                      description: "Enhanced tracking and reporting systems to ensure issues are addressed in a timely manner"
                    },
                    {
                      title: "Public Trust",
                      description: "Build stronger relationships with citizens through transparent communication and visible action"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 mb-2">{benefit.title}</h4>
                        <p className="text-green-800 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white">
                <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
                <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                  Join thousands of citizens already using Tuvugane to communicate with government agencies and create better communities together.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/register" className="bg-white text-purple-600 px-10 py-4 rounded-xl hover:bg-purple-50 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1">
                    Create Your Account
                  </Link>
                  <Link href="/login" className="bg-purple-700/50 backdrop-blur-sm text-white border-2 border-purple-300/30 px-10 py-4 rounded-xl hover:bg-purple-600/50 hover:border-purple-200/50 font-semibold transition-all duration-300">
                    Login to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer/>
      </div>
    </>
  );
};

export default Tuvugane;