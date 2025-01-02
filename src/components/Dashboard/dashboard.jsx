import React, { useState } from 'react';
import { 
  Users, GraduationCap, IndianRupee, BookOpen, Calendar, 
  UserCheck, FileText, Phone, Mail, Award, Bell, Building,
  Briefcase, ClipboardList, MessageSquare, TrendingUp,
  Clock, CheckCircle, AlertCircle, Search, Menu, ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './dashboard.css';

const MetricCard = ({ icon: Icon, title, value, change, chart = [], colorClass }) => {
  const data = chart.map((val, i) => ({ value: val, index: i }));
  
  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-card-header">
        <div className="metric-icon">
          {Icon && <Icon />}
        </div>
        <div className="trend-indicator">
          <TrendingUp className="trend-icon" />
        </div>
      </div>
      
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-value-container">
          <span className="metric-value">{value}</span>
          {change && (
            <span className={`metric-change ${change.includes('+') ? 'positive' : 'negative'}`}>
              {change}
            </span>
          )}
        </div>
      </div>
      
      {chart.length > 0 && (
        <div className="metric-chart">
          <LineChart width={120} height={48} data={data}>
            <Line type="monotone" dataKey="value" stroke="currentColor" strokeWidth={2} dot={false} />
          </LineChart>
        </div>
      )}
    </div>
  );
};

const ActionCard = ({ title, items }) => (
  <div className="action-card">
    <h3 className="action-card-title">{title}</h3>
    <div className="action-items">
      {items.map((item, index) => (
        <div key={index} className="action-item">
          <div className="action-icon">{item.icon}</div>
          <div className="action-details">
            <p className="action-item-title">{item.title}</p>
            <p className="action-item-description">{item.description}</p>
          </div>
          <ChevronDown className="action-arrow" />
        </div>
      ))}
    </div>
  </div>
);

const NotificationItem = ({ icon: Icon, title, time, type }) => (
  <div className={`notification-item ${type}`}>
    <div className="notification-icon">
      <Icon />
    </div>
    <div className="notification-content">
      <p className="notification-title">{title}</p>
      <p className="notification-time">{time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sampleChartData = [75, 82, 78, 85, 80, 85, 88, 85];
  
  const enquiryData = [
    { month: 'Aug', value: 45, fees: 82000 },
    { month: 'Sep', value: 52, fees: 95000 },
    { month: 'Oct', value: 49, fees: 88000 },
    { month: 'Nov', value: 62, fees: 105000 },
    { month: 'Dec', value: 58, fees: 98000 }
  ];

  const pieData = [
    { name: 'Placed', value: 85 },
    { name: 'Process', value: 15 }
  ];

  const COLORS = ['#6366f1', '#e2e8f0'];

  return (
    <div className="dashboard-container">

      <div className="dashboard-content">
        {/* Top Metrics */}
        <div className="metrics-grid">
          <MetricCard 
            icon={Users}
            title="Total Students"
            value="1,234"
            change="↗ 12%"
            chart={sampleChartData}
            colorClass="purple-gradient"
          />
          <MetricCard 
            icon={UserCheck}
            title="New Enquiries"
            value="48"
            change="↗ 8.2%"
            chart={sampleChartData}
            colorClass="blue-gradient"
          />
          <MetricCard 
            icon={IndianRupee}
            title="Fee Collection"
            value="₹8.2L"
            change="↗ 15.3%"
            chart={sampleChartData}
            colorClass="green-gradient"
          />
          <MetricCard 
            icon={Award}
            title="Placements"
            value="92%"
            change="↗ 5.7%"
            chart={sampleChartData}
            colorClass="orange-gradient"
          />
        </div>

        <div className="dashboard-grid">
          {/* Main Charts */}
          <div className="main-charts">
            <div className="chart-card">
              <div className="chart-header">
                <h2>Enquiry & Fee Collection Trends</h2>
                <select className="chart-select">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <LineChart width={800} height={300} data={enquiryData} className="main-line-chart">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} name="Enquiries" />
                <Line type="monotone" dataKey="fees" stroke="#10b981" strokeWidth={2} name="Fees (₹)" />
              </LineChart>
            </div>

            {/* Quick Actions */}
            <ActionCard
              title="Quick Actions"
              items={[
                {
                  icon: <FileText className="action-icon-svg" />,
                  title: "New Student Registration",
                  description: "Register a new student into the system"
                },
                {
                  icon: <Phone className="action-icon-svg" />,
                  title: "Record New Enquiry",
                  description: "Add a new student enquiry"
                },
                {
                  icon: <IndianRupee className="action-icon-svg" />,
                  title: "Fee Collection",
                  description: "Record new fee payment"
                }
              ]}
            />
          </div>

          {/* Right Sidebar */}
          <div className="dashboard-sidebar">
            {/* Placement Stats */}
            <div className="stat-card">
              <h3>Placement Statistics</h3>
              <div className="pie-chart-container">
                <PieChart width={200} height={200}>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="pie-stats">
                  <div className="stat-item">
                    <span className="stat-dot placed"></span>
                    <span>Placed: 85%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-dot process"></span>
                    <span>In Process: 15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="activities-card">
              <h3>Recent Activities</h3>
              <div className="activities-list">
                <NotificationItem 
                  icon={UserCheck}
                  title="New student enrollment completed"
                  time="5 mins ago"
                  type="success"
                />
                <NotificationItem 
                  icon={IndianRupee}
                  title="Fee payment received"
                  time="15 mins ago"
                  type="info"
                />
                <NotificationItem 
                  icon={AlertCircle}
                  title="Follow-up reminder: John Doe"
                  time="1 hour ago"
                  type="warning"
                />
                <NotificationItem 
                  icon={CheckCircle}
                  title="Batch allocation completed"
                  time="2 hours ago"
                  type="success"
                />
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="events-card">
              <h3>Upcoming Events</h3>
              <div className="events-list">
                {[
                  { title: "Placement Drive", time: "Tomorrow, 10:00 AM" },
                  { title: "Parent Meeting", time: "Dec 28, 11:30 AM" },
                  { title: "New Batch Start", time: "Jan 2, 9:00 AM" }
                ].map((event, index) => (
                  <div key={index} className="event-item">
                    <Calendar className="event-icon" />
                    <div className="event-details">
                      <p className="event-title">{event.title}</p>
                      <p className="event-time">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;