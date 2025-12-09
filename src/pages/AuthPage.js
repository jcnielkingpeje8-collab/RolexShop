import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) alert(error.message);
    else navigate('/home');
  };

  return (
    <div className="p-8 flex flex-col justify-center min-h-screen font-[Poppins]">
      <h2 className="text-[24px] font-medium mb-6">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input 
          className="w-full p-3 border rounded text-[14px] font-[Roboto] bg-gray-50"
          type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required 
        />
        <input 
          className="w-full p-3 border rounded text-[14px] font-[Roboto] bg-gray-50"
          type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required 
        />
        <button className="w-full bg-black text-white py-3 rounded font-medium text-[14px]">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} className="text-center mt-4 text-[11px] text-gray-500 cursor-pointer">
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </p>
    </div>
  );
};

export default AuthPage;