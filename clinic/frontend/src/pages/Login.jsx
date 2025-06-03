import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'; // Đảm bảo đúng đường dẫn

const LoginSignup = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(UserContext); // Lấy hàm login từ context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const url =
      mode === 'login'
        ? 'http://localhost:3000/api/auth/user/login'
        : 'http://localhost:3000/api/auth/user/register';

    const payload =
      mode === 'login' ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Something went wrong!');
        setLoading(false);
        return;
      }

      // Gọi hàm login từ context (KHÔNG dùng localStorage trực tiếp)
      const { token, role, user } = data;
      login(token, role, user);
      setLoading(false);

      // Điều hướng sau login
      if (role === 'admin') navigate('/admin');
      else if (role === 'doctor') navigate('/doctor-dashboard');
      else navigate('/');

    } catch (error) {
      console.error(error);
      setErrorMsg('Cannot connect to server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 w-full max-w-sm border rounded-xl text-zinc-600 text-sm shadow-lg"
      >
        <h2 className="text-2xl font-semibold">
          {mode === 'signup' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-sm text-zinc-500">
          Please {mode === 'signup' ? 'sign up' : 'login'} to book appointment
        </p>

        {mode === 'signup' && (
          <div className="w-full">
            <label>Full Name</label>
            <input
              type="text"
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="w-full">
          <label>Email</label>
          <input
            type="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <label>Password</label>
          <input
            type="password"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white w-full py-2 rounded-md text-base hover:opacity-90"
        >
          {loading
            ? mode === 'signup'
              ? 'Creating Account...'
              : 'Logging in...'
            : mode === 'signup'
            ? 'Create Account'
            : 'Login'}
        </button>

        <p className="text-sm">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="text-primary underline cursor-pointer"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className="text-primary underline cursor-pointer"
              >
                Sign up
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginSignup;
