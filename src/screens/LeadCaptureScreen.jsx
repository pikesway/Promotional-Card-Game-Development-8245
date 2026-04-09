import React, { useState } from 'react';
import { MenuPanel, StyledInput, CheckboxRow, GameButton } from '../components/ui/GameElements';
import { GAME_CONFIG } from '../config';

const LeadCaptureScreen = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    consent: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.consent) {
      alert("Required: Name, Email, and Consent.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="game-viewport bg-game-pattern flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <MenuPanel title="Enter Player Info" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-3">
            <StyledInput 
              label="First Name" 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})} 
              required 
            />
            <StyledInput 
              label="Last Name" 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})} 
              required 
            />
          </div>
          
          <StyledInput 
            label="Email" 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
          
          <StyledInput 
            label="Phone (Optional)" 
            type="tel" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />

          <div className="mt-2 scale-90 origin-top">
            <CheckboxRow 
              label="I agree to receive promotional offers."
              sublabel="View terms & privacy policy online."
              checked={formData.consent}
              onChange={e => setFormData({...formData, consent: e.target.checked})}
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <GameButton type="submit" variant="success" className="w-full">
              START GAME
            </GameButton>
            <button type="button" onClick={onBack} className="text-white/50 text-xs font-bold uppercase tracking-widest">
              Go Back
            </button>
          </div>
        </form>
      </MenuPanel>
    </div>
  );
};

export default LeadCaptureScreen;