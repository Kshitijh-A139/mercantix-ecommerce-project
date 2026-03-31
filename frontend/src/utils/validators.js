export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => ({
  valid: password.length >= 8,
  message: 'Password must be at least 8 characters',
});

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email) errors.email = 'Email is required';
  else if (!validateEmail(email)) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Full name is required';
  if (!email) errors.email = 'Email is required';
  else if (!validateEmail(email)) errors.email = 'Enter a valid email';
  const pwCheck = validatePassword(password);
  if (!password) errors.password = 'Password is required';
  else if (!pwCheck.valid) errors.password = pwCheck.message;
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateCheckoutForm = (form) => {
  const errors = {};
  if (!form.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!form.phone?.trim()) errors.phone = 'Phone is required';
  if (!form.address?.trim()) errors.address = 'Address is required';
  if (!form.city?.trim()) errors.city = 'City is required';
  if (!form.pincode?.trim()) errors.pincode = 'Pincode is required';
  return errors;
};
