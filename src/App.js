import React, { useState } from 'react';
import "./App.css" 
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">
          <img src='/mlsc.png' height={50} alt="logo" />
        </div>
      </div>
      
      <div className="login-card">
        <h1 className="page-title">Perfect CV</h1>
        <h2 className="section-title">Login</h2>
        
        <div>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          
          <button type="button" onClick={handleSubmit} className="login-button">LOGIN</button>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ onNavigate, onLogout }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      alert(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
    } else {
      alert('Please select a file first');
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">
          <img src='/mlsc.png' alt='igm' height={60}></img>
        </div>
        <button className="logout-button" onClick={onLogout}>⊗</button>
      </div>

      <div className="home-content-new">
        <div className="center-title">
          <h1 className="main-title">Perfect CV</h1>
        </div>
        <div className="sidebar">
          <button className="nav-button active">HOME</button>
          <button className="nav-button active" onClick={() => onNavigate('leaderboard')}>Leaderboard</button>
        </div>

        <div className="upload-card">
          <label className="file-label">Upload</label>
          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
            style={{ cursor: 'pointer' }}
          >
            <div className="upload-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="28" stroke="#ccc" strokeWidth="2" strokeDasharray="4 4"/>
                <path d="M30 20 L30 40 M20 30 L40 30" stroke="#999" strokeWidth="2"/>
              </svg>
            </div>
            <p className="upload-text">
              {selectedFile ? selectedFile.name : 'Hold & Pull files to Upload'}
            </p>
            <input 
              id="fileInput"
              type="file" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx"
            />
          </div>
          <input type="text" placeholder="OR Paste Link Here" className="link-input" />
          <button className="submit-button" onClick={handleSubmit}>Submit CV</button>
        </div>
      </div>
    </div>
  );
};

const LeaderboardPage = ({ onNavigate, onLogout }) => {
  const leaderboardData = [
    { rank: 1, name: 'J', score: 'xxx,xxx', ats: '1x,000' },
    { rank: 2, name: 'J', score: 'xxx,xxx', ats: '1x,000' },
    { rank: 3, name: 'K', score: 'xxx,xxx', ats: '1x,000' },
    { rank: 4, name: '', score: 'xxx,xxx', ats: '1x,000' },
    { rank: 5, name: '', score: 'xxx,xxx', ats: '1x,000' },
  ];

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon points="20,5 35,15 35,30 20,40 5,30 5,15" fill="#2c5f7f" />
            <text x="20" y="27" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">CV</text>
          </svg>
        </div>
        <button className="logout-button" onClick={onLogout}>⊗</button>
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <button className="back-button" onClick={() => onNavigate('home')}>← Back to Home</button>
          <h1 className="leaderboard-title">Leaderboard</h1>
        </div>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>ATS Score</th>
              <th>Features</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry) => (
              <tr key={entry.rank}>
                <td>
                  {entry.rank} {getMedalEmoji(entry.rank)}
                </td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
                <td>{entry.ats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');

  const handleLogin = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} onLogout={handleLogout} />}
      {currentPage === 'leaderboard' && <LeaderboardPage onNavigate={handleNavigate} onLogout={handleLogout} />}
    </div>
  );
};

export default App;