// CompanyList.js
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Users, Star, ChevronRight } from 'lucide-react';
import './companiesList.css';

const CompaniesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  
  const companies = [
    {
      id: 1,
      name: "TCS",
      logo: "T",
      location: "Multiple Locations",
      domain: "IT Services",
      openings: 150,
      rating: 4.2,
      skills: ["Java", "Python", "React"],
      package: "6-12 LPA"
    },
    {
      id: 2, 
      name: "Infosys",
      logo: "I",
      location: "Bangalore",
      domain: "Software Development",
      openings: 200,
      rating: 4.0,
      skills: ["JavaScript", "Angular", "Node.js"],
      package: "5-10 LPA"
    },
    {
      id: 3,
      name: "Wipro",
      logo: "W",
      location: "Hyderabad",
      domain: "IT Consulting",
      openings: 100,
      rating: 4.1,
      skills: ["Cloud", "DevOps", "AWS"],
      package: "7-14 LPA"
    },
    {
      id: 4,
      name: "Tech Mahindra",
      logo: "TM",
      location: "Pune",
      domain: "IT Services",
      openings: 80,
      rating: 3.9,
      skills: ["Full Stack", "API", "Database"],
      package: "6-11 LPA"
    }
  ];

  const domains = ['All', ...new Set(companies.map(company => company.domain))];

  const filteredCompanies = companies.filter(company =>
    (selectedDomain === 'All' || company.domain === selectedDomain) &&
    (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
     company.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="companies-container">
      <div className="header-section">
        <h1>Companies for Placement</h1>
        <p>Discover your dream company and kickstart your career</p>
      </div>
      
      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by company, location, or skills..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="domain-filters">
          {domains.map(domain => (
            <button
              key={domain}
              className={`domain-filter ${selectedDomain === domain ? 'active' : ''}`}
              onClick={() => setSelectedDomain(domain)}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      <div className="companies-grid">
        {filteredCompanies.map(company => (
          <div key={company.id} className="company-card">
            <div className="card-header">
              <div className="company-logo">{company.logo}</div>
              <div className="company-rating">
                <Star className="star-icon" size={16} fill="#FFD700" />
                <span>{company.rating}</span>
              </div>
            </div>
            
            <div className="company-info">
              <h2>{company.name}</h2>
              <div className="info-row">
                <MapPin size={16} />
                <span>{company.location}</span>
              </div>
              <div className="info-row">
                <Briefcase size={16} />
                <span>{company.domain}</span>
              </div>
              <div className="info-row">
                <Users size={16} />
                <span>{company.openings} Openings</span>
              </div>
            </div>
            
            <div className="package-section">
              <span className="package-label">Package:</span>
              <span className="package-value">{company.package}</span>
            </div>

            <div className="skills-section">
              {company.skills.map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
            
            <button className="view-details-btn">
              View Details
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesList;