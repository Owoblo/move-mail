// Initialize AOS animations
AOS.init({
  once: true,
  disable: 'phone',
  duration: 700,
  easing: 'ease-out-cubic',
});

// Global variables
let currentUser = null;
let supabaseClient = null;

// Initialize Supabase when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSupabase();
  checkAuthState();
  setupEventListeners();
});

// Initialize Supabase client
function initializeSupabase() {
  try {
    if (typeof window !== 'undefined' && window.config) {
      supabaseClient = supabase.createClient(
        window.config.SUPABASE_URL,
        window.config.SUPABASE_ANON_KEY
      );
      console.log('Supabase client initialized successfully.');
    } else {
      console.error('Config not found. Please check config.js file.');
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
}

// Check authentication state
async function checkAuthState() {
  if (!supabaseClient) return;
  
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
      currentUser = user;
      await loadUserProfile();
      showAuthenticatedUI();
    } else {
      showUnauthenticatedUI();
    }
  } catch (error) {
    console.error('Error checking auth state:', error);
    showUnauthenticatedUI();
  }
}

// Load user profile from database
async function loadUserProfile() {
  if (!currentUser || !supabaseClient) return;
  
  try {
    const { data, error } = await supabaseClient
      .from('moving_companies')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      currentUser.profile = data;
      updateDashboardUI(data);
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Sign up form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignUp);
  }
  
  // Sign in form
  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', handleSignIn);
  }
  
  // Logout button
  const logoutBtn = document.querySelector('[onclick="logout()"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // City selection form
  const cityForm = document.getElementById('city-selection-form');
  if (cityForm) {
    cityForm.addEventListener('submit', handleCityPreferences);
  }
}

// Handle sign up
async function handleSignUp(event) {
  event.preventDefault();
  
  if (!supabaseClient) {
    showMessage('Configuration error. Please contact support.', 'error');
    return;
  }
  
  // Get form values
  const company = document.getElementById('company').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const location = document.getElementById('location').value;
  const password = document.getElementById('password').value;
  const promoCode = document.getElementById('promoCode').value;
  
  // Validate required fields
  if (!company || !email || !phone || !location || !password) {
    showMessage('Please fill in all required fields', 'error');
    return;
  }
  
  try {
    showMessage('Creating your account...', 'info');
    
    // Create user with Supabase Auth
    const { data: { user }, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: company,
          phone: phone,
          service_area: location
        }
      }
    });
    
    if (signUpError) throw signUpError;
    
    if (user) {
      // Insert company profile into database
      const { error: insertError } = await supabaseClient
        .from('moving_companies')
        .insert([
          {
            id: user.id,
            email: email,
            company_name: company,
            phone: phone,
            service_area: location,
            promo_code: promoCode,
            trial_start_date: new Date().toISOString(),
            trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            credits: 50, // Starting credits for trial
            is_active: true,
            subscription_status: 'trial'
          }
        ]);
      
      if (insertError) throw insertError;
      
      showMessage('Account created successfully! Welcome to MoveMail Pro.', 'success');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Sign up error:', error);
    showMessage(`Sign up failed: ${error.message}`, 'error');
  }
}

// Google Sign In
async function signInWithGoogle() {
  if (!supabaseClient) {
    showMessage('Configuration error. Please contact support.', 'error');
    return;
  }
  
  try {
    showMessage('Signing in with Google...', 'info');
    
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard.html'
      }
    });
    
    if (error) throw error;
    
    // Google OAuth will redirect to the specified URL
    // The user will be redirected back after authentication
    
  } catch (error) {
    console.error('Google sign in error:', error);
    showMessage(`Google sign in failed: ${error.message}`, 'error');
  }
}

