import { FaSpinner } from 'react-icons/fa';

const Spinner = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <FaSpinner
        className="spinner"
        style={{
          fontSize: '50px',
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  );
};

export default Spinner;
