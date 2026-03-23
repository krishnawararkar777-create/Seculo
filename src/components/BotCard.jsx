import { useBot } from '../hooks/useBot';

export default function BotCard() {
  const { botStatus, qrCode, isLoading, deployBot, stopBot } = useBot();

  const cardStyle = {
    backgroundColor: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: 300,
  };

  const titleStyle = {
    fontSize: 18,
    fontWeight: 600,
    color: '#ededed',
    marginBottom: 16,
    fontFamily: 'Geist, sans-serif',
  };

  const textStyle = {
    fontSize: 12,
    color: '#a0a0a0',
    fontFamily: 'Geist Mono, monospace',
    marginTop: 12,
  };

  if (botStatus === 'stopped') {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🤖</div>
        <h3 style={titleStyle}>Deploy Your AI Assistant</h3>
        <p style={{ fontSize: 12, color: '#666', fontFamily: 'Geist Mono, monospace', maxWidth: 280, marginBottom: 20 }}>
          Start your WhatsApp AI assistant with OpenClaw
        </p>
        <button
          onClick={deployBot}
          disabled={isLoading}
          style={{
            padding: '12px 32px',
            backgroundColor: '#3ECF8E',
            color: '#003822',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 6,
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'Geist, sans-serif',
          }}
        >
          {isLoading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              Deploying...
            </>
          ) : (
            <>
              <span>▶</span>
              Deploy My Assistant
            </>
          )}
        </button>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (botStatus === 'connecting') {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: 40, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>⚡</div>
        <h3 style={titleStyle}>Starting Your Assistant...</h3>
        <p style={textStyle}>Please wait while we initialize your bot</p>
        <div style={{ marginTop: 20, width: 32, height: 32, border: '2px solid #3d4a41', borderTopColor: '#3ECF8E', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        `}</style>
      </div>
    );
  }

  if (botStatus === 'qr_ready' && qrCode) {
    return (
      <div style={cardStyle}>
        <h3 style={{ ...titleStyle, marginBottom: 8 }}>Scan QR Code</h3>
        <p style={{ fontSize: 11, color: '#666', fontFamily: 'Geist Mono, monospace', marginBottom: 16 }}>
          Open WhatsApp → Settings → Linked Devices → Scan
        </p>
        <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 12, marginBottom: 12 }}>
          <img src={qrCode} alt="WhatsApp QR Code" style={{ width: 180, height: 180 }} />
        </div>
        <p style={{ fontSize: 11, color: '#3ECF8E', fontFamily: 'Geist Mono, monospace' }}>
          QR refreshes automatically
        </p>
        <button
          onClick={stopBot}
          style={{
            marginTop: 16,
            padding: '8px 24px',
            backgroundColor: 'transparent',
            color: '#ffb4ab',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            border: '1px solid rgba(255,180,171,0.3)',
            cursor: 'pointer',
            fontFamily: 'Geist, sans-serif',
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (botStatus === 'live') {
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', backgroundColor: '#3ECF8E', animation: 'ping 1.5s infinite', opacity: 0.5 }} />
            <span style={{ position: 'relative', display: 'inline-block', width: 40, height: 40, borderRadius: '50%', backgroundColor: '#3ECF8E' }} />
          </div>
        </div>
        <h3 style={{ ...titleStyle, color: '#3ECF8E' }}>Your AI Assistant is LIVE</h3>
        <p style={textStyle}>Your bot is connected and ready to respond</p>
        <button
          onClick={stopBot}
          style={{
            marginTop: 20,
            padding: '10px 24px',
            backgroundColor: 'rgba(255,80,80,0.1)',
            color: '#ff5050',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            border: '1px solid rgba(255,80,80,0.2)',
            cursor: 'pointer',
            fontFamily: 'Geist, sans-serif',
          }}
        >
          Stop Bot
        </button>
        <style>{`
          @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <p style={textStyle}>Loading...</p>
    </div>
  );
}
