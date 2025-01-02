import React, { useState } from 'react';
import { Bell, Send, Users, Book, CreditCard, Calendar, MessageCircle, Gift } from 'lucide-react';
import './sms.css';

const SMS = () => {
  const [selectedOption, setSelectedOption] = useState('manual');
  
  const menuItems = [
    { icon: <Send className="w-5 h-5" />, title: 'Manual/Auto SMS', desc: 'Send manual or automated messages' },
    { icon: <Gift className="w-5 h-5" />, title: 'Birthday Alerts', desc: 'Send birthday wishes automatically' },
    { icon: <Users className="w-5 h-5" />, title: 'Attendance Alerts', desc: 'Notify about attendance status' },
    { icon: <CreditCard className="w-5 h-5" />, title: 'Fees Alerts', desc: 'Send fee payment reminders' },
    { icon: <Book className="w-5 h-5" />, title: 'Exam Alerts', desc: 'Share exam schedules and results' },
    { icon: <Bell className="w-5 h-5" />, title: 'Emergency Alerts', desc: 'Send urgent notifications' },
    { icon: <MessageCircle className="w-5 h-5" />, title: 'Custom Messages', desc: 'Create personalized messages' }
  ];

  return (
    <div className="sms-container">
      <div className="main-container">
        <div className="header">
          <Calendar size={32} />
          <h1>SMS & WhatsApp Alert System</h1>
        </div>

        <div className="card-grid">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="feature-card fade-in"
              onClick={() => setSelectedOption(item.title)}
            >
              <div className="card-header">
                <div className="icon-container">
                  {item.icon}
                </div>
                <div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="composer-section">
          <h2 className="composer-title">Message Composer</h2>
          
          <div className="form-group">
            <label className="form-label">Recipients</label>
            <select className="form-select">
              <option>Select Recipients</option>
              <option>All Students</option>
              <option>Specific Class</option>
              <option>Custom Group</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Message Type</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" /> SMS
              </label>
              <label className="checkbox-label">
                <input type="checkbox" /> WhatsApp
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message Content</label>
            <textarea 
              className="textarea"
              placeholder="Type your message here..."
            />
          </div>

          <button className="submit-button">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMS;