"use client";
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
export default function Footer(){
    return(
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xl font-bold">Tuvugane</span>
                </div>
                <p className="text-gray-400 max-w-md">
                  Empowering citizens and government agencies to work together for better communities.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition">User Benefits</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                  </ul>
                </div>
                
                            <div>
                              <h4 className="text-lg font-semibold mb-4">Company</h4>
                              <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                              <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Facebook</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Twitter</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Instagram</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </footer>
    )
}