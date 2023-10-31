export function nameValidator(name, existingUsernames = []) {
  if (!name) return "Tên không thể trống.";
  
  if (existingUsernames.includes(name)) {
    return "Tên người dùng đã tồn tại. Vui lòng chọn tên khác.";
  }
  
  return '';
}
