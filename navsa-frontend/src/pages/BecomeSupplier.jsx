import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BecomeSupplier.css';

function BecomeSupplier() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_code: '+44',
    mobile_phone: '',
    business_phone: '',
    company_name: '',
    company_type: '',
    company_registration_number: '',
    website_url: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: '',
    country: 'United Kingdom',
    postcode: '',
    additional_comments: '',
    categories_supplied: [],
    consent_news: false,
    consent_marketing: false,
    contact_time: [],
    terms_accepted: false,
  });

  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

  const categories = [
    'Chocolates',
    'Groceries',
    'Confectionery',
    'Crisps & Snacks',
    'Cold and Hot Beverages',
    'Biscuits',
    'Seasonal',
    'Chilled Items',
    'Frozen',
    'Baby and Kids',
    'Health and Personal Care',
    'Pet Care and Food',
    'Cleaning & Households'
  ];

  const contactTimes = [
    'Before 9am',
    'Between 9am-12pm',
    'Between 12pm-5pm',
    'After 5pm',
    'No Preference'
  ];

  const companyTypes = [
    'Limited Company',
    'Sole Trader',
    'Partnership',
    'Public Limited Company (PLC)',
    'Other'
  ];

  const countriesList = [
    "United Kingdom", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Croatia", "Cuba", "Cyprus", "Denmark", "Egypt", 
    "Finland", "France", "Germany", "Greece", "India", "Indonesia", "Ireland", "Italy", "Japan", "Malaysia", "Mexico", 
    "Netherlands", "New Zealand", "Norway", "Pakistan", "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", 
    "Singapore", "South Africa", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Arab Emirates", "United States"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'categories_supplied') {
      setFormData(prev => {
        const newCats = checked 
          ? [...prev.categories_supplied, value]
          : prev.categories_supplied.filter(c => c !== value);
        return { ...prev, categories_supplied: newCats };
      });
    } else if (type === 'checkbox' && name === 'contact_time') {
      setFormData(prev => {
        const newTimes = checked 
          ? [...prev.contact_time, value]
          : prev.contact_time.filter(t => t !== value);
        return { ...prev, contact_time: newTimes };
      });
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms_accepted) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }

    setStatus('submitting');
    
    const submissionData = {
      ...formData,
      mobile_phone: formData.phone_code + ' ' + formData.mobile_phone,
      password: formData.password || 'NavsaSupplier123!',
    };

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${BASE}/register-supplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Supplier registration failed.');
      }
      setStatus('success');
    } catch (error) {
      console.error('Error submitting supplier form:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="become-supplier-container success-state">
        <div className="success-card">
          <h2>Application Submitted Successfully!</h2>
          <p>Thank you for submitting your details. We have received your supplier application and will contact you as soon as possible.</p>
          <p>You can return to the <Link to="/">Home Page</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="become-supplier-container">
      <div className="supplier-form-wrapper">
        <h1 className="form-title">Supplier Application Form</h1>
        <p className="supplier-intro">
          Please enter your contact and business information below to register as a NAVSA supplier.
        </p>

        {status === 'error' && (
          <div className="error-message">
            There was an error submitting your supplier registration. Please ensure all required fields are filled correctly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="supplier-form">
          
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-group row">
            <div className="col">
              <label>First Name *</label>
              <input 
                type="text" 
                name="first_name" 
                required 
                value={formData.first_name} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Last Name *</label>
              <input 
                type="text" 
                name="last_name" 
                required 
                value={formData.last_name} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <h3 className="section-title">Contact Information</h3>

          <div className="form-group row">
            <div className="col">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Mobile Phone Number</label>
              <div className="phone-input-group">
                <select 
                  name="phone_code" 
                  value={formData.phone_code} 
                  onChange={handleChange}
                  className="phone-code-select"
                >
                  <option value="+44">UK (+44)</option>
                  <option value="+1">US (+1)</option>
                  <option value="+91">IN (+91)</option>
                  <option value="+353">IE (+353)</option>
                  <option value="+33">FR (+33)</option>
                  <option value="+49">DE (+49)</option>
                  <option value="+971">AE (+971)</option>
                </select>
                <input 
                  type="text" 
                  name="mobile_phone" 
                  placeholder="7123 456789" 
                  value={formData.mobile_phone} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Business Phone Number</label>
            <input 
              type="text" 
              name="business_phone" 
              placeholder="+44 (0) 114 244 0887" 
              value={formData.business_phone} 
              onChange={handleChange} 
            />
          </div>

          <h3 className="section-title">Company Information</h3>

          <div className="form-group row">
            <div className="col">
              <label>Company Name *</label>
              <input 
                type="text" 
                name="company_name" 
                required 
                value={formData.company_name} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Select Company Type</label>
              <select 
                name="company_type" 
                value={formData.company_type} 
                onChange={handleChange}
              >
                <option value="">-- Select Type --</option>
                {companyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Company Registration Number</label>
              <input 
                type="text" 
                name="company_registration_number" 
                value={formData.company_registration_number} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Website URL</label>
              <input 
                type="text" 
                name="website_url" 
                placeholder="www." 
                value={formData.website_url} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <h3 className="section-title">Address Information</h3>

          <div className="form-group">
            <label>Address Line 1 *</label>
            <input 
              type="text" 
              name="address_line_1" 
              required 
              value={formData.address_line_1} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Address Line 2</label>
            <input 
              type="text" 
              name="address_line_2" 
              value={formData.address_line_2} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>City *</label>
              <input 
                type="text" 
                name="city" 
                required 
                value={formData.city} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>County *</label>
              <input 
                type="text" 
                name="county" 
                required 
                value={formData.county} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Country *</label>
              <select 
                name="country" 
                required 
                value={formData.country} 
                onChange={handleChange}
              >
                {countriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Postcode *</label>
              <input 
                type="text" 
                name="postcode" 
                required 
                value={formData.postcode} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Additional Comments</label>
            <input 
              type="text" 
              name="additional_comments" 
              value={formData.additional_comments} 
              onChange={handleChange} 
            />
          </div>

          <h3 className="section-title">What You Supply</h3>
          <p className="sub-text" style={{ marginLeft: 0, marginBottom: 12 }}>
            Please tick the areas your company deals with (select all that apply):
          </p>
          <div className="checkbox-grid">
            {categories.map(cat => (
              <label key={cat}>
                <input 
                  type="checkbox" 
                  name="categories_supplied" 
                  value={cat} 
                  checked={formData.categories_supplied.includes(cat)}
                  onChange={handleChange} 
                />
                {cat}
              </label>
            ))}
          </div>

          <h3 className="section-title">Contact Preferences</h3>
          <div className="form-group checkbox-full">
            <label>
              <input 
                type="checkbox" 
                name="consent_news" 
                checked={formData.consent_news}
                onChange={handleChange} 
              />
              News & Updates (Important company information such as seasonal opening times and attendance at trade shows)
            </label>
          </div>
          <div className="form-group checkbox-full">
            <label>
              <input 
                type="checkbox" 
                name="consent_marketing" 
                checked={formData.consent_marketing}
                onChange={handleChange} 
              />
              Marketing Mailers (Promotional information about our categories and brands, website campaigns and discount codes)
            </label>
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label style={{ fontWeight: 600 }}>Preferred Time to Contact You</label>
            <div className="checkbox-grid" style={{ marginTop: 8 }}>
              {contactTimes.map(time => (
                <label key={time}>
                  <input 
                    type="checkbox" 
                    name="contact_time" 
                    value={time} 
                    checked={formData.contact_time.includes(time)}
                    onChange={handleChange} 
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>

          <h3 className="section-title">Terms & Conditions</h3>
          <div className="terms-container">
            <p className="terms-paragraph">
              We want you to know exactly how our service works and why we need your registration details. Please state that you have read and agreed to these terms before you continue. You must accept these <Link to="/terms" target="_blank">Terms and Conditions</Link> by ticking the box below.
            </p>
            <p className="terms-paragraph" style={{ marginTop: 8 }}>
              We process your personal data as stated in our <Link to="/privacy" target="_blank">Privacy Policy</Link>. You may withdraw your consent or manage your preferences at any time.
            </p>
          </div>

          <div className="form-group checkbox-full">
            <label>
              <input 
                type="checkbox" 
                name="terms_accepted" 
                required
                checked={formData.terms_accepted}
                onChange={handleChange} 
              />
              I agree to the Terms & Conditions *
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Submitting Application...' : 'Submit Application'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default BecomeSupplier;
