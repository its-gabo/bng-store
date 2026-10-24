export type AuthEmailPayloads = {
  SEND_WELCOME_VERIFY_EMAIL: {
    email: string;
    name: string;
    verificationUrl: string;
  };
  SEND_RESET_PASSWORD_EMAIL: {
    email: string;
    name: string;
    resetUrl: string;
  };
};
