import React from 'react';
import { Keystatic } from '@keystatic/core/ui';
import config, { storage } from '../keystatic.config.mjs';

function EditLocally() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', color: '#EDEBE6', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, fontFamily: '"Archivo Variable", system-ui, sans-serif' }}>
        <p className="label" style={{ color: '#A8A49C', marginBottom: 16 }}>Content editor</p>
        <h1 className="display" style={{ fontSize: 48, margin: 0 }}>Edit locally for now.</h1>
        <p style={{ marginTop: 24, fontSize: 18, lineHeight: '28px', color: '#A8A49C' }}>
          Online editing isn't switched on yet. Run <code>npm start</code> on your computer and open{' '}
          <code>localhost:3000/keystatic</code>, then commit and push your changes.
        </p>
      </div>
    </div>
  );
}

export default function KeystaticAdmin() {
  // In a production build "local" storage has no API to save to, so show instructions instead.
  if (storage.kind === 'local' && process.env.NODE_ENV !== 'development') return <EditLocally />;
  return <Keystatic config={config} />;
}
