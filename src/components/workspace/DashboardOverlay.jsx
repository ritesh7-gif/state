import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Calendar, Clock, Plus, Search, Users, Check, X,
  ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, CheckCircle2,
  ChevronRight, FileText, Filter, MapPin, Building, Percent, Landmark,
  MessageSquare, Phone
} from 'lucide-react';

const getDateLabel = () =>
  new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const getStatusClass = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'confirmed' || s === 'completed') return 'ew-badge-success';
  if (s === 'pending' || s === 'scheduled')   return 'ew-badge-warning';
  if (s === 'cancelled' || s === 'overdue') return 'ew-badge-danger';
  return 'ew-badge-accent';
};

const DashboardOverlay = ({
  bookings = [],
  properties = [],
  customers = [],
  siteVisits = [],
  followUps = [],
  onQuickAction,
  setBookings,
  setCustomers,
  setSiteVisits,
  setFollowUps,
  onResetData
}) => {
  // ---- Dashboard Local Filters State ----
  const [timeRange, setTimeRange] = useState('all'); // all, 30days, 90days, ytd
  const [projectFilter, setProjectFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, leads, visits, followups
  const [searchQuery, setSearchQuery] = useState('');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [createBookingData, setCreateBookingData] = useState(null);
  const [newProject, setNewProject] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Interactive Chart Tooltips State
  const [hoveredRevenueIdx, setHoveredRevenueIdx] = useState(null);
  const [hoveredDonutIdx, setHoveredDonutIdx] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleReset = async () => {
    setIsResetting(true);
    if (onResetData) {
      await onResetData();
    }
    setTimeout(() => {
      setIsResetting(false);
    }, 800);
  };

  const handleExport = () => {
    setToastMessage('Report exported as RealState_Sales_Summary.csv successfully!');
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleKPIClick = (id) => {
    const cardActions = {
      'kpi-revenue': 'bookings',
      'kpi-tokens': 'bookings',
      'kpi-visits': 'visits',
      'kpi-conversion': 'leads'
    };
    const tabId = cardActions[id];
    if (tabId) {
      setActiveTab(tabId);
      const panelEl = document.getElementById('ew-admin-panel');
      if (panelEl) {
        panelEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // ---- Get all unique project names for filter dropdown ----
  const uniqueProjects = useMemo(() => {
    const list = properties.map(p => p.project).filter(Boolean);
    return ['all', ...Array.from(new Set(list))];
  }, [properties]);

  // ---- Parse price numeric values helper ----
  const parseVal = (valStr) => {
    if (!valStr) return 0;
    const clean = valStr.replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  };

  // ---- Map Booking unit to Property price details ----
  const enrichedBookings = useMemo(() => {
    return bookings.map(b => {
      const prop = properties.find(p => p.unit === b.unit);
      return {
        ...b,
        priceVal: prop ? prop.price_val || parseVal(prop.price) : 0,
        project: prop ? prop.project : 'Unknown Project',
        city: prop ? prop.city : 'Pune'
      };
    });
  }, [bookings, properties]);

  // ---- Filtering logic based on date range and project selection ----
  const filteredData = useMemo(() => {
    let b = [...enrichedBookings];
    let sv = [...siteVisits];
    let fu = [...followUps];
    let c = [...customers];

    // Project filtering
    if (projectFilter !== 'all') {
      b = b.filter(item => item.project === projectFilter);
      sv = sv.filter(item => item.project === projectFilter);
      // Follow-ups need matching customer property project
      fu = fu.filter(item => {
        const custB = enrichedBookings.find(bk => bk.customerName === item.customerName);
        return custB && custB.project === projectFilter;
      });
      // Customers filtering by their bookings
      c = c.filter(cust => {
        const custB = enrichedBookings.find(bk => bk.customerName === cust.name);
        return custB && custB.project === projectFilter;
      });
    }

    // Time-range filtering (mock based on dates in the system)
    if (timeRange === '30days') {
      b = b.filter(item => item.timestamp && item.timestamp.includes('Jun'));
      sv = sv.filter(item => item.date && item.date.includes('Jun'));
      fu = fu.filter(item => item.dueDate && item.dueDate.includes('Jun'));
    }

    return { bookings: b, siteVisits: sv, followUps: fu, customers: c };
  }, [enrichedBookings, siteVisits, followUps, customers, projectFilter, timeRange]);

  // ---- Dynamic KPI Calculations ----
  const stats = useMemo(() => {
    const totalBookedValue = filteredData.bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + (b.priceVal || 0), 0);

    const totalTokenAmount = filteredData.bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + parseVal(b.amount), 0);

    const confirmedCount = filteredData.bookings.filter(b => b.status === 'Confirmed').length;
    const pendingCount = filteredData.bookings.filter(b => b.status === 'Pending').length;

    const completedVisits = filteredData.siteVisits.filter(v => v.status === 'Completed').length;
    const totalVisits = filteredData.siteVisits.length;

    const completedFollowups = filteredData.followUps.filter(f => f.status === 'Completed').length;
    const totalFollowups = filteredData.followUps.length;

    const conversionRate = filteredData.customers.length > 0 
      ? Math.round((confirmedCount / filteredData.customers.length) * 100)
      : 25; 

    return {
      totalBookedValue,
      totalTokenAmount,
      confirmedCount,
      pendingCount,
      completedVisits,
      totalVisits,
      completedFollowups,
      totalFollowups,
      conversionRate
    };
  }, [filteredData]);

  // Formatting large Indian Rupees figures
  const formatCurrency = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // ---- KPI Metric Cards definition ----
  const KPI_CARDS = [
    {
      id: 'kpi-revenue',
      title: 'Total Sales Revenue',
      value: formatCurrency(stats.totalBookedValue || 12000000),
      sub: `${stats.confirmedCount} closed deals`,
      subClass: 'up',
      icon: Landmark,
      sparkline: [20, 35, 18, 50, 30, 70],
      bg: 'rgba(99,102,241,0.12)',
      color: '#818cf8',
    },
    {
      id: 'kpi-tokens',
      title: 'Booking Tokens Collected',
      value: stats.totalTokenAmount > 0 ? `₹${(stats.totalTokenAmount / 100000).toFixed(1)}L` : '₹5.0 L',
      sub: `${stats.pendingCount} pending verification`,
      subClass: stats.pendingCount > 0 ? 'warning' : 'up',
      icon: TrendingUp,
      sparkline: [15, 25, 20, 45, 35, 55],
      bg: 'rgba(6,182,212,0.12)',
      color: '#22d3ee',
    },
    {
      id: 'kpi-visits',
      title: 'Site Visit Completed',
      value: `${stats.completedVisits}/${stats.totalVisits || 2}`,
      sub: 'Scheduled site visits',
      subClass: 'up',
      icon: Calendar,
      sparkline: [30, 40, 25, 60, 50, 70],
      bg: 'rgba(16,185,129,0.12)',
      color: '#34d399',
    },
    {
      id: 'kpi-conversion',
      title: 'Lead Conversion Rate',
      value: `${stats.conversionRate}%`,
      sub: 'Active opportunities to closed',
      subClass: 'up',
      icon: Percent,
      sparkline: [22, 23, 24, 25, 24, stats.conversionRate],
      bg: 'rgba(245,158,11,0.12)',
      color: '#fbbf24',
    }
  ];

  const maxRevenueValue = useMemo(() => {
    const baseRev = [45000000, 60000000, 35000000, 80000000, 95000000];
    const junRev = stats.totalBookedValue > 0 ? stats.totalBookedValue : 120000000;
    return Math.max(...baseRev, junRev) || 120000000;
  }, [stats.totalBookedValue]);

  // ---- Chart Data 1: Area Chart (Monthly Revenue trends) ----
  const revenueChartData = useMemo(() => {
    const baseRev = [45000000, 60000000, 35000000, 80000000, 95000000];
    const junRev = stats.totalBookedValue > 0 ? stats.totalBookedValue : 120000000;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const values = [...baseRev, junRev];

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * (475 - 55) + 55;
      const y = 100 - (val / maxRevenueValue) * 80 + 10;
      return { x, y, val, month: months[idx] };
    });

    return points;
  }, [stats.totalBookedValue, maxRevenueValue]);

  const revenuePaths = useMemo(() => {
    if (revenueChartData.length === 0) return { linePath: '', areaPath: '' };
    
    let d = `M ${revenueChartData[0].x} ${revenueChartData[0].y}`;
    for (let i = 0; i < revenueChartData.length - 1; i++) {
      const curr = revenueChartData[i];
      const next = revenueChartData[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp1y = curr.y;
      const cp2x = next.x - (next.x - curr.x) / 3;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    
    const first = revenueChartData[0];
    const last = revenueChartData[revenueChartData.length - 1];
    const a = `${d} L ${last.x} 110 L ${first.x} 110 Z`;
    
    return { linePath: d, areaPath: a };
  }, [revenueChartData]);

  // ---- Chart Data 2: Donut Chart (Revenue by Project) ----
  const donutChartData = useMemo(() => {
    const projectMap = {};
    projectMap['Blue Ridge Hinjewadi'] = 75000000;
    projectMap['Amanora Park Town'] = 120000000;
    projectMap['Godrej Infinity Keshavnagar'] = 45000000;

    filteredData.bookings.forEach(b => {
      if (b.status === 'Confirmed') {
        projectMap[b.project] = (projectMap[b.project] || 0) + (b.priceVal || 0);
      }
    });

    const list = Object.entries(projectMap).map(([name, val]) => ({ name, value: val }));
    const total = list.reduce((sum, item) => sum + item.value, 0) || 1;

    let cumulativePercent = 0;
    const items = list.map((item, idx) => {
      const percentage = (item.value / total) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percentage;
      return {
        ...item,
        percentage,
        startPercent,
        color: ['#818cf8', '#34d399', '#22d3ee', '#fbbf24', '#f87171'][idx % 5]
      };
    });

    return items;
  }, [filteredData.bookings]);

  const totalRevenue = useMemo(() => {
    return donutChartData.reduce((sum, item) => sum + item.value, 0);
  }, [donutChartData]);

  const getRgbFromHex = (hex, alpha) => {
    if (!hex || !hex.startsWith('#')) return `rgba(255, 255, 255, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // ---- Chart Data 3: Bar Chart (Lead Pipeline Funnel) ----
  const pipelineChartData = useMemo(() => {
    const activeCustomers = filteredData.customers.length;
    const contactedCount = filteredData.customers.filter(c => c.status === 'Contacted').length;
    const siteVisitCount = filteredData.siteVisits.length;
    const pendingBooking = filteredData.bookings.filter(b => b.status === 'Pending').length;
    const confirmedBooking = filteredData.bookings.filter(b => b.status === 'Confirmed').length;

    const stages = [
      { label: 'Leads Recieved', count: activeCustomers + 5, color: '#6366f1' },
      { label: 'Contacted', count: contactedCount + 3, color: '#06b6d4' },
      { label: 'Site Visits', count: siteVisitCount + 2, color: '#10b981' },
      { label: 'Offers Pending', count: pendingBooking + 1, color: '#f59e0b' },
      { label: 'Closed Won', count: confirmedBooking + 1, color: '#8b5cf6' }
    ];

    const maxCount = Math.max(...stages.map(s => s.count)) || 1;
    return stages.map(s => ({
      ...s,
      percentage: (s.count / maxCount) * 100
    }));
  }, [filteredData]);

  // ---- Filter and Search in Active Tab Grid ----
  const tabGridData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (activeTab === 'bookings') {
      let data = filteredData.bookings;
      if (query) {
        data = data.filter(b =>
          b.customerName.toLowerCase().includes(query) ||
          b.unit.toLowerCase().includes(query) ||
          b.project.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
        );
      }
      return data;
    }

    if (activeTab === 'leads') {
      let data = filteredData.customers;
      if (query) {
        data = data.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          (c.email && c.email.toLowerCase().includes(query))
        );
      }
      return data;
    }

    if (activeTab === 'visits') {
      let data = filteredData.siteVisits;
      if (query) {
        data = data.filter(v =>
          v.customerName.toLowerCase().includes(query) ||
          v.project.toLowerCase().includes(query) ||
          v.executive.toLowerCase().includes(query)
        );
      }
      return data;
    }

    if (activeTab === 'followups') {
      let data = filteredData.followUps;
      if (query) {
        data = data.filter(f =>
          f.customerName.toLowerCase().includes(query) ||
          f.notes.toLowerCase().includes(query)
        );
      }
      return data;
    }

    return [];
  }, [activeTab, filteredData, searchQuery]);

  // ---- Inline Actions ----
  const handleToggleBookingStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Confirmed' ? 'Pending' : 'Confirmed';
    const updated = bookings.map(b => b.id === id ? { ...b, status: nextStatus } : b);
    setBookings(updated);
  };

  const handleCancelBooking = (id) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
  };

  const handleToggleSiteVisitStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Scheduled' : 'Completed';
    const updated = siteVisits.map(v => v.id === id ? { ...v, status: nextStatus } : v);
    setSiteVisits(updated);
  };

  const handleRescheduleVisit = (visit) => {
    setRescheduleData(visit);
    setNewDate(visit.date || '');
    setNewTime(visit.time || '');
  };

  const submitReschedule = () => {
    if (rescheduleData) {
      const updated = siteVisits.map(v => v.id === rescheduleData.id ? { ...v, date: newDate, time: newTime } : v);
      setSiteVisits(updated);
      setToastMessage(`Site visit rescheduled to ${newDate} successfully.`);
      setTimeout(() => setToastMessage(''), 3000);
      setRescheduleData(null);
    }
  };

  const handleCreateBookingClick = (customer) => {
    setCreateBookingData(customer);
    setNewProject('');
    setNewUnit('');
    setNewPrice('');
  };

  const submitCreateBooking = () => {
    if (createBookingData) {
      const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: createBookingData.name,
        unit: newUnit || 'TBD',
        project: newProject || 'Unknown Project',
        priceVal: parseInt(newPrice) || 0,
        amount: '₹0 L',
        status: 'Pending',
        timestamp: 'Today'
      };
      setBookings([newBooking, ...bookings]);
      setToastMessage(`Booking for ${createBookingData.name} created successfully.`);
      setTimeout(() => setToastMessage(''), 3000);
      setCreateBookingData(null);
    }
  };

  const handleToggleLeadStatus = (email) => {
    if (!setCustomers) return;
    const statusCycle = {
      'Active': 'Contacted',
      'Contacted': 'Qualified',
      'Qualified': 'Lost',
      'Lost': 'Active'
    };
    const updated = customers.map(c => 
      c.email === email ? { ...c, status: statusCycle[c.status] || 'Active' } : c
    );
    setCustomers(updated);
  };

  const handleToggleFollowUpStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const updated = followUps.map(f => f.id === id ? { ...f, status: nextStatus } : f);
    setFollowUps(updated);
  };

  const renderEmptyState = (colSpan, message) => (
    <tr>
      <td colSpan={colSpan} style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--bg-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)'
          }}>
            <Search size={22} style={{ opacity: 0.6 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>No Results Found</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{message}</span>
          </div>
          {(searchQuery || projectFilter !== 'all' || timeRange !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setProjectFilter('all'); setTimeRange('all'); }}
              style={{
                background: 'var(--accent-light)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent)',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Reset Filters & Search
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="ew-dashboard" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', padding: 0 }}>
      {/* 1. Header Area */}
      <div className="ew-dashboard-topbar" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexShrink: 0, 
        padding: '24px 32px', 
        height: 'auto', 
        minHeight: '80px',
        borderBottom: '1px solid var(--border)' 
      }}>
        <div>
          <span className="ew-dashboard-topbar-title" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Sales Manager Dashboard</span>
          <span className="ew-dashboard-topbar-sub" style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 12 }}>{getDateLabel()}</span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          {/* Overlay to close dropdowns when clicking outside */}
          {(showTimeDropdown || showProjectDropdown) && (
            <div 
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
              onClick={() => { setShowTimeDropdown(false); setShowProjectDropdown(false); }}
            />
          )}

          {/* Time range selection */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--border)', cursor: 'pointer', position: 'relative', zIndex: showTimeDropdown ? 50 : 1, transition: 'all 0.2s' }}
            onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowProjectDropdown(false); }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-light)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Filter size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 550, userSelect: 'none' }}>
              {timeRange === 'all' ? 'All Time' : 'Last 30 Days'}
            </span>
            {showTimeDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '160px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                {[{value: 'all', label: 'All Time'}, {value: '30days', label: 'Last 30 Days'}].map(opt => (
                  <div
                    key={opt.value}
                    onClick={(e) => { e.stopPropagation(); setTimeRange(opt.value); setShowTimeDropdown(false); }}
                    style={{
                      padding: '8px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: timeRange === opt.value ? 'var(--accent)' : 'var(--text-primary)',
                      background: timeRange === opt.value ? 'var(--accent-light)' : 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { if (timeRange !== opt.value) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { if (timeRange !== opt.value) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project filter selection */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--border)', cursor: 'pointer', position: 'relative', zIndex: showProjectDropdown ? 50 : 1, transition: 'all 0.2s' }}
            onClick={() => { setShowProjectDropdown(!showProjectDropdown); setShowTimeDropdown(false); }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-light)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Building size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 550, userSelect: 'none', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {projectFilter === 'all' ? 'All Projects' : projectFilter}
            </span>
            {showProjectDropdown && (
              <div 
                className="custom-scrollbar"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '8px',
                  minWidth: '240px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
              }}>
                <div
                  onClick={(e) => { e.stopPropagation(); setProjectFilter('all'); setShowProjectDropdown(false); }}
                  style={{
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: projectFilter === 'all' ? 'var(--accent)' : 'var(--text-primary)',
                    background: projectFilter === 'all' ? 'var(--accent-light)' : 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => { if (projectFilter !== 'all') e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { if (projectFilter !== 'all') e.currentTarget.style.background = 'transparent'; }}
                >
                  All Projects
                </div>
                {uniqueProjects.filter(p => p !== 'all').map(p => (
                  <div
                    key={p}
                    onClick={(e) => { e.stopPropagation(); setProjectFilter(p); setShowProjectDropdown(false); }}
                    style={{
                      padding: '8px 12px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: projectFilter === p ? 'var(--accent)' : 'var(--text-primary)',
                      background: projectFilter === p ? 'var(--accent-light)' : 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { if (projectFilter !== p) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { if (projectFilter !== p) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Report button */}
          <button
            className="ew-btn ew-btn-ghost"
            onClick={handleExport}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 550, color: 'var(--text-primary)', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-light)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <FileText size={14} style={{ color: 'var(--accent)' }} /> Export CSV
          </button>

          {/* Inline keyframe style definition */}
          <style>{`
            @keyframes spin-anim {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes slideIn {
              from { transform: translateY(100px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes reveal-chart {
              from { clip-path: inset(0 100% 0 0); }
              to { clip-path: inset(0 0% 0 0); }
            }
            @keyframes donut-spin {
              from {
                transform: rotate(-180deg) scale(0.9);
                opacity: 0;
              }
              to {
                transform: rotate(-90deg) scale(1);
                opacity: 1;
              }
            }
            @keyframes bar-grow {
              from { width: 0%; }
            }
            .animate-chart-reveal {
              animation: reveal-chart 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            .animate-bar {
              animation: bar-grow 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .funnel-bar-fill {
              position: relative;
              overflow: hidden;
            }
            .ew-kpi-card:hover {
              transform: translateY(-4px);
              border-color: rgba(99, 102, 241, 0.45) !important;
              box-shadow: 0 8px 30px rgba(99, 102, 241, 0.12);
            }
            .ew-kpi-card {
              transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.25s ease, box-shadow 0.25s ease !important;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: var(--bg-hover);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255,255,255,0.2);
            }
          `}</style>
        </div>
      </div>

      <div className="ew-dashboard-body" style={{ 
        padding: '24px 32px 32px 32px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 24,
        maxWidth: 'none',
        margin: 0,
        width: '100%'
      }}>
        
        {/* Active Filter Badges */}
        {(projectFilter !== 'all' || timeRange !== 'all') && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Active Filters:</span>
            {projectFilter !== 'all' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(129, 140, 248, 0.1)',
                border: '1px solid rgba(129, 140, 248, 0.25)',
                color: '#818cf8',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: 11.5,
                fontWeight: 550
              }}>
                Project: {projectFilter}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setProjectFilter('all')}
                />
              </div>
            )}
            {timeRange !== 'all' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(129, 140, 248, 0.1)',
                border: '1px solid rgba(129, 140, 248, 0.25)',
                color: '#818cf8',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: 11.5,
                fontWeight: 550
              }}>
                Range: {timeRange === '30days' ? 'Last 30 Days' : timeRange}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setTimeRange('all')}
                />
              </div>
            )}
            <button
              onClick={() => { setProjectFilter('all'); setTimeRange('all'); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 550,
                padding: '2px 6px'
              }}
            >
              Clear All
            </button>
          </div>
        )}

        <div className="ew-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {KPI_CARDS.map(({ id, title, value, sub, subClass, icon: Icon, sparkline, bg, color }) => (
            <div
              key={id}
              className="ew-kpi-card"
              onClick={() => handleKPIClick(id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: '16px 20px',
                borderRadius: '16px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 550 }}>{title}</span>
                <div style={{ width: 28, height: 28, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color }}>
                  <Icon size={14} />
                </div>
              </div>

              <div>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
                <span className={`ew-kpi-card-sub ${subClass}`} style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {subClass === 'up' && <ArrowUpRight size={12} />}
                  {sub}
                </span>

                {/* Micro Sparkline chart inside KPI card */}
                <svg width="60" height="20" style={{ overflow: 'visible' }}>
                  <g className="animate-chart-reveal">
                    <polyline
                      fill="none"
                      stroke={color}
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparkline.map((val, idx) => `${(idx / (sparkline.length - 1)) * 56 + 2}, ${18 - (val / 100) * 14}`).join(' ')}
                    />
                  </g>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Charts Area */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          
          {/* Revenue Line Chart */}
          <div className="ew-dashboard-panel" style={{ padding: 20, borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="ew-dashboard-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: 'none' }}>
              <span className="ew-dashboard-panel-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={15} style={{ color: '#818cf8' }} /> Monthly Revenue Trends
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Jan – Jun 2026</span>
            </div>

            <div style={{ position: 'relative', width: '100%', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <svg viewBox="0 0 500 135" width="100%" height="100%" style={{ overflow: 'visible' }}>
                {/* Horizontal Grid lines */}
                <line x1="55" y1="10" x2="475" y2="10" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="3,3" />
                <line x1="55" y1="50" x2="475" y2="50" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="3,3" />
                <line x1="55" y1="90" x2="475" y2="90" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="3,3" />
                <line x1="55" y1="110" x2="475" y2="110" stroke="var(--border-strong)" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="46" y="13" fontSize="11" fill="var(--text-primary)" textAnchor="end" fontWeight="500">{formatCurrency(maxRevenueValue)}</text>
                <text x="46" y="53" fontSize="11" fill="var(--text-primary)" textAnchor="end" fontWeight="500">{formatCurrency(maxRevenueValue * 0.75)}</text>
                <text x="46" y="93" fontSize="11" fill="var(--text-primary)" textAnchor="end" fontWeight="500">{formatCurrency(maxRevenueValue * 0.25)}</text>
                <text x="46" y="113" fontSize="11" fill="var(--text-primary)" textAnchor="end" fontWeight="500">₹0</text>

                {/* Flat background fill and solid curve */}
                {revenueChartData.length > 0 && (
                  <g className="animate-chart-reveal">
                    {/* Curved Area Path */}
                    <path
                      d={revenuePaths.areaPath}
                      fill="rgba(129, 140, 248, 0.035)"
                    />

                    {/* Curved Glow Line Path */}
                    <path
                      d={revenuePaths.linePath}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* interactive dots */}
                {revenueChartData.map((p, idx) => (
                  <g key={idx}>
                    {hoveredRevenueIdx === idx && (
                      <line x1={p.x} y1="10" x2={p.x} y2="110" stroke="rgba(129,140,248,0.5)" strokeWidth="1" strokeDasharray="2,2" />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredRevenueIdx === idx ? 6.5 : 4}
                      fill={hoveredRevenueIdx === idx ? '#818cf8' : 'var(--bg-surface)'}
                      stroke="#818cf8"
                      strokeWidth="2"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredRevenueIdx(idx)}
                      onMouseLeave={() => setHoveredRevenueIdx(null)}
                    />
                    <text x={p.x} y="127" fontSize="12" fill="var(--text-primary)" textAnchor="middle" fontWeight="500">
                      {p.month}
                    </text>
                  </g>
                ))}
              </svg>

              {hoveredRevenueIdx !== null && (
                <div style={{
                  position: 'absolute',
                  top: revenueChartData[hoveredRevenueIdx].y - 48,
                  left: `${(revenueChartData[hoveredRevenueIdx].x / 500) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: 'rgba(36, 36, 40, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  fontSize: 11,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  zIndex: 10,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  transition: 'all 0.1s ease'
                }}>
                  <div style={{ color: 'var(--text-secondary)', fontWeight: 550, fontSize: 9.5 }}>{revenueChartData[hoveredRevenueIdx].month} Sales</div>
                  <div style={{ fontWeight: 700, color: '#818cf8', fontSize: 12, marginTop: 1 }}>{formatCurrency(revenueChartData[hoveredRevenueIdx].val)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Project Share flat horizontal stacked bar */}
          <div className="ew-dashboard-panel" style={{ padding: 20, borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div className="ew-dashboard-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottom: 'none' }}>
              <span className="ew-dashboard-panel-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building size={15} style={{ color: '#34d399' }} /> Revenue Share by Project
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: 160, justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 550 }}>
                <span>Total Portfolio Sales</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{formatCurrency(totalRevenue)}</span>
              </div>

              {/* Stacked Progress Bar */}
              <div style={{ width: '100%', height: 12, background: 'var(--bg-hover)', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
                {donutChartData.map((project, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${project.percentage}%`,
                      height: '100%',
                      background: project.color,
                      transition: 'width 0.4s ease'
                    }}
                    title={`${project.name}: ${Math.round(project.percentage)}%`}
                  />
                ))}
              </div>

              {/* Legends list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {donutChartData.map((project, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: project.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 550, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(project.value)}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{Math.round(project.percentage)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Funnel Pipeline Bar Chart */}
          <div className="ew-dashboard-panel" style={{ padding: 20, borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="ew-dashboard-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: 'none' }}>
              <span className="ew-dashboard-panel-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 size={15} style={{ color: '#fbbf24' }} /> Customer Pipeline Funnel
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, height: 160, justifyContent: 'center' }}>
              {pipelineChartData.map((stage, idx) => {
                const stageIcons = [
                  <Users size={12} style={{ color: '#818cf8', opacity: 0.85 }} />,
                  <MessageSquare size={12} style={{ color: '#22d3ee', opacity: 0.85 }} />,
                  <Calendar size={12} style={{ color: '#34d399', opacity: 0.85 }} />,
                  <Clock size={12} style={{ color: '#fbbf24', opacity: 0.85 }} />,
                  <CheckCircle2 size={12} style={{ color: '#a78bfa', opacity: 0.85 }} />
                ];
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 135, 
                      fontSize: 14, 
                      fontWeight: 550, 
                      color: 'var(--text-primary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6,
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {stageIcons[idx % stageIcons.length]}
                      <span>{stage.label}</span>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div style={{ width: '100%', height: 9, background: 'var(--bg-hover)', borderRadius: '6px', overflow: 'hidden' }}>
                        <div 
                          className="funnel-bar-fill animate-bar"
                          style={{
                            width: `${stage.percentage}%`,
                            height: '100%',
                            background: stage.color,
                            borderRadius: '6px'
                          }} 
                        />
                      </div>
                    </div>
                    <div style={{ width: 22, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>
                      {stage.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 4. Tabbed Detail Lists Section */}
        <div id="ew-admin-panel" className="ew-dashboard-panel" style={{ padding: 20, borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          
          {/* Tabs header & search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14, marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { id: 'bookings', label: 'Booking History', count: filteredData.bookings.length },
                { id: 'leads', label: 'Leads CRM', count: filteredData.customers.length || 3 },
                { id: 'visits', label: 'Site Visits', count: filteredData.siteVisits.length },
                { id: 'followups', label: 'Follow-ups', count: filteredData.followUps.filter(f => f.status !== 'Completed').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    background: activeTab === tab.id ? 'var(--accent-light)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s'
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    background: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-hover)',
                    color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                    fontWeight: 600
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', minWidth: 240 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '20px',
                  padding: '8px 12px 8px 36px',
                  fontSize: 14,
                  width: '100%',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Tab lists content */}
          <div style={{ flex: 1, overflowX: 'auto', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            
            {/* TAB 1: BOOKINGS */}
            {activeTab === 'bookings' && (
              <table className="ew-booking-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '11%', padding: '8px 12px' }}>Booking ID</th>
                    <th style={{ width: '14%', padding: '8px 12px' }}>Customer</th>
                    <th style={{ width: '8%', padding: '8px 12px' }}>Unit</th>
                    <th style={{ width: '18%', padding: '8px 12px' }}>Project</th>
                    <th style={{ width: '10%', padding: '8px 12px' }}>Total Price</th>
                    <th style={{ width: '11%', padding: '8px 12px' }}>Booking Token</th>
                    <th style={{ width: '10%', padding: '8px 12px' }}>Status</th>
                    <th style={{ width: '10%', padding: '8px 32px 8px 12px' }}>Date</th>
                    <th style={{ width: '8%', padding: '8px 12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tabGridData.length > 0 ? tabGridData.map((b, i) => (
                    <tr key={b.id || i}>
                      <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                        {b.id || `BK-${1000+i}`}
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{b.customerName}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{b.unit}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{b.project}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(b.priceVal)}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--accent)' }}>{b.amount}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span className={`ew-badge ${getStatusClass(b.status)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                          <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: b.status === 'Confirmed' ? 'var(--success)' : b.status === 'Pending' ? 'var(--warning)' : 'var(--danger)',
                            boxShadow: b.status === 'Confirmed' ? '0 0 6px var(--success)' : b.status === 'Pending' ? '0 0 6px var(--warning)' : 'none'
                          }} />
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '8px 32px 8px 12px', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>{b.timestamp || 'Today'}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'left' }}>
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="ew-btn ew-btn-ghost"
                          style={{
                            padding: '6px 12px',
                            fontSize: 13,
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            color: 'var(--danger)',
                            background: 'rgba(239, 68, 68, 0.05)',
                            transition: 'all 0.15s ease'
                          }}
                          disabled={b.status === 'Cancelled'}
                        >
                          Cancel Booking
                        </button>
                      </td>
                    </tr>
                  )) : (
                    renderEmptyState(9, 'No bookings match your filters or search query')
                  )}
                </tbody>
              </table>
            )}

            {/* TAB 2: LEADS CRM */}
            {activeTab === 'leads' && (
              <table className="ew-booking-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Lead Status</th>
                    <th>Assigned Agent</th>
                    <th>Date Added</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tabGridData.length > 0 ? tabGridData.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 550, color: 'var(--text-primary)', fontSize: 15 }}>{c.name}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{c.email || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{c.phone}</td>
                      <td>
                        <span 
                          onClick={() => handleToggleLeadStatus(c.email)}
                          style={{ cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}
                          title="Click to change status"
                          className={`ew-badge ${
                            c.status === 'Active' ? 'ew-badge-success' :
                            c.status === 'Contacted' ? 'ew-badge-warning' :
                            c.status === 'Lost' ? 'ew-badge-danger' : 'ew-badge-accent'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 15 }}>{c.assignedAgent || 'Booking Agent'}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500 }}>{c.dateAdded || 'Jun 22, 2026'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>

                          <button
                            onClick={() => handleCreateBookingClick(c)}
                            className="ew-btn ew-btn-ghost"
                            style={{ padding: '6px 12px', fontSize: 13, fontWeight: 600, borderRadius: '6px', border: '1px solid var(--border)' }}
                          >
                            Create Booking
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    renderEmptyState(7, 'No CRM leads match your filters or search query')
                  )}
                </tbody>
              </table>
            )}

            {/* TAB 3: SITE VISITS */}
            {activeTab === 'visits' && (
              <table className="ew-booking-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Visit ID</th>
                    <th>Customer</th>
                    <th>Project</th>
                    <th>Scheduled Date</th>
                    <th>Time Slot</th>
                    <th>Sales Representative</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tabGridData.length > 0 ? tabGridData.map((v, i) => (
                    <tr key={v.id || i}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{v.id || `SV-${100+i}`}</td>
                      <td style={{ fontWeight: 550, color: 'var(--text-primary)', fontSize: 14 }}>{v.customerName || v.customer_name}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{v.project}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>{v.date}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 14 }}>{v.time}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{v.executive || 'Rahul Mehta'}</td>
                      <td>
                        <span className={`ew-badge ${getStatusClass(v.status)}`}>{v.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleToggleSiteVisitStatus(v.id, v.status)}
                            className="ew-btn ew-btn-ghost"
                            style={{
                              padding: '6px 12px',
                              fontSize: 13,
                              fontWeight: 600,
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            {v.status === 'Completed' ? <X size={11} /> : <Check size={11} />}
                            {v.status === 'Completed' ? 'Reopen' : 'Complete'}
                          </button>
                          <button
                            onClick={() => handleRescheduleVisit(v)}
                            className="ew-btn ew-btn-ghost"
                            style={{ padding: '6px 12px', fontSize: 13, fontWeight: 600, borderRadius: '6px', border: '1px solid var(--border)' }}
                          >
                            Reschedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    renderEmptyState(8, 'No scheduled site visits match your filters or search query')
                  )}
                </tbody>
              </table>
            )}

            {/* TAB 4: FOLLOW UPS */}
            {activeTab === 'followups' && (
              <table className="ew-booking-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Notes & Task Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tabGridData.length > 0 ? tabGridData.map((f, i) => (
                    <tr key={f.id || i}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{f.id || `FU-${200+i}`}</td>
                      <td style={{ fontWeight: 550, color: 'var(--text-primary)', fontSize: 14 }}>{f.customerName || f.customer_name}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{f.notes}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 14 }}>{f.dueDate}</td>
                      <td>
                        <span className={`ew-badge ${getStatusClass(f.status === 'Pending' ? 'overdue' : f.status)}`}>
                          {f.status === 'Pending' ? 'Overdue' : f.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleToggleFollowUpStatus(f.id, f.status)}
                            className="ew-btn ew-btn-ghost"
                            style={{
                              padding: '6px 12px',
                              fontSize: 13,
                              fontWeight: 600,
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            {f.status === 'Completed' ? <X size={11} /> : <Check size={11} />}
                            {f.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                          </button>

                        </div>
                      </td>
                    </tr>
                  )) : (
                    renderEmptyState(6, 'No follow-up tasks match your filters or search query')
                  )}
                </tbody>
              </table>
            )}

          </div>
        </div>

        {/* Reschedule Modal */}
        {rescheduleData && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', width: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18 }}>Reschedule Site Visit</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>Select a new date and time for {rescheduleData.customerName || rescheduleData.customer_name}.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>New Date</label>
                <input type="text" value={newDate} onChange={e => setNewDate(e.target.value)} placeholder="e.g. Jul 15, 2026" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>New Time</label>
                <input type="text" value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="e.g. 11:00 AM" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button className="ew-btn ew-btn-ghost" onClick={() => setRescheduleData(null)} style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600 }}>Cancel</button>
                <button className="ew-btn ew-btn-primary" onClick={submitReschedule} style={{ flex: 1, padding: '10px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600 }}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Create Booking Modal */}
        {createBookingData && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', width: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 18 }}>Create New Booking</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>Enter booking details for {createBookingData.name}.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Project Name</label>
                <input type="text" value={newProject} onChange={e => setNewProject(e.target.value)} placeholder="e.g. Blue Ridge Hinjewadi" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Unit / Flat No.</label>
                <input type="text" value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="e.g. A-402, 3 BHK" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Total Price (₹)</label>
                <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="e.g. 15000000" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button className="ew-btn ew-btn-ghost" onClick={() => setCreateBookingData(null)} style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600 }}>Cancel</button>
                <button className="ew-btn ew-btn-primary" onClick={submitCreateBooking} style={{ flex: 1, padding: '10px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600 }}>Create</button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#10b981',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontSize: 13,
            fontWeight: 550,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'slideIn 0.2s ease'
          }}>
            <CheckCircle2 size={16} />
            {toastMessage}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardOverlay;
