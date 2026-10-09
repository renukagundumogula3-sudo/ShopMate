const hasMailCredentials = () => Boolean(process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD);

const resolveVerificationOutcome = ({ mailConfigured, emailSent }) => {
  if (emailSent) {
    return {
      isVerified: false,
      message: 'User registered successfully. Please check your email to verify your account.',
    };
  }

  if (!mailConfigured) {
    return {
      isVerified: true,
      message: 'User registered successfully. Verification email was not sent automatically, so your account is ready to use.',
    };
  }

  return {
    isVerified: true,
    message: 'User registered successfully. We could not send the verification email automatically, so your account is ready to use.',
  };
};

module.exports = {
  hasMailCredentials,
  resolveVerificationOutcome,
};
