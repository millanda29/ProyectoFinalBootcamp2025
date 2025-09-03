import authService from './authService.js';

export const register = async (req, res) => {
  try {
    const { token } = await authService.register(req.body);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token } = await authService.login(req.body.email, req.body.password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
