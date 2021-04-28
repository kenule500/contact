import * as bcrypt from 'bcrypt';


export  function userValidate(phone, password, email, salt, edit = false) {
  const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  emailformat.test(email);

  const passwordformat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  passwordformat.test(password)

  const phoneformat = /^\d{10,}(?:,\d{10,})*$/;
  phoneformat.test(phone);

  if ((!emailformat.test(email) && (!edit)) || ( (edit) && (!emailformat.test(email)  && (email)))) throw new Error("Invalid Email")
  if ((!passwordformat.test(password) && (!edit)) || ( (edit) && (!passwordformat.test(password)   && (password)))) throw new Error("Password must be at least eight characters, at least one letter and one number")
  if ((!phoneformat.test(phone) && (!edit)) || ( (edit) && (!phoneformat.test(phone)) &&  (phone))) throw new Error("invalid phone number")
  if (password) return  bcrypt.hash(password, salt)
}
