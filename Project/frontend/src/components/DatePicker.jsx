import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  // Parse initial value or use today
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [view, setView] = useState('calendar'); // 'calendar' or 'years'

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setSelectedDate(d);
      setViewDate(d);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setView('calendar');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(date);
    const formatted = date.toISOString().split('T')[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const handleYearSelect = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setView('calendar');
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === viewDate.getMonth() && 
           selectedDate.getFullYear() === viewDate.getFullYear();
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === viewDate.getMonth() && 
           today.getFullYear() === viewDate.getFullYear();
  };

  const renderDays = () => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = startDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(
        <button
          key={day}
          type="button"
          className={`calendar-day ${isSelected(day) ? 'selected' : ''} ${isToday(day) ? 'today' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderYears = () => {
    const currentYear = viewDate.getFullYear();
    const endYear = new Date().getFullYear() + 10;
    const years = [];
    for (let y = 2000; y <= endYear; y++) {
      if (y === 2036) continue;
      years.push(
        <button
          key={y}
          type="button"
          className={`year-item ${y === currentYear ? 'selected' : ''}`}
          onClick={() => handleYearSelect(y)}
        >
          {y}
        </button>
      );
    }
    return years;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const displayValue = selectedDate 
    ? selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="date-picker-container" ref={containerRef}>
      <div 
        className="date-picker-display input-with-icon" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="input-icon" size={18} />
        <input 
          type="text" 
          readOnly 
          value={displayValue} 
          placeholder="Select Date"
          className="date-input-cursor"
          required
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="date-picker-popup"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="calendar-header">
              <button type="button" onClick={handlePrevMonth} className="nav-btn" disabled={view === 'years'}><ChevronLeft size={20} /></button>
              <div className="current-view-title" onClick={() => setView(view === 'calendar' ? 'years' : 'calendar')}>
                {view === 'calendar' ? (
                  <>{monthNames[viewDate.getMonth()]} <span className="year-clickable">{viewDate.getFullYear()}</span></>
                ) : (
                  'Select Year'
                )}
              </div>
              <button type="button" onClick={handleNextMonth} className="nav-btn" disabled={view === 'years'}><ChevronRight size={20} /></button>
            </div>

            {view === 'calendar' ? (
              <>
                <div className="calendar-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="weekday">{d}</div>
                  ))}
                </div>
                <div className="calendar-grid">
                  {renderDays()}
                </div>
              </>
            ) : (
              <div className="year-selector-grid">
                {renderYears()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .date-picker-container {
          position: relative;
          width: 100%;
        }
        .date-picker-display {
          cursor: pointer;
        }
        .date-input-cursor {
          cursor: pointer !important;
        }
        .date-picker-popup {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 2000;
          background: white;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
          width: 320px;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .current-view-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          text-transform: uppercase;
          color: var(--text);
          cursor: pointer;
          transition: color 0.2s;
        }
        .current-view-title:hover {
          color: var(--primary);
        }
        .year-clickable {
          border-bottom: 2px dashed var(--primary);
          padding-bottom: 2px;
        }
        .nav-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .nav-btn:hover:not(:disabled) {
          background: var(--bg);
          color: var(--primary);
        }
        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 8px;
        }
        .weekday {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          text-align: center;
          text-transform: uppercase;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .calendar-day:hover:not(.empty) {
          background: var(--bg);
          color: var(--primary);
        }
        .calendar-day.selected {
          background: var(--primary) !important;
          color: white !important;
          box-shadow: 3px 3px 0 var(--border-bold);
        }
        .calendar-day.today {
          color: var(--primary);
          border: 1px solid var(--primary);
        }
        .calendar-day.empty {
          cursor: default;
        }
        .year-selector-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .year-item {
          padding: 10px;
          border: 1px solid var(--border);
          background: none;
          border-radius: 4px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .year-item:hover {
          background: var(--bg);
          color: var(--primary);
          border-color: var(--primary);
        }
        .year-item.selected {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default DatePicker;