// Handle sign in
async function handleSignIn(event) {
  event.preventDefault();
  
  if (!supabaseClient) {
    showMessage('Configuration error. Please contact support.', 'error');
    return;
  }
  
  const formData = new FormData(event.target);
  const email = formData.get('email') || document.getElementById('email').value;
  const password = formData.get('password') || document.getElementById('password').value;
  
  try {
    showMessage('Signing you in...', 'info');
    
    const { data: { user }, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    
    if (signInError) throw signInError;
    
    if (user) {
      currentUser = user;
      await loadUserProfile();
      showMessage('Welcome back!', 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    }
  } catch (error) {
    console.error('Sign in error:', error);
    showMessage(`Sign in failed: ${error.message}`, 'error');
  }
}

// Logout function
async function logout() {
  try {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    currentUser = null;
    showMessage('Logged out successfully', 'success');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Logout error:', error);
    showMessage('Logout failed', 'error');
  }
}

// Show authenticated UI
function showAuthenticatedUI() {
  const authElements = document.querySelectorAll('.auth-required');
  authElements.forEach(el => el.style.display = 'block');
  
  const unauthElements = document.querySelectorAll('.auth-hidden');
  unauthElements.forEach(el => el.style.display = 'none');
}

// Show unauthenticated UI
function showUnauthenticatedUI() {
  const authElements = document.querySelectorAll('.auth-required');
  authElements.forEach(el => el.style.display = 'none');
  
  const unauthElements = document.querySelectorAll('.auth-hidden');
  unauthElements.forEach(el => el.style.display = 'block');
}

// Update dashboard UI with user data
function updateDashboardUI(userProfile) {
  // Update welcome message
  const welcomeMsg = document.getElementById('welcomeMessage');
  if (welcomeMsg) {
    welcomeMsg.textContent = `Welcome back, ${userProfile.company_name}!`;
  }
  
  // Update credits display
  const creditsEl = document.getElementById('credits');
  if (creditsEl) {
    creditsEl.textContent = userProfile.credits || 0;
  }
  
  // Update service area
  const serviceAreaEl = document.getElementById('serviceArea');
  if (serviceAreaEl && userProfile.service_area) {
    const areaNames = {
      'ontario': 'Ontario',
      'british-columbia': 'British Columbia',
      'alberta': 'Alberta',
      'quebec': 'Quebec',
      'nova-scotia': 'Nova Scotia',
      'manitoba': 'Manitoba',
      'saskatchewan': 'Saskatchewan',
      'other': 'Other'
    };
    serviceAreaEl.textContent = areaNames[userProfile.service_area] || userProfile.service_area;
  }
  
  // Check trial status
  if (userProfile.trial_end_date) {
    const trialEnd = new Date(userProfile.trial_end_date);
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      showMessage(`You have ${daysLeft} days left in your free trial!`, 'info');
    } else if (userProfile.subscription_status === 'trial') {
      showMessage('Your free trial has expired. Please upgrade to continue.', 'warning');
    }
  }
  
  // Load leads if on dashboard
  if (window.location.pathname.includes('dashboard.html')) {
    loadLeads();
  }
}

// Load leads from Supabase
async function loadLeads() {
  if (!supabaseClient || !currentUser) return;
  
  try {
    const { data: leads, error } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('company_id', currentUser.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    displayLeads(leads || []);
  } catch (error) {
    console.error('Error loading leads:', error);
    showMessage('Failed to load leads', 'error');
  }
}

// Display leads in the table
function displayLeads(leads) {
  const container = document.getElementById('leadsContainer');
  if (!container) return;
  
  if (leads.length === 0) {
    container.innerHTML = '<tr><td colspan="4" class="text-center py-4">No leads found. Start by purchasing credits!</td></tr>';
    return;
  }
  
  container.innerHTML = leads.map(lead => `
    <tr class="hover:bg-gray-50">
      <td class="py-2 px-4 border-b">${lead.id}</td>
      <td class="py-2 px-4 border-b">${lead.address || 'N/A'}</td>
      <td class="py-2 px-4 border-b">$${lead.price ? lead.price.toLocaleString() : 'N/A'}</td>
      <td class="py-2 px-4 border-b">${lead.city || 'N/A'}</td>
    </tr>
  `).join('');
}

// Handle city preferences
async function handleCityPreferences(event) {
  event.preventDefault();
  
  if (!supabaseClient || !currentUser) {
    showMessage('Please sign in to save preferences', 'error');
    return;
  }
  
  const provinceSelect = document.getElementById('province-select');
  const selectedProvince = provinceSelect.value;
  
  if (!selectedProvince) {
    showMessage('Please select a province', 'error');
    return;
  }
  
  try {
    const { error } = await supabaseClient
      .from('company_preferences')
      .upsert({
        company_id: currentUser.id,
        province: selectedProvince,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    showMessage('Preferences saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving preferences:', error);
    showMessage('Failed to save preferences', 'error');
  }
}

// Fetch cities by province (placeholder - you'll need to populate this)
function fetchCitiesByProvince() {
  const provinceSelect = document.getElementById('province-select');
  const cityCheckboxes = document.getElementById('city-checkboxes');
  
  if (!provinceSelect || !cityCheckboxes) return;
  
  const selectedProvince = provinceSelect.value;
  
  // This is a placeholder - you'll need to populate with real city data
  const cities = {
    'Province1': ['City A', 'City B', 'City C'],
    'Province2': ['City D', 'City E', 'City F']
  };
  
  if (selectedProvince && cities[selectedProvince]) {
    cityCheckboxes.innerHTML = cities[selectedProvince].map(city => `
      <label class="flex items-center mt-2">
        <input type="checkbox" value="${city}" class="mr-2">
        ${city}
      </label>
    `).join('');
  } else {
    cityCheckboxes.innerHTML = '';
  }
}

// Redirect to payment page
function redirectToPayment() {
  window.location.href = 'payment.html';
}

// Sort table function
function sortTable(column, direction) {
  // Implementation for sorting leads table
  console.log(`Sorting by ${column} in ${direction} order`);
}

// Show message to user
function showMessage(message, type = 'info') {
  const messageDiv = document.getElementById('message');
  if (!messageDiv) return;
  
  messageDiv.textContent = message;
  messageDiv.className = `text-center p-3 rounded-lg mt-4 ${
    type === 'error' ? 'bg-red-100 text-red-700' :
    type === 'success' ? 'bg-green-100 text-green-700' :
    type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
    'bg-blue-100 text-blue-700'
  }`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }, 5000);
}

// Masonry layout functions (keeping original functionality)
const masonryLayout = (parent) => {
  const childElements = Array.from(parent.children);
  const gapSize = parseInt(window.getComputedStyle(parent).getPropertyValue('grid-row-gap'));

  childElements.forEach(el => {
    let previous = el.previousSibling;
    while (previous) {
      if (previous.nodeType === 1) {
        el.style.marginTop = 0;
        if (elementLeft(previous) === elementLeft(el)) {
          el.style.marginTop = -(elementTop(el) - elementBottom(previous) - gapSize) + 'px';
          break;
        }
      }
      previous = previous.previousSibling;
    }
  });
}

const elementLeft = (el) => {
  return el.getBoundingClientRect().left;
}

const elementTop = (el) => {
  return el.getBoundingClientRect().top + window.scrollY;
}

const elementBottom = (el) => {
  return el.getBoundingClientRect().bottom + window.scrollY;
}

// Initialize masonry on page load
window.addEventListener('load', () => {
  const masonryElements = document.querySelectorAll('[data-masonry]');
  masonryElements.forEach(masonryLayout);
});

window.addEventListener('resize', () => {
  const masonryElements = document.querySelectorAll('[data-masonry]');
  masonryElements.forEach(masonryLayout);
});