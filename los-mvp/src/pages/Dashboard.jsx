import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchApplications } from '../store/slices/applicationSlice';
import { logoutUser } from '../store/slices/authSlice';
import { APPLICATION_STATUS } from '../utils/constants';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: applications, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  // Role-based task filtering
  const getMyTasks = () => {
    switch (user.role) {
      case 'RM':
        // RM sees their own applications
        return applications.filter(app => app.ownerId === user.id);
      
      case 'Credit_Analyst':
        // Analyst sees applications that are submitted and need analysis
        return applications.filter(app =>
          app.status === APPLICATION_STATUS.SUBMITTED ||
          app.status === APPLICATION_STATUS.IN_REVIEW
        );
      
      case 'Approver':
        // Approver sees applications that have been analyzed and need approval
        return applications.filter(app =>
          app.status === APPLICATION_STATUS.IN_REVIEW
        );
      
      case 'Admin':
        // Admin sees all applications
        return applications;
      
      default:
        return [];
    }
  };

  const myTasks = getMyTasks();

  // Get task-specific counts for each role
  const getTaskCounts = () => {
    switch (user.role) {
      case 'RM':
        return {
          total: myTasks.length,
          draft: myTasks.filter(app => app.status === APPLICATION_STATUS.DRAFT).length,
          submitted: myTasks.filter(app => app.status === APPLICATION_STATUS.SUBMITTED).length,
          inReview: myTasks.filter(app => app.status === APPLICATION_STATUS.IN_REVIEW).length,
          approved: myTasks.filter(app => app.status === APPLICATION_STATUS.APPROVED).length,
        };
      
      case 'Credit_Analyst':
        return {
          total: myTasks.length,
          pending: myTasks.filter(app => app.status === APPLICATION_STATUS.SUBMITTED).length,
          analyzing: myTasks.filter(app => app.status === APPLICATION_STATUS.IN_REVIEW).length,
          completed: applications.filter(app =>
            app.status === APPLICATION_STATUS.APPROVED ||
            app.status === APPLICATION_STATUS.REJECTED
          ).length,
        };
      
      case 'Approver':
        return {
          total: myTasks.length,
          pending: myTasks.filter(app => app.status === APPLICATION_STATUS.IN_REVIEW).length,
          approved: applications.filter(app => app.status === APPLICATION_STATUS.APPROVED).length,
          rejected: applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length,
        };
      
      case 'Admin':
        return {
          total: applications.length,
          draft: applications.filter(app => app.status === APPLICATION_STATUS.DRAFT).length,
          inReview: applications.filter(app => app.status === APPLICATION_STATUS.IN_REVIEW).length,
          approved: applications.filter(app => app.status === APPLICATION_STATUS.APPROVED).length,
        };
      
      default:
        return { total: 0 };
    }
  };

  const taskCounts = getTaskCounts();

  // Get role-specific title
  const getTaskListTitle = () => {
    switch (user.role) {
      case 'RM':
        return 'My Applications';
      case 'Credit_Analyst':
        return 'Applications to Analyze';
      case 'Approver':
        return 'Applications Pending Approval';
      case 'Admin':
        return 'All Applications';
      default:
        return 'Applications';
    }
  };

  // Get role-specific empty message
  const getEmptyMessage = () => {
    switch (user.role) {
      case 'RM':
        return 'You have no applications yet.';
      case 'Credit_Analyst':
        return 'No applications pending analysis.';
      case 'Approver':
        return 'No applications pending approval.';
      case 'Admin':
        return 'No applications in the system.';
      default:
        return 'No applications found.';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Loan Origination System</h1>
          <p style={styles.subtitle}>Welcome, {user.name} ({user.role})</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Stats Cards - Role-based */}
      <div style={styles.statsGrid}>
        {user.role === 'RM' && (
          <>
            <div style={{...styles.statCard, ...styles.statCardBlue}}>
              <div style={styles.statNumber}>{taskCounts.total}</div>
              <div style={styles.statLabel}>My Applications</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardYellow}}>
              <div style={styles.statNumber}>{taskCounts.draft}</div>
              <div style={styles.statLabel}>Draft</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardOrange}}>
              <div style={styles.statNumber}>{taskCounts.submitted}</div>
              <div style={styles.statLabel}>Submitted</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardGreen}}>
              <div style={styles.statNumber}>{taskCounts.approved}</div>
              <div style={styles.statLabel}>Approved</div>
            </div>
          </>
        )}

        {user.role === 'Credit_Analyst' && (
          <>
            <div style={{...styles.statCard, ...styles.statCardBlue}}>
              <div style={styles.statNumber}>{taskCounts.total}</div>
              <div style={styles.statLabel}>My Tasks</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardOrange}}>
              <div style={styles.statNumber}>{taskCounts.pending}</div>
              <div style={styles.statLabel}>Pending Analysis</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardYellow}}>
              <div style={styles.statNumber}>{taskCounts.analyzing}</div>
              <div style={styles.statLabel}>In Analysis</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardGreen}}>
              <div style={styles.statNumber}>{taskCounts.completed}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </>
        )}

        {user.role === 'Approver' && (
          <>
            <div style={{...styles.statCard, ...styles.statCardBlue}}>
              <div style={styles.statNumber}>{taskCounts.total}</div>
              <div style={styles.statLabel}>Pending Approval</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardOrange}}>
              <div style={styles.statNumber}>{taskCounts.pending}</div>
              <div style={styles.statLabel}>Awaiting Decision</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardGreen}}>
              <div style={styles.statNumber}>{taskCounts.approved}</div>
              <div style={styles.statLabel}>Approved</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardRed}}>
              <div style={styles.statNumber}>{taskCounts.rejected}</div>
              <div style={styles.statLabel}>Rejected</div>
            </div>
          </>
        )}

        {user.role === 'Admin' && (
          <>
            <div style={{...styles.statCard, ...styles.statCardBlue}}>
              <div style={styles.statNumber}>{taskCounts.total}</div>
              <div style={styles.statLabel}>Total Applications</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardYellow}}>
              <div style={styles.statNumber}>{taskCounts.draft}</div>
              <div style={styles.statLabel}>Draft</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardOrange}}>
              <div style={styles.statNumber}>{taskCounts.inReview}</div>
              <div style={styles.statLabel}>In Review</div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardGreen}}>
              <div style={styles.statNumber}>{taskCounts.approved}</div>
              <div style={styles.statLabel}>Approved</div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions - Role-based */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {user.role === 'RM' && (
            <>
              <button style={styles.actionButton} onClick={() => alert('Create Application - Coming Soon!')}>
                <span style={styles.actionIcon}>➕</span>
                <span>Create New Application</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('My Applications - Coming Soon!')}>
                <span style={styles.actionIcon}>📋</span>
                <span>My Applications</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('Upload Documents - Coming Soon!')}>
                <span style={styles.actionIcon}>📄</span>
                <span>Upload Documents</span>
              </button>
            </>
          )}
          
          {user.role === 'Credit_Analyst' && (
            <>
              <button style={styles.actionButton} onClick={() => alert('Pending Analysis - Coming Soon!')}>
                <span style={styles.actionIcon}>⏳</span>
                <span>Pending Analysis</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('Run Agent Analysis - Coming Soon!')}>
                <span style={styles.actionIcon}>🤖</span>
                <span>Run Agent Analysis</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('Generate Memo - Coming Soon!')}>
                <span style={styles.actionIcon}>📝</span>
                <span>Generate Credit Memo</span>
              </button>
            </>
          )}
          
          {user.role === 'Approver' && (
            <>
              <button style={styles.actionButton} onClick={() => alert('Pending Approvals - Coming Soon!')}>
                <span style={styles.actionIcon}>⏳</span>
                <span>Pending Approvals</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('Review Applications - Coming Soon!')}>
                <span style={styles.actionIcon}>✅</span>
                <span>Review Applications</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('Approval History - Coming Soon!')}>
                <span style={styles.actionIcon}>📊</span>
                <span>Approval History</span>
              </button>
            </>
          )}
          
          {user.role === 'Admin' && (
            <>
              <button style={styles.actionButton} onClick={() => alert('All Applications - Coming Soon!')}>
                <span style={styles.actionIcon}>📋</span>
                <span>All Applications</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('User Management - Coming Soon!')}>
                <span style={styles.actionIcon}>👥</span>
                <span>User Management</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('Audit Logs - Coming Soon!')}>
                <span style={styles.actionIcon}>📜</span>
                <span>Audit Logs</span>
              </button>
              <button style={styles.actionButton} onClick={() => alert('System Settings - Coming Soon!')}>
                <span style={styles.actionIcon}>⚙️</span>
                <span>System Settings</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Role-based Task List */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{getTaskListTitle()}</h2>
        {loading ? (
          <div style={styles.loading}>Loading tasks...</div>
        ) : myTasks.length === 0 ? (
          <div style={styles.empty}>
            <p>{getEmptyMessage()}</p>
            {user.role === 'RM' && (
              <p style={styles.emptyHint}>Click "Create New Application" to get started!</p>
            )}
          </div>
        ) : (
          <div style={styles.table}>
            <table style={styles.tableElement}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Application ID</th>
                  <th style={styles.th}>Applicant Name</th>
                  <th style={styles.th}>Loan Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>
                    {user.role === 'RM' ? 'Created Date' : 'Submitted Date'}
                  </th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.slice(0, 10).map((app) => (
                  <tr key={app.id} style={styles.tableRow}>
                    <td style={styles.td}>{app.id}</td>
                    <td style={styles.td}>{app.applicantName || 'N/A'}</td>
                    <td style={styles.td}>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(app.loanAmount || 0)}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(app.status)
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(app.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td style={styles.td}>
                      {user.role === 'RM' && (
                        <button
                          style={styles.viewButton}
                          onClick={() => alert(`Edit Application ${app.id} - Coming Soon!`)}
                        >
                          Edit
                        </button>
                      )}
                      {user.role === 'Credit_Analyst' && (
                        <button
                          style={{...styles.viewButton, background: '#ff9800'}}
                          onClick={() => alert(`Analyze Application ${app.id} - Coming Soon!`)}
                        >
                          Analyze
                        </button>
                      )}
                      {user.role === 'Approver' && (
                        <button
                          style={{...styles.viewButton, background: '#4caf50'}}
                          onClick={() => alert(`Review Application ${app.id} - Coming Soon!`)}
                        >
                          Review
                        </button>
                      )}
                      {user.role === 'Admin' && (
                        <button
                          style={styles.viewButton}
                          onClick={() => alert(`View Application ${app.id} - Coming Soon!`)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Info */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Loan Origination System v0.1.0 | Demo Mode - No Backend API
        </p>
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  const styles = {
    [APPLICATION_STATUS.DRAFT]: { background: '#e3f2fd', color: '#1976d2' },
    [APPLICATION_STATUS.SUBMITTED]: { background: '#fff3e0', color: '#f57c00' },
    [APPLICATION_STATUS.IN_REVIEW]: { background: '#fce4ec', color: '#c2185b' },
    [APPLICATION_STATUS.APPROVED]: { background: '#e8f5e9', color: '#388e3c' },
    [APPLICATION_STATUS.REJECTED]: { background: '#ffebee', color: '#d32f2f' },
    [APPLICATION_STATUS.COMPLETED]: { background: '#f3e5f5', color: '#7b1fa2' },
  };
  return styles[status] || {};
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: '20px',
  },
  header: {
    background: 'white',
    padding: '20px 30px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    color: '#333',
  },
  subtitle: {
    margin: '5px 0 0 0',
    fontSize: '14px',
    color: '#666',
  },
  logoutButton: {
    padding: '10px 20px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statCardBlue: {
    borderTop: '4px solid #2196f3',
  },
  statCardYellow: {
    borderTop: '4px solid #ffc107',
  },
  statCardOrange: {
    borderTop: '4px solid #ff9800',
  },
  statCardGreen: {
    borderTop: '4px solid #4caf50',
  },
  statCardRed: {
    borderTop: '4px solid #f44336',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    textTransform: 'uppercase',
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#333',
    fontWeight: '600',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  actionButton: {
    padding: '20px',
    background: '#f5f5f5',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s',
  },
  actionIcon: {
    fontSize: '32px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  emptyHint: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#999',
  },
  table: {
    overflowX: 'auto',
  },
  tableElement: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    background: '#f5f5f5',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #e0e0e0',
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#666',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
  },
  viewButton: {
    padding: '6px 16px',
    background: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#999',
  },
  footerText: {
    margin: 0,
    fontSize: '12px',
  },
};

export default Dashboard;

// Made with Bob
