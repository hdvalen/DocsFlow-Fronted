import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
  const inputId = id || props.name;
  return (
    <div className="input-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} {...props} className={error ? 'input-error' : ''} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;