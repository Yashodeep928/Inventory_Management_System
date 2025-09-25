export interface ValidationErrors {
  [key: string]: string;
}

export const validateLoginForm = (form: { username: string; password: string }): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.username.trim()) {
    errors.username = "Username is required";
  } else if (form.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateRegisterForm = (form: { username: string; email?: string; password: string }): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!form.username.trim()) {
    errors.username = "Username is required";
  } else if (form.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(form.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (!hasRequiredPasswordChars(form.password)) {
    errors.password = "Password must contain at least one letter and one number";
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const hasRequiredPasswordChars = (password: string): boolean => {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
};
