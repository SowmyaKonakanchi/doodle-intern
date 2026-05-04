import React, { useState } from 'react';
import Container from './components/Container';
import Input from './components/Input';
import Toggle from './components/Toggle';
import Select from './components/Select';
import RadioGroup from './components/RadioGroup';
import PhoneInput from './components/PhoneInput';
import Button from './components/Button';

function App() {
  const [formData, setFormData] = useState({
    publicFigure: false,
    animetaVerified: false,
    aniAppOnboarded: false,
    delistCreator: false,
    managedBy: 'Self',
    creatorFullName: '',
    instagramHandle: '',
    creatorType: 'Male',
    directMobileNumber: '',
    creatorEmail: '',
    contactPocName: '',
    pocMobileNumber: '',
    pocEmailId: '',
    relationship: '',
    city: '',
    state: '',
    country: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveAsDraft = (e) => {
    e.preventDefault();
    console.log('--- FORM DATA SAVED AS DRAFT ---');
    console.table(formData);
    alert('Data saved as draft!');
  };

  return (
    <Container>
      <form onSubmit={handleSaveAsDraft}>
        {/* Toggles Section */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-6">
          <Toggle label="Public Figure" name="publicFigure" checked={formData.publicFigure} onChange={handleChange} />
          <Toggle label="Animeta Verified" name="animetaVerified" checked={formData.animetaVerified} onChange={handleChange} />
          <Toggle label="Ani App Onboarded" name="aniAppOnboarded" checked={formData.aniAppOnboarded} onChange={handleChange} />
          <Toggle label="Delist Creator" name="delistCreator" checked={formData.delistCreator} onChange={handleChange} />
        </div>

        {/* Managed By */}
        <RadioGroup 
          label="Managed By :" 
          name="managedBy" 
          value={formData.managedBy} 
          onChange={handleChange} 
          options={['Self', 'Agency']} 
        />

        <h2 className="text-[15px] font-bold text-black mb-4 tracking-wide">Contact Details</h2>
        
        {/* Input Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-8">
          <Input 
            label="Creator Full Name" 
            name="creatorFullName" 
            value={formData.creatorFullName} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Instagram Handle" 
            name="instagramHandle" 
            value={formData.instagramHandle} 
            onChange={handleChange} 
          />
          <Select 
            label="Creator Type" 
            name="creatorType" 
            value={formData.creatorType} 
            onChange={handleChange} 
            options={['Male', 'Female']} 
          />
          <PhoneInput 
            label="Direct Mobile Number" 
            name="directMobileNumber" 
            value={formData.directMobileNumber} 
            onChange={handleChange} 
          />
          <Input 
            label="Creator Email" 
            name="creatorEmail" 
            type="email"
            value={formData.creatorEmail} 
            onChange={handleChange} 
          />
          <Input 
            label="Contact POC Name" 
            name="contactPocName" 
            value={formData.contactPocName} 
            onChange={handleChange} 
          />
          <PhoneInput 
            label="POC Mobile Number" 
            name="pocMobileNumber" 
            value={formData.pocMobileNumber} 
            onChange={handleChange} 
          />
          <Input 
            label="POC Email ID" 
            name="pocEmailId" 
            type="email"
            value={formData.pocEmailId} 
            onChange={handleChange} 
          />
          <Input 
            label="Relationship" 
            name="relationship" 
            value={formData.relationship} 
            onChange={handleChange} 
          />
          <Input 
            label="City" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
          />
          <Input 
            label="State" 
            name="state" 
            value={formData.state} 
            onChange={handleChange} 
          />
          <Input 
            label="Country" 
            name="country" 
            value={formData.country} 
            onChange={handleChange} 
          />
        </div>

        {/* Submit Button */}
        <Button type="submit">Save As Draft</Button>
      </form>
    </Container>
  );
}

export default App;
