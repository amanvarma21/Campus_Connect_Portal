import { useState, useEffect } from 'react';

export default function StudentPortal({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignments, setAssignments] = useState([]);

  // Fetch live assignments from Express API when component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/assignments')
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.error('Error fetching assignments:', err));
  }, []);

  const notices = [
    { id: 1, title: 'Mid-Term Exam Schedule Released', date: 'Sept 10, 2026', dept: 'SOCSE' },
    { id: 2, title: 'Hackathon Registration Open', date: 'Sept 20, 2026', dept: 'RVU Tech Club' },
    { id: 3, title: 'Library Timings Updated', date: 'Sept 25, 2026', dept: 'Administration' }
  ];

  const events = [
    { id: 1, title: 'Tech Fest 2026', date: 'Oct 05, 2026', venue: 'Main Auditorium' },
    { id: 2, title: 'Alumni Meet', date: 'Oct 12, 2026', venue: 'Conference Hall' },
    { id: 3, title: 'Sports Day', date: 'Oct 20, 2026', venue: 'Sports Ground' }
  ];

  // Submit assignment via API
  const handleAssignmentSubmit = (id) => {
    fetch(`http://localhost:5000/api/assignments/${id}/submit`, {
      method: 'PUT'
    })
      .then((res) => res.json())
      .then((updatedAssignment) => {
        setAssignments(
          assignments.map((item) =>
            item.id === id ? updatedAssignment : item
          )
        );
      })
      .catch((err) => console.error('Error submitting assignment:', err));
  };

  // Undo submission via API
  const handleUndo = (id) => {
    fetch(`http://localhost:5000/api/assignments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Pending' })
    })
      .then((res) => res.json())
      .then((updatedAssignment) => {
        setAssignments(
          assignments.map((item) =>
            item.id === id ? updatedAssignment : item
          )
        );
      })
      .catch((err) => console.error('Error undoing assignment:', err));
  };

  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;

  return (
    <div style={styles.container}>
      {/* Header View */}
      <header style={styles.header}>
        <div>
          <h2 style={{ margin: 0, color: '#F2A900', fontSize: '20px' }}>👨‍🎓 Student Portal View</h2>
          <span style={{ fontSize: '13px', color: '#e0e0e0' }}>Welcome, Abhimanyu Kintali (1RVU24CSE001)</span>
        </div>
        <button onClick={onBackToHome} style={styles.backBtn}>
          ← Back to Main Campus View
        </button>
      </header>

      {/* Tab Bar */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={activeTab === 'dashboard' ? styles.activeTab : styles.tab}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          style={activeTab === 'notices' ? styles.activeTab : styles.tab}
        >
          View Notices
        </button>

        <button
          onClick={() => setActiveTab('events')}
          style={activeTab === 'events' ? styles.activeTab : styles.tab}
        >
          View Events
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          style={activeTab === 'assignments' ? styles.activeTab : styles.tab}
        >
          Submit Assignments
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          style={activeTab === 'attendance' ? styles.activeTab : styles.tab}
        >
          View Attendance
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={activeTab === 'profile' ? styles.activeTab : styles.tab}
        >
          Update Profile
        </button>
      </div>

      {/* Content Area */}
      <div style={styles.contentCard}>
        {activeTab === 'dashboard' && (
          <DashboardView
            pendingCount={pendingCount}
            noticesCount={notices.length}
            eventsCount={events.length}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'notices' && <NoticesView notices={notices} />}

        {activeTab === 'events' && <EventsView events={events} />}

        {activeTab === 'assignments' && (
          <AssignmentsView
            assignments={assignments}
            onSubmit={handleAssignmentSubmit}
            onUndo={handleUndo}
          />
        )}

        {activeTab === 'attendance' && <AttendanceView />}

        {activeTab === 'profile' && <ProfileView />}
      </div>
    </div>
  );
}

// 1. Dashboard View
function DashboardView({ pendingCount, noticesCount, eventsCount, setActiveTab }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 6px 0', color: '#0A2240' }}>🎓 Student Academic Dashboard</h3>
      <p style={{ color: '#777', fontSize: '13px', margin: '0 0 20px 0' }}>
        B.Tech (Hons.) Computer Science • Batch 2024 • RV University
      </p>

      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <h2 style={{ color: '#0A2240', margin: '0 0 4px 0', fontSize: '28px' }}>86%</h2>
          <span style={styles.statLabel}>ATTENDANCE STATUS</span>
        </div>

        <div style={styles.statBox}>
          <h2 style={{ color: '#0A2240', margin: '0 0 4px 0', fontSize: '28px' }}>{pendingCount}</h2>
          <span style={styles.statLabel}>PENDING ASSIGNMENTS</span>
        </div>

        <div style={styles.statBox}>
          <h2 style={{ color: '#0A2240', margin: '0 0 4px 0', fontSize: '28px' }}>{noticesCount}</h2>
          <span style={styles.statLabel}>ACTIVE NOTICES</span>
        </div>

        <div style={styles.statBox}>
          <h2 style={{ color: '#0A2240', margin: '0 0 4px 0', fontSize: '28px' }}>{eventsCount}</h2>
          <span style={styles.statLabel}>UPCOMING EVENTS</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '22px', flexWrap: 'wrap' }}>
        <button
          style={styles.btnActionPrimary}
          onClick={() => setActiveTab('assignments')}
        >
          View Assignments ({pendingCount} Pending)
        </button>
        <button
          style={styles.btnActionSuccess}
          onClick={() => setActiveTab('attendance')}
        >
          Check Attendance
        </button>
        <button
          style={styles.btnActionPurple}
          onClick={() => setActiveTab('profile')}
        >
          View My Profile
        </button>
      </div>
    </div>
  );
}

// 2. Notices View
function NoticesView({ notices }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 15px 0', color: '#0A2240' }}>📢 Campus Notices</h3>
      <ul style={styles.list}>
        {notices.map((item) => (
          <li key={item.id} style={styles.listItem}>
            <div>
              <strong style={{ fontSize: '15px' }}>{item.title}</strong>
              <p style={styles.subText}>{item.dept} • {item.date}</p>
            </div>
            <button style={styles.btnSmall}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 3. Events View
function EventsView({ events }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 15px 0', color: '#0A2240' }}>🎉 Campus Events</h3>
      <ul style={styles.list}>
        {events.map((item) => (
          <li key={item.id} style={styles.listItem}>
            <div>
              <strong style={{ fontSize: '15px' }}>{item.title}</strong>
              <p style={styles.subText}>{item.venue} • {item.date}</p>
            </div>
            <button style={styles.btnSmall}>Register</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 4. Assignments View
function AssignmentsView({ assignments, onSubmit, onUndo }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 4px 0', color: '#0A2240' }}>📝 Submit Assignments</h3>
      <p style={{ color: '#777', fontSize: '13px', margin: '0 0 15px 0' }}>
        Coursework tasks, laboratory assignments, and project submissions
      </p>

      <ul style={styles.list}>
        {assignments.map((item) => (
          <li key={item.id} style={styles.listItem}>
            <div>
              <strong style={{ fontSize: '15px' }}>{item.title}</strong>
              <p style={styles.subText}>{item.subject} • Due: {item.dueDate}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {item.status === 'Submitted' ? (
                <>
                  <span style={styles.badgeSubmitted}>Submitted</span>
                  <button style={styles.btnUndo} onClick={() => onUndo(item.id)}>
                    Undo
                  </button>
                </>
              ) : (
                <button style={styles.btnSubmit} onClick={() => onSubmit(item.id)}>
                  Submit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 5. Attendance View
function AttendanceView() {
  return (
    <div>
      <h3 style={{ margin: '0 0 15px 0', color: '#0A2240' }}>📊 View Attendance</h3>
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>CS3301 - Full Stack</h4>
          <h2 style={{ color: '#0A2240', margin: 0 }}>88%</h2>
        </div>
        <div style={styles.statBox}>
          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>CS3302 - DBMS</h4>
          <h2 style={{ color: '#0A2240', margin: 0 }}>92%</h2>
        </div>
      </div>
    </div>
  );
}

// 6. Profile View
function ProfileView() {
  return (
    <div>
      <h3 style={{ margin: '0 0 15px 0', color: '#0A2240' }}>👤 Update Profile</h3>
      <div style={{ lineHeight: '2', color: '#333', fontSize: '14px' }}>
        <p><strong>Name:</strong> Abhimanyu Kintali</p>
        <p><strong>Student ID:</strong> 1RVU24CSE001</p>
        <p><strong>Department:</strong> School of Computer Science & Engineering (SOCSE)</p>
        <p><strong>Course:</strong> B.Tech (Hons.) Computer Science</p>
        <p><strong>Status:</strong> Active Enrolled</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '30px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A2240',
    padding: '16px 22px',
    borderRadius: '8px 8px 0 0',
    color: '#fff'
  },
  backBtn: {
    backgroundColor: '#F2A900',
    border: 'none',
    padding: '8px 14px',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#0A2240',
    fontSize: '12px'
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#e6ebf1',
    borderBottom: '2px solid #0A2240',
    overflowX: 'auto'
  },
  tab: {
    flex: 1,
    padding: '12px 10px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#495057',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  activeTab: {
    flex: 1,
    padding: '12px 10px',
    border: 'none',
    backgroundColor: '#ffffff',
    color: '#0A2240',
    fontWeight: 'bold',
    borderTop: '3px solid #0A2240',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  contentCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    minHeight: '260px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '14px'
  },
  statBox: {
    border: '1px solid #e0e6ed',
    padding: '16px',
    borderRadius: '6px',
    textAlign: 'center',
    backgroundColor: '#fafbfc'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#6c757d',
    letterSpacing: '0.5px'
  },
  btnActionPrimary: {
    backgroundColor: '#0A2240',
    color: '#fff',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px'
  },
  btnActionSuccess: {
    backgroundColor: '#2e7d32',
    color: '#fff',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px'
  },
  btnActionPurple: {
    backgroundColor: '#6a1b9a',
    color: '#fff',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 10px',
    borderBottom: '1px solid #f0f0f0'
  },
  subText: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#666'
  },
  btnSmall: {
    backgroundColor: '#0A2240',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  btnSubmit: {
    backgroundColor: '#0A2240',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  btnUndo: {
    backgroundColor: '#0A2240',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  badgeSubmitted: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};
