import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

const TimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial value (HH:mm)
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: 12, minutes: 0, period: 'AM' };
    let [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return { hours: h, minutes: m, period };
  };

  const [time, setTime] = useState(parseTime(value));

  useEffect(() => {
    setTime(parseTime(value));
  }, [value]);

  const updateTime = (newTime) => {
    setTime(newTime);
    let h = newTime.hours;
    if (newTime.period === 'PM' && h < 12) h += 12;
    if (newTime.period === 'AM' && h === 12) h = 0;
    const formattedTime = `${h.toString().padStart(2, '0')}:${newTime.minutes.toString().padStart(2, '0')}`;
    onChange(formattedTime);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const incrementHours = () => {
    const newH = time.hours === 12 ? 1 : time.hours + 1;
    updateTime({ ...time, hours: newH });
  };

  const decrementHours = () => {
    const newH = time.hours === 1 ? 12 : time.hours - 1;
    updateTime({ ...time, hours: newH });
  };

  const incrementMinutes = () => {
    const newM = (time.minutes + 5) % 60;
    updateTime({ ...time, minutes: newM });
  };

  const decrementMinutes = () => {
    const newM = (time.minutes - 5 + 60) % 60;
    updateTime({ ...time, minutes: newM });
  };

  const togglePeriod = () => {
    updateTime({ ...time, period: time.period === 'AM' ? 'PM' : 'AM' });
  };

  const displayTime = `${time.hours}:${time.minutes.toString().padStart(2, '0')} ${time.period}`;

  return (
    <div className="time-picker-container" ref={containerRef}>
      <div 
        className="time-picker-display input-with-icon" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Clock className="input-icon" size={18} />
        <input 
          type="text" 
          readOnly 
          value={displayTime} 
          placeholder="Select Time"
          className="time-input-cursor"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="time-picker-popup"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="time-picker-controls">
              {/* Hours */}
              <div className="control-column">
                <button type="button" onClick={incrementHours}><ChevronUp size={20} /></button>
                <div className="time-unit">{time.hours}</div>
                <button type="button" onClick={decrementHours}><ChevronDown size={20} /></button>
              </div>

              <div className="time-separator">:</div>

              {/* Minutes */}
              <div className="control-column">
                <button type="button" onClick={incrementMinutes}><ChevronUp size={20} /></button>
                <div className="time-unit">{time.minutes.toString().padStart(2, '0')}</div>
                <button type="button" onClick={decrementMinutes}><ChevronDown size={20} /></button>
              </div>

              {/* AM/PM */}
              <div className="control-column period-toggle">
                <button 
                  type="button" 
                  className={`period-btn ${time.period === 'AM' ? 'active' : ''}`}
                  onClick={() => time.period === 'PM' && togglePeriod()}
                >
                  AM
                </button>
                <button 
                  type="button" 
                  className={`period-btn ${time.period === 'PM' ? 'active' : ''}`}
                  onClick={() => time.period === 'AM' && togglePeriod()}
                >
                  PM
                </button>
              </div>
            </div>
            
            <div className="time-picker-footer">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => setIsOpen(false)}
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .time-picker-container {
          position: relative;
          width: 100%;
        }
        .time-picker-display {
          cursor: pointer;
        }
        .time-input-cursor {
          cursor: pointer !important;
        }
        .time-picker-popup {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 2000;
          background: white;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-md);
          padding: 1rem;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
          width: 240px;
        }
        .time-picker-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .control-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        .control-column button {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
        }
        .control-column button:hover {
          background: var(--bg);
          color: var(--primary);
        }
        .time-unit {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          width: 40px;
          text-align: center;
          color: var(--text);
        }
        .time-separator {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-top: -4px;
        }
        .period-toggle {
          margin-left: 0.5rem;
          gap: 0.5rem !important;
        }
        .period-btn {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 8px !important;
          border: 1px solid var(--border) !important;
          border-radius: 4px !important;
          transition: all 0.2s;
        }
        .period-btn.active {
          background: var(--primary) !important;
          color: white !important;
          border-color: var(--primary) !important;
        }
        .time-picker-footer {
          margin-top: 1rem;
          border-top: 1px solid var(--border);
          padding-top: 0.75rem;
          text-align: right;
        }
        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default TimePicker;
