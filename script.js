document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password-input");
  const toggleVisibilityBtn = document.getElementById("toggle-visibility");
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("strength-text");

  const reqLength = document.getElementById("req-length");
  const reqLower = document.getElementById("req-lower");
  const reqUpper = document.getElementById("req-upper");
  const reqNumber = document.getElementById("req-number");
  const reqSpecial = document.getElementById("req-special");

  const generateBtn = document.getElementById("generate-btn");
  const suggestedPasswordInput = document.getElementById("suggested-password");

  // --- 1. Toggle Password Visibility ---
  toggleVisibilityBtn.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    toggleVisibilityBtn.textContent = type === "password" ? "Show" : "Hide";
  });

  // --- 2. Password Strength Evaluation ---
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    let score = 0;

    // Requirement Checks (Regex)
    const hasLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Update Checklist UI
    updateRequirementStatus(reqLength, hasLength);
    updateRequirementStatus(reqLower, hasLower);
    updateRequirementStatus(reqUpper, hasUpper);
    updateRequirementStatus(reqNumber, hasNumber);
    updateRequirementStatus(reqSpecial, hasSpecial);

    // Calculate Score
    if (hasLength) score += 1;
    if (hasLower) score += 1;
    if (hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    // Add bonus for longer passwords
    if (password.length >= 12 && score >= 4) score += 1;

    updateStrengthMeter(score, password.length);
  });

  function updateRequirementStatus(element, isValid) {
    if (isValid) {
      element.classList.remove("invalid");
      element.classList.add("valid");
    } else {
      element.classList.remove("valid");
      element.classList.add("invalid");
    }
  }

  function updateStrengthMeter(score, length) {
    if (length === 0) {
      strengthBar.style.width = "0%";
      strengthBar.style.backgroundColor = "transparent";
      strengthText.textContent = "Awaiting input...";
      strengthText.style.color = "var(--text-muted)";
      return;
    }

    if (score <= 2) {
      strengthBar.style.width = "25%";
      strengthBar.style.backgroundColor = "var(--weak)";
      strengthText.textContent = "Weak";
      strengthText.style.color = "var(--weak)";
    } else if (score === 3 || score === 4) {
      strengthBar.style.width = "50%";
      strengthBar.style.backgroundColor = "var(--fair)";
      strengthText.textContent = "Fair";
      strengthText.style.color = "var(--fair)";
    } else if (score === 5) {
      strengthBar.style.width = "75%";
      strengthBar.style.backgroundColor = "var(--good)";
      strengthText.textContent = "Good";
      strengthText.style.color = "var(--good)";
    } else if (score >= 6) {
      strengthBar.style.width = "100%";
      strengthBar.style.backgroundColor = "var(--strong)";
      strengthText.textContent = "Strong";
      strengthText.style.color = "var(--strong)";
    }
  }

  // --- 3. Secure Password Generator ---
  generateBtn.addEventListener("click", () => {
    const length = 16;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let generatedPassword = "";

    // Ensure at least one of each required type is included
    generatedPassword += "a"; // lower
    generatedPassword += "A"; // upper
    generatedPassword += "1"; // number
    generatedPassword += "!"; // special

    // Fill the rest randomly
    for (let i = generatedPassword.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    // Shuffle the string so the predictable characters aren't always at the start
    generatedPassword = generatedPassword
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    suggestedPasswordInput.value = generatedPassword;

    // Optional: Auto-copy to clipboard
    navigator.clipboard.writeText(generatedPassword);
    generateBtn.textContent = "Copied!";
    setTimeout(() => {
      generateBtn.textContent = "Generate";
    }, 2000);
  });
});
