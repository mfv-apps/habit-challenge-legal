// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Form validation rules
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-']+$/,
    errorId: 'nameError',
    messages: {
      required: 'Please enter your name / Lütfen adınızı girin',
      minLength: 'Name must be at least 2 characters / Ad en az 2 karakter olmalı',
      maxLength: 'Name must not exceed 100 characters / Ad 100 karakteri geçmemeli',
      pattern: 'Name can only contain letters, spaces, hyphens and apostrophes / Ad yalnızca harfler, boşluklar, tireler ve kesme işaretleri içerebilir'
    }
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorId: 'emailError',
    messages: {
      required: 'Please enter your email address / Lütfen e-posta adresinizi girin',
      pattern: 'Please enter a valid email address / Lütfen geçerli bir e-posta adresi girin'
    }
  },
  subject: {
    required: true,
    errorId: 'subjectError',
    messages: {
      required: 'Please select a subject / Lütfen bir konu seçin'
    }
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    errorId: 'messageError',
    messages: {
      required: 'Please enter your message / Lütfen mesajınızı girin',
      minLength: 'Message must be at least 10 characters / Mesaj en az 10 karakter olmalı',
      maxLength: 'Message must not exceed 5000 characters / Mesaj 5000 karakteri geçmemeli'
    }
  },
  consent: {
    required: true,
    errorId: 'consentError',
    messages: {
      required: 'You must agree to the privacy terms / Gizlilik koşullarına katılmalısınız'
    }
  }
};

// Validate individual field
function validateField(fieldName) {
  const field = document.getElementById(fieldName);
  const rules = validationRules[fieldName];
  const errorElement = document.getElementById(rules.errorId);
  const formGroup = field.closest('.form-group');

  let isValid = true;
  let errorMessage = '';

  // Check if required
  if (rules.required) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    if (!value) {
      isValid = false;
      errorMessage = rules.messages.required;
    }
  }

  // Check pattern (for email, name)
  if (isValid && rules.pattern && field.value.trim()) {
    if (!rules.pattern.test(field.value)) {
      isValid = false;
      errorMessage = rules.messages.pattern;
    }
  }

  // Check length
  if (isValid && rules.minLength && field.value.trim()) {
    if (field.value.length < rules.minLength) {
      isValid = false;
      errorMessage = rules.messages.minLength;
    }
  }

  if (isValid && rules.maxLength && field.value.trim()) {
    if (field.value.length > rules.maxLength) {
      isValid = false;
      errorMessage = rules.messages.maxLength;
    }
  }

  // Update UI
  if (!isValid) {
    formGroup.classList.add('error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('show');
  } else {
    formGroup.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }

  return isValid;
}

// Validate entire form
function validateForm() {
  const fields = Object.keys(validationRules);
  let isFormValid = true;

  fields.forEach(fieldName => {
    if (!validateField(fieldName)) {
      isFormValid = false;
    }
  });

  return isFormValid;
}

// Add real-time validation
Object.keys(validationRules).forEach(fieldName => {
  const field = document.getElementById(fieldName);
  if (field) {
    const eventType = field.type === 'checkbox' ? 'change' : 'blur';
    field.addEventListener(eventType, () => validateField(fieldName));
    field.addEventListener('input', () => validateField(fieldName));
  }
});

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    console.log('Form validation failed');
    return;
  }

  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  // Disable submit button
  const submitBtn = contactForm.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending... / Gönderiliyor...';

  try {
    // For now, simulate sending
    // In production, this would send to a backend service
    console.log('Form data to send:', formData);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Show success message
    successMessage.textContent = 'Message sent successfully! We will get back to you soon. / Mesaj başarıyla gönderildi! En kısa sürede size döneceğiz.';
    successMessage.classList.add('show');

    // Reset form
    contactForm.reset();

    // Clear error messages
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
      group.querySelector('.error-message').classList.remove('show');
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.classList.remove('show');
      successMessage.textContent = '';
    }, 5000);

    // Log the data (in production, send to backend)
    console.log('Contact form submitted:', formData);

  } catch (error) {
    console.error('Error submitting form:', error);
    successMessage.textContent = 'Error sending message. Please try again. / Mesaj gönderirken hata. Lütfen tekrar deneyin.';
    successMessage.style.background = '#f8d7da';
    successMessage.style.color = '#721c24';
    successMessage.classList.add('show');

    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Store form data in localStorage for reference
const AUTO_SAVE_KEY = 'contactFormDraft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

function saveFormDraft() {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    savedAt: new Date().toISOString()
  };

  // Only save if there's actual content
  if (formData.name || formData.email || formData.subject || formData.message) {
    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not save form draft:', e);
    }
  }
}

function restoreFormDraft() {
  try {
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (saved) {
      const formData = JSON.parse(saved);
      document.getElementById('name').value = formData.name || '';
      document.getElementById('email').value = formData.email || '';
      document.getElementById('subject').value = formData.subject || '';
      document.getElementById('message').value = formData.message || '';
    }
  } catch (e) {
    console.warn('Could not restore form draft:', e);
  }
}

// Restore draft on page load
window.addEventListener('load', restoreFormDraft);

// Auto-save draft periodically
setInterval(saveFormDraft, AUTO_SAVE_INTERVAL);

// Save draft on input
document.getElementById('name').addEventListener('input', saveFormDraft);
document.getElementById('email').addEventListener('input', saveFormDraft);
document.getElementById('subject').addEventListener('change', saveFormDraft);
document.getElementById('message').addEventListener('input', saveFormDraft);

// Clear saved draft on successful submission
contactForm.addEventListener('submit', () => {
  try {
    localStorage.removeItem(AUTO_SAVE_KEY);
  } catch (e) {
    console.warn('Could not clear form draft:', e);
  }
});

// Analytics - track form interactions
function trackFormEvent(eventName, data = {}) {
  console.log(`Form Event: ${eventName}`, data);
  // In production, send to analytics service
}

// Track form focus
['name', 'email', 'subject', 'message'].forEach(fieldId => {
  document.getElementById(fieldId).addEventListener('focus', () => {
    trackFormEvent('field_focus', { field: fieldId });
  });
});

// Track form abandonment
let formInteracted = false;
contactForm.addEventListener('input', () => {
  if (!formInteracted) {
    formInteracted = true;
    trackFormEvent('form_interaction');
  }
});

window.addEventListener('beforeunload', () => {
  if (formInteracted && document.getElementById('name').value) {
    trackFormEvent('form_abandoned');
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to submit
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const textarea = document.getElementById('message');
    if (document.activeElement === textarea) {
      contactForm.dispatchEvent(new Event('submit'));
    }
  }
});

// Add character counter for message field
const messageField = document.getElementById('message');
const messageGroup = messageField.closest('.form-group');

if (messageField && messageGroup) {
  let counter = messageGroup.querySelector('.char-counter');
  if (!counter) {
    counter = document.createElement('span');
    counter.className = 'char-counter';
    counter.style.cssText = 'display: inline-block; font-size: 12px; color: var(--muted); margin-top: 4px;';
    messageGroup.appendChild(counter);
  }

  const updateCounter = () => {
    const current = messageField.value.length;
    const max = 5000;
    counter.textContent = `${current} / ${max} characters`;

    if (current > max * 0.9) {
      counter.style.color = '#e67e22';
    } else {
      counter.style.color = 'var(--muted)';
    }
  };

  messageField.addEventListener('input', updateCounter);
  updateCounter();
}
