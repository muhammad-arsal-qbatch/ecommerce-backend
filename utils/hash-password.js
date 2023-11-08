import bcrypt from 'bcrypt';

const HashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    console.log('password to hash isss ', password);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export default HashPassword;
