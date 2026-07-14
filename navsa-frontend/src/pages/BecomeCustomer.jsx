import React, { useState } from 'react';
import './BecomeCustomer.css';

function BecomeCustomer() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    region: '',
    country: '',
    position: '',
    registered_company_name: '',
    trading_years: '',
    business_nature: '',
    website: '',
    director_name: '',
    currency: '',
    registered_phone: '',
    mobile: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    zip_code: '',
    account_name: '',
    account_email: '',
    other_wholesalers: '',
    average_order_value: '',
    turnover: '',
    import_full_containers: '',
    brands_interested: '',
    categories_interested: [],
    eori_number: '',
    terms_accepted: false,
    consent_emails: false,
  });

  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

  const categories = [
    'Health Care', 'Skin Care', 'Baby Care', 'Hair Care', 'Dental',
    'Medicines & Vitamins', 'Toiletries', 'Confectionery', 'Crisps Snacks & Nuts',
    'Soft Drinks', 'Seasonal', 'Healthy Living Range', 'Household', 'Grocery', 'Bath Care'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'categories_interested') {
      setFormData(prev => {
        const newCategories = checked 
          ? [...prev.categories_interested, value]
          : prev.categories_interested.filter(c => c !== value);
        return { ...prev, categories_interested: newCategories };
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
      alert("Please accept the Terms & Conditions.");
      return;
    }
    
    setStatus('submitting');
    try {
      const response = await fetch('http://localhost:8000/api/register-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Registration failed. Please check your inputs.');
      }
      setStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="become-customer-container success-state">
        <div className="success-card">
          <h2>Application Submitted!</h2>
          <p>Thank you for registering with NAVSA. Your application has been sent to our team for review.</p>
          <p>Once approved, your account will be activated, and you will be able to log in with the password you created.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="become-customer-container">
      <div className="customer-form-wrapper">
        <h1 className="form-title">Customer Application Form</h1>
        <div className="form-instructions">
          <p>Please Note: You need to meet the following criteria for us to be able to process your account.</p>
          <ol>
            <li>UK companies <strong>must be VAT registered</strong></li>
            <li>Your business is <strong>registered at a commercial property</strong>, not a home address</li>
            <li>Our minimum order is <strong>£5,000 for UK & Europe, £10,000 for ROW</strong></li>
            <li>You need to be <strong>trading for over 12 months</strong> for UK Customers</li>
          </ol>
        </div>

        {status === 'error' && (
          <div className="error-message">
            There was an error submitting your application. Please ensure all required fields are filled correctly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group row">
            <div className="col">
              <label>First Name *</label>
              <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Last Name *</label>
              <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Password *</label>
              <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>What Region are you in? *</label>
            <div className="radio-group">
              <label><input type="radio" name="region" value="UK" onChange={handleChange} required/> UK</label>
              <label><input type="radio" name="region" value="Europe" onChange={handleChange} /> Europe</label>
              <label><input type="radio" name="region" value="International" onChange={handleChange} /> International</label>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Country *</label>
              <input type="text" name="country" required value={formData.country} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Your Position at the Company</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>What is your registered company name? *</label>
            <input type="text" name="registered_company_name" required value={formData.registered_company_name} onChange={handleChange} />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>How many years have you been trading? *</label>
              <input type="text" name="trading_years" required value={formData.trading_years} onChange={handleChange} />
            </div>
            <div className="col">
              <label>What is the nature of your business *</label>
              <input type="text" name="business_nature" required value={formData.business_nature} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Website address</label>
            <input type="text" name="website" value={formData.website} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Full name of the director of the business *</label>
            <input type="text" name="director_name" required value={formData.director_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>If your account is successful what currency would you like to pay in? *</label>
            <div className="radio-group">
              <label><input type="radio" name="currency" value="GBP" onChange={handleChange} required/> GBP £</label>
              <label><input type="radio" name="currency" value="EURO" onChange={handleChange} /> EURO €</label>
              <label><input type="radio" name="currency" value="DOLLAR" onChange={handleChange} /> DOLLAR $</label>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Registered company phone number *</label>
              <input type="text" name="registered_phone" required value={formData.registered_phone} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Mobile Number (For WhatsApp offers)</label>
              <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
            </div>
          </div>

          <h3 className="section-title">Company Address *</h3>
          <div className="form-group">
            <label>Address line 1</label>
            <input type="text" name="address_line_1" required value={formData.address_line_1} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address line 2</label>
            <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} />
          </div>
          <div className="form-group row">
            <div className="col">
              <label>City</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Province</label>
              <input type="text" name="province" required value={formData.province} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col">
              <label>Zip code</label>
              <input type="text" name="zip_code" required value={formData.zip_code} onChange={handleChange} />
            </div>
          </div>

          <h3 className="section-title">Accounts Information</h3>
          <div className="form-group row">
            <div className="col">
              <label>Accounts Name *</label>
              <input type="text" name="account_name" required value={formData.account_name} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Accounts Email Address *</label>
              <input type="email" name="account_email" required value={formData.account_email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Do you currently work with any other wholesalers?</label>
            <input type="text" name="other_wholesalers" value={formData.other_wholesalers} onChange={handleChange} />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Average Order Value *</label>
              <input type="text" name="average_order_value" required value={formData.average_order_value} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Company Turnover *</label>
              <input type="text" name="turnover" required value={formData.turnover} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Do you import full containers or pallets from the UK? *</label>
            <div className="radio-group">
              <label><input type="radio" name="import_full_containers" value="Containers" onChange={handleChange} required/> Yes - Containers</label>
              <label><input type="radio" name="import_full_containers" value="Pallets" onChange={handleChange} /> Yes - Pallets</label>
            </div>
          </div>

          <div className="form-group">
            <label>What brands are you interested in? *</label>
            <input type="text" name="brands_interested" required value={formData.brands_interested} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>What categories are you interested in? * (Select all that apply)</label>
            <div className="checkbox-grid">
              {categories.map(cat => (
                <label key={cat}>
                  <input type="checkbox" name="categories_interested" value={cat} onChange={handleChange} /> {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>EORI Number (EU ONLY)</label>
            <input type="text" name="eori_number" value={formData.eori_number} onChange={handleChange} />
          </div>

          <div className="form-group checkbox-full">
            <label>
              <input type="checkbox" name="terms_accepted" required checked={formData.terms_accepted} onChange={handleChange} />
              I have read the Terms & Conditions *
            </label>
            <p className="sub-text">Please tick the above to show you have read and accepted our terms and conditions</p>
          </div>

          <div className="form-group checkbox-full">
            <label>
              <input type="checkbox" name="consent_emails" checked={formData.consent_emails} onChange={handleChange} />
              I consent to receive emails for offers and new product updates. *
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BecomeCustomer;
