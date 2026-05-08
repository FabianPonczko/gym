// LoadingOverlay.js
import { TailSpin } from 'react-loader-spinner';

const LoadingOverlay = ({ cargando }) => {
  if (!cargando) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    }}>
      <TailSpin color="#00BFFF" height={80} width={80} />
    </div>
  );
};

export default LoadingOverlay;
