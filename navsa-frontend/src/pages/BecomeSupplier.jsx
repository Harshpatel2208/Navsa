import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BecomeSupplier.css';

function BecomeSupplier() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '', // Hidden/generated password for user account setup
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
    
    // We generate a default password or require one for registration login credentials
    const submissionData = {
      ...formData,
      // Concatenate mobile phone with code
      mobile_phone: formData.phone_code + ' ' + formData.mobile_phone,
      password: formData.password || 'NavsaSupplier123!', // fallback password for database user
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
      <div className="supplier-breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Become a Supplier</span>
      </div>

      <div className="supplier-form-wrapper">
        <h1 className="form-title">Become a Supplier</h1>
        <p className="form-subtitle">Please enter your contact information below and we will contact you as soon as possible.</p>

        {status === 'error' && (
          <div className="error-message">
            There was an error submitting your supplier registration. Please ensure all required fields are filled correctly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="supplier-form">
          
          {/* Section 1: Personal Information */}
          <div className="form-section">
            <h3 className="section-bar">Personal Information</h3>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="first_name">First Name *</label>
                <input 
                  type="text" 
                  id="first_name" 
                  name="first_name" 
                  required 
                  value={formData.first_name} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-col">
                <label htmlFor="last_name">Last Name *</label>
                <input 
                  type="text" 
                  id="last_name" 
                  name="last_name" 
                  required 
                  value={formData.last_name} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="form-section">
            <h3 className="section-bar">Contact Information</h3>
            <div className="form-row">
              <div className="form-col email-col">
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-col mobile-col">
                <label htmlFor="mobile_phone">Mobile Phone Number</label>
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
                    id="mobile_phone" 
                    name="mobile_phone" 
                    placeholder="7123 456789" 
                    value={formData.mobile_phone} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row mt-2">
              <div className="form-col">
                <label htmlFor="business_phone">Business Phone Number</label>
                <input 
                  type="text" 
                  id="business_phone" 
                  name="business_phone" 
                  placeholder="+44 (0) 114 244 0887" 
                  value={formData.business_phone} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Company Information */}
          <div className="form-section">
            <h3 className="section-bar">Company Information</h3>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="company_name">Company Name *</label>
                <input 
                  type="text" 
                  id="company_name" 
                  name="company_name" 
                  required 
                  value={formData.company_name} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-col">
                <label htmlFor="company_type">Select Company Type</label>
                <select 
                  id="company_type" 
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
            <div className="form-row mt-2">
              <div className="form-col">
                <label htmlFor="company_registration_number">Company Registration Number</label>
                <input 
                  type="text" 
                  id="company_registration_number" 
                  name="company_registration_number" 
                  value={formData.company_registration_number} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-col">
                <label htmlFor="website_url">Website URL</label>
                <input 
                  type="text" 
                  id="website_url" 
                  name="website_url" 
                  placeholder="www." 
                  value={formData.website_url} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Section 4: Address Information */}
          <div className="form-section">
            <h3 className="section-bar">Address Information</h3>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="address_line_1">Address Line 1 *</label>
                <input 
                  type="text" 
                  id="address_line_1" 
                  name="address_line_1" 
                  required 
                  value={formData.address_line_1} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-col">
                <label htmlFor="address_line_2">Address Line 2</label>
                <input 
                  type="text" 
                  id="address_line_2" 
                  name="address_line_2" 
                  value={formData.address_line_2} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="form-row mt-2">
              <div className="form-col">
                <label htmlFor="city">City *</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  required 
                  value={formData.city} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-col">
                <label htmlFor="county">County *</label>
                <input 
                  type="text" 
                  id="county" 
                  name="county" 
                  required 
                  value={formData.county} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="form-row mt-2">
              <div className="form-col">
                <label htmlFor="country">Country *</label>
                <select 
                  id="country" 
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
              <div className="form-col">
                <label htmlFor="postcode">Postcode *</label>
                <input 
                  type="text" 
                  id="postcode" 
                  name="postcode" 
                  required 
                  value={formData.postcode} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Section 5: Additional Comments */}
          <div className="form-section">
            <h3 className="section-bar">Additional Comments</h3>
            <div className="form-row">
              <div className="form-col full-width">
                <input 
                  type="text" 
                  id="additional_comments" 
                  name="additional_comments" 
                  value={formData.additional_comments} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Section 6: What you Supply */}
          <div className="form-section">
            <h3 className="section-bar">What you Supply</h3>
            <p className="section-helper-text">Please tick the areas your company deals with - there's no limit to the number you select:</p>
            <div className="category-checkbox-grid">
              <div className="category-column">
                {categories.slice(0, 7).map(cat => (
                  <label key={cat} className="checkbox-label">
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
              <div className="category-column">
                {categories.slice(7).map(cat => (
                  <label key={cat} className="checkbox-label">
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
            </div>
          </div>

          {/* Section 7: Contact Preferences */}
          <div className="form-section">
            <h3 className="section-bar">Contact Preferences</h3>
            <div className="preference-options">
              <label className="checkbox-label full-width-label">
                <input 
                  type="checkbox" 
                  name="consent_news" 
                  checked={formData.consent_news}
                  onChange={handleChange} 
                />
                News & Updates (Important company information such as seasonal opening times and attendance at trade shows)
              </label>
              <label className="checkbox-label full-width-label mt-1">
                <input 
                  type="checkbox" 
                  name="consent_marketing" 
                  checked={formData.consent_marketing}
                  onChange={handleChange} 
                />
                Marketing Mailers (Promotional information about our categories and brands, website campaigns and discount codes)
              </label>
            </div>

            <div className="contact-time-selection mt-3">
              <p className="contact-time-title">Please select a time to contact you</p>
              <div className="contact-time-row">
                {contactTimes.map(time => (
                  <label key={time} className="checkbox-label horizontal-label">
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
          </div>

          {/* Section 8: Terms & Conditions */}
          <div className="form-section">
            <h3 className="section-bar">Terms & Conditions</h3>
            <div className="terms-container">
              <p className="terms-paragraph">
                We want you to know exactly how our service works and why we need your registration details. Please state that you have read and agreed to these terms before you continue. You must accept these <Link to="/terms" target="_blank">Terms and Conditions</Link> by ticking the box below.
              </p>
              <p className="terms-paragraph mt-1">
                We use email and targeted online advertising to send you product and service updates, promotional offers, and other marketing communications based on the information we collect about you, such as your email address, general location, and purchase and website browsing history.
              </p>
              <p className="terms-paragraph mt-1">
                We process your personal data as stated in our <Link to="/privacy" target="_blank">Privacy Policy</Link>. You may withdraw your consent or manage your preferences at any time by clicking the unsubscribe link at the bottom of any of our marketing emails, or by emailing us at <a href="mailto:sales@navsainternational.com">sales@navsainternational.com</a>.
              </p>
              
              <label className="checkbox-label mt-3 agree-label">
                <input 
                  type="checkbox" 
                  name="terms_accepted" 
                  required
                  checked={formData.terms_accepted}
                  onChange={handleChange} 
                />
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button 
              type="submit" 
              className="supplier-submit-btn" 
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default BecomeSupplier;
