export function passwordValidator(password) {
  if (!password) return "Mật khẩu không được để trống."
  if (password.length < 6) return 'Mật khẩu phải dài ít nhất 6 ký tự.'
  return ''
}
