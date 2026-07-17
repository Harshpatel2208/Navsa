import React, { useState, useEffect } from 'react';
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
    sell_outside_countries: '',
    customs_agent: '',
    import_full_containers: '',
    brands_interested: '',
    categories_interested: [],
    eori_number: '',
    terms_accepted: false,
    consent_emails: false,
    same_as_billing: true,
    shipping_address_line_1: '',
    shipping_address_line_2: '',
    shipping_city: '',
    shipping_province: '',
    shipping_zip_code: '',
  });

  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'
  const countriesList = [
    "United Kingdom",
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China",
    "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
    "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
    "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand",
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
  ];

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
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${BASE}/register-customer`, {
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
              <select name="country" required value={formData.country} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">- Select -</option>
                {countriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
              <select name="trading_years" required value={formData.trading_years} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">- Select -</option>
                <option value="0-1">0-1</option>
                <option value="1-3">1-3</option>
                <option value="3-5">3-5</option>
                <option value="5+">5+</option>
              </select>
            </div>
            <div className="col">
              <label>What is the nature of your business *</label>
              <select name="business_nature" required value={formData.business_nature} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">Please Select</option>
                <option value="Multiples">Multiples</option>
                <option value="Discount">Discount</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Retail">Retail</option>
                <option value="Traders">Traders</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Online">Online</option>
                <option value="Amazon">Amazon</option>
              </select>
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

          <h3 className="section-title">Company Billing Address *</h3>
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

          <div className="form-group checkbox-full">
            <label>
              <input type="checkbox" name="same_as_billing" checked={formData.same_as_billing} onChange={handleChange} />
              Shipping address is the same as Billing address
            </label>
          </div>

          {!formData.same_as_billing && (
            <div className="shipping-address-section">
              <h3 className="section-title">Shipping Address *</h3>
              <div className="form-group">
                <label>Shipping Address line 1</label>
                <input type="text" name="shipping_address_line_1" required={!formData.same_as_billing} value={formData.shipping_address_line_1} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Shipping Address line 2</label>
                <input type="text" name="shipping_address_line_2" value={formData.shipping_address_line_2} onChange={handleChange} />
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>Shipping City</label>
                  <input type="text" name="shipping_city" required={!formData.same_as_billing} value={formData.shipping_city} onChange={handleChange} />
                </div>
                <div className="col">
                  <label>Shipping Province</label>
                  <input type="text" name="shipping_province" required={!formData.same_as_billing} value={formData.shipping_province} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>Shipping Zip code</label>
                  <input type="text" name="shipping_zip_code" required={!formData.same_as_billing} value={formData.shipping_zip_code} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

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
              <select name="average_order_value" required value={formData.average_order_value} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">Please Select</option>
                <option value="5,000 - 10,000 (UK & Europe only)">5,000 - 10,000 (UK & Europe only)</option>
                <option value="10,000 - 20,000">10,000 - 20,000</option>
                <option value="20,000 - 40,000">20,000 - 40,000</option>
                <option value="40,000 +">40,000 +</option>
              </select>
            </div>
            <div className="col">
              <label>Company Turnover *</label>
              <select name="turnover" required value={formData.turnover} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">Please Select</option>
                <option value="0 - 500,000">0 - 500,000</option>
                <option value="500,000 - 1,000,000">500,000 - 1,000,000</option>
                <option value="1,000,000 - 5,000,000">1,000,000 - 5,000,000</option>
                <option value="5,000,000- 10,000,000">5,000,000- 10,000,000</option>
                <option value="20,000,000 +">20,000,000 +</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Do you sell or distribute to any countries outside your main business location?</label>
            <input type="text" placeholder="If yes please state where" name="sell_outside_countries" value={formData.sell_outside_countries} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Do you have a customs clearing agent or freight forwarder? *</label>
            <div className="radio-group">
              <label><input type="radio" name="customs_agent" value="Yes" onChange={handleChange} required/> Yes</label>
              <label><input type="radio" name="customs_agent" value="No" onChange={handleChange} /> No</label>
              <label><input type="radio" name="customs_agent" value="Not Applicable" onChange={handleChange} /> Not Applicable</label>
            </div>
          </div>

          <div className="form-group">
            <label>Do you import full containers or pallets from the UK? *</label>
            <div className="radio-group">
              <label><input type="radio" name="import_full_containers" value="Containers" onChange={handleChange} required/> Yes - Containers</label>
              <label><input type="radio" name="import_full_containers" value="Pallets" onChange={handleChange} /> Yes - Pallets</label>
              <label><input type="radio" name="import_full_containers" value="Cases" onChange={handleChange} /> No - I order by cases</label>
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
