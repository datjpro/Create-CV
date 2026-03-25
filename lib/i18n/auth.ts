import type { Locale } from "@/lib/types";

export function getAuthCopy(locale: Locale) {
  return locale === "vi"
    ? {
        loginTitle: "Chào mừng quay lại",
        registerTitle: "Tạo workspace của bạn",
        loginDescription: "Đăng nhập để tiếp tục chỉnh sửa và xuất resume.",
        registerDescription: "Tạo tài khoản để lưu resume, đổi template và xuất PDF.",
        google: "Google",
        github: "GitHub",
        emailDivider: "hoặc tiếp tục với email",
        demoMode:
          "Demo mode đang bật vì thiếu biến môi trường Firebase. Email, Google và GitHub vẫn hoạt động cục bộ để test.",
        fullName: "Họ và tên",
        email: "Địa chỉ email",
        password: "Mật khẩu",
        loginPasswordHint: "Dùng bất kỳ mật khẩu demo đã lưu",
        submitWaiting: "Vui lòng chờ...",
        signIn: "Đăng nhập",
        createAccount: "Tạo tài khoản",
        needAccount: "Chưa có tài khoản?",
        alreadyHaveAccount: "Đã có tài khoản?",
        createAccountLink: "Tạo tài khoản",
        signInLink: "Đăng nhập",
        privateLoading: "Đang chuẩn bị workspace của bạn..."
      }
    : {
        loginTitle: "Welcome back",
        registerTitle: "Create your workspace",
        loginDescription: "Sign in to keep editing and exporting your resumes.",
        registerDescription: "Create an account to save resumes, switch templates and export PDF.",
        google: "Google",
        github: "GitHub",
        emailDivider: "or continue with email",
        demoMode:
          "Demo mode is active because Firebase env variables are missing. Email, Google and GitHub flows still work locally for testing.",
        fullName: "Full name",
        email: "Email address",
        password: "Password",
        loginPasswordHint: "Use any saved demo password",
        submitWaiting: "Please wait...",
        signIn: "Sign in",
        createAccount: "Create account",
        needAccount: "Need an account?",
        alreadyHaveAccount: "Already have an account?",
        createAccountLink: "Create account",
        signInLink: "Sign in",
        privateLoading: "Preparing your workspace..."
      };
}
