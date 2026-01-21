// Form validation and handling
const signupForm = document.getElementById("signupForm");

// Validation rules
const validationRules = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]*$/,
    errorMessage: "First name must be at least 2 characters and contain only letters",
  },
  lastName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]*$/,
    errorMessage: "Last name must be at least 2 characters and contain only letters",
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address",
  },
  phone: {
    required: false,
    pattern: /^[0-9\-\+\(\)]*$/,
    minLength: 10,
    errorMessage: "Please enter a valid phone number",
  },
  password: {
    required: true,
    minLength: 8,
    errorMessage: "Password must be at least 8 characters long",
  },
  confirmPassword: {
    required: true,
    errorMessage: "Please confirm your password",
  },
  address: {
    required: false,
    errorMessage: "Please enter a valid address",
  },
  city: {
    required: false,
    errorMessage: "Please enter a valid city",
  },
  agreeTerms: {
    required: true,
    errorMessage: "You must agree to the Terms and Conditions",
  },
};

// Validate individual field
function validateField(fieldName, value) {
  const rules = validationRules[fieldName];
  if (!rules) return true;

  // Check if field is required and empty
  if (rules.required && !value.trim()) {
    showError(fieldName, `${fieldName.replace(/([A-Z])/g, " $1")} is required`);
    return false;
  }

  // Skip validation for empty non-required fields
  if (!rules.required && !value.trim()) {
    clearError(fieldName);
    return true;
  }

  // Check minimum length
  if (rules.minLength && value.length < rules.minLength) {
    showError(fieldName, rules.errorMessage);
    return false;
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    showError(fieldName, rules.errorMessage);
    return false;
  }

  clearError(fieldName);
  return true;
}

// Show error message
function showError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}Error`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  if (inputElement) {
    inputElement.classList.add("form-input-error");
  }
}

// Clear error message
function clearError(fieldName) {
  const errorElement = document.getElementById(`${fieldName}Error`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }

  if (inputElement) {
    inputElement.classList.remove("form-input-error");
  }
}

// Validate checkbox
function validateCheckbox(checkboxName) {
  const checkboxElement = document.getElementById(checkboxName);
  if (!checkboxElement.checked) {
    showError(
      checkboxName,
      `You must agree to the ${checkboxName.replace(/([A-Z])/g, " $1")}`
    );
    return false;
  }
  clearError(checkboxName);
  return true;
}

// Add real-time validation
Object.keys(validationRules).forEach((fieldName) => {
  const inputElement = document.getElementById(fieldName);
  if (inputElement && fieldName !== "agreeTerms") {
    inputElement.addEventListener("blur", () => {
      validateField(fieldName, inputElement.value);
    });

    inputElement.addEventListener("input", () => {
      validateField(fieldName, inputElement.value);
    });
  }
});

// Special validation for confirm password
const confirmPasswordInput = document.getElementById("confirmPassword");
if (confirmPasswordInput) {
  confirmPasswordInput.addEventListener("blur", () => {
    const password = document.getElementById("password").value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      showError("confirmPassword", "Passwords do not match");
    } else {
      clearError("confirmPassword");
    }
  });
}

// Handle form submission
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get all form values
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
    confirmPassword: document.getElementById("confirmPassword").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    agreeTerms: document.getElementById("agreeTerms").checked,
    newsletter: document.getElementById("newsletter").checked,
  };

  // Validate all fields
  let isValid = true;

  // Validate text inputs
  ["firstName", "lastName", "email", "phone", "address", "city", "password", "confirmPassword"].forEach((field) => {
    if (!validateField(field, formData[field])) {
      isValid = false;
    }
  });

  // Validate checkboxes
  if (!validateCheckbox("agreeTerms")) {
    isValid = false;
  }

  // Validate passwords match
  if (
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword
  ) {
    showError("confirmPassword", "Passwords do not match");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // If validation passes, save to localStorage and show success message
  try {
    // Save user data to localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const emailExists = users.some((user) => user.email === formData.email);
    if (emailExists) {
      showError("email", "This email is already registered");
      return;
    }

    // Add new user
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message
    showToast("Account created successfully! Redirecting to sign in page...");

    // Redirect to sign in page after 2 seconds
    setTimeout(() => {
      window.location.href = "signin.html";
    }, 2000);
  } catch (error) {
    console.error("Error saving user data:", error);
    showToast("An error occurred. Please try again.", "error");
  }
});

// Toast notification function
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
