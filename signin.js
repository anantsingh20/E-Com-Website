// Form validation and handling
const signinForm = document.getElementById("signinForm");

// Validation rules
const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 8,
    errorMessage: "Password must be at least 8 characters long",
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

// Add real-time validation
Object.keys(validationRules).forEach((fieldName) => {
  const inputElement = document.getElementById(fieldName);
  if (inputElement) {
    inputElement.addEventListener("blur", () => {
      validateField(fieldName, inputElement.value);
    });

    inputElement.addEventListener("input", () => {
      validateField(fieldName, inputElement.value);
    });
  }
});

// Handle form submission
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // Validate fields
  let isValid = true;

  if (!validateField("email", email)) {
    isValid = false;
  }

  if (!validateField("password", password)) {
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Try to authenticate user
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      showError("email", "Invalid email or password");
      showToast("Invalid email or password", "error");
      return;
    }

    // Store logged-in user data
    const currentUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("rememberedEmail");
    }

    // Show success message
    showToast("Signed in successfully! Redirecting...");

    // Redirect to home page after 1.5 seconds
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    console.error("Error during sign in:", error);
    showToast("An error occurred. Please try again.", "error");
  }
});

// Social sign-in buttons (placeholder functions)
const googleBtn = document.getElementById("googleBtn");
const facebookBtn = document.getElementById("facebookBtn");

if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Google sign-in coming soon!", "info");
  });
}

if (facebookBtn) {
  facebookBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Facebook sign-in coming soon!", "info");
  });
}

// Load remembered email if available
window.addEventListener("DOMContentLoaded", () => {
  const rememberMe = localStorage.getItem("rememberMe");
  const rememberedEmail = localStorage.getItem("rememberedEmail");

  if (rememberMe === "true" && rememberedEmail) {
    document.getElementById("email").value = rememberedEmail;
    document.getElementById("rememberMe").checked = true;
  }

  // Redirect if already logged in
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    showToast("You are already signed in. Redirecting to home...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
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
