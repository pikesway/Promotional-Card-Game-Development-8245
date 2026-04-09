import React, { useState } from 'react';
import { MenuPanel, StyledInput, CheckboxRow, GameButton } from '../components/ui/GameElements';

const LeadCaptureScreen = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', consent: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.consent) {
      alert("Name, Email, and Consent are required.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="app-viewport bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-game-table opacity-40"></div>
      
      <MenuPanel title="Player Setup" className="w-full max-w-sm pb-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <StyledInput label="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
            <StyledInput label="Last Name" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
          </div>
          
          <StyledInput label="Email Address" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          
          <div className="mt-2 scale-95 origin-top">
            <CheckboxRow 
              label="I agree to receive promotional messages." 
              checked={formData.consent} 
              onChange={e => setFormData({ ...formData, consent: e.target.checked })} 
            />
          </div>

          <div className="flex flex-col gap-4 mt-4 pb-4">
            <GameButton type="submit" className="w-full py-4 bg-gradient-to-b from-green-400 to-green-600 border-b-4 border-green-700">
              START GAME
            </GameButton>
            <button type="button" onClick={onBack} className="text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
              Back to Menu
            </button>
          </div>
        </form>
      </MenuPanel>
    </div>
  );
};

export default LeadCaptureScreen;