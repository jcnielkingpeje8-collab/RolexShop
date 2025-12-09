import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Mail, Phone, Save, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Changed default to false to prevent flicker
  const [session, setSession] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    full_name: '',
    contact_number: '',
    avatar_url: ''
  });

  // New State for Instant Image Preview
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) getProfile(session.user.id);
    });
  }, []);

  const getProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Changed from .single() to .maybeSingle() to prevent 406 errors

      if (error) throw error;
      
      if (data) {
        setFormData({
          full_name: data.full_name || '',
          contact_number: data.contact_number || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.log('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Handle Image Selection & Preview ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create a fake local URL to display the image immediately
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      alert('Error uploading image: ' + error.message);
      return null;
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user } = session;
      let newAvatarUrl = formData.avatar_url;

      // 1. Upload Image if a new one was selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) newAvatarUrl = uploadedUrl;
      }

      // 2. Upsert Profile (Create or Update)
      const updates = {
        id: user.id,
        full_name: formData.full_name,
        contact_number: formData.contact_number,
        avatar_url: newAvatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      
      // Update state to confirm save
      setFormData({ ...formData, avatar_url: newAvatarUrl });
      setAvatarFile(null); // Clear file queue
      alert('Profile updated successfully!');
      
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!session) return <div className="p-10 text-center font-[Poppins] text-[13px]">Loading Profile...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24 font-[Poppins]">
      <h2 className="text-[20px] font-bold mb-8 text-center tracking-wide">My Profile</h2>

      <form onSubmit={updateProfile} className="space-y-6">
        
        {/* Avatar Upload with Instant Preview */}
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 group">
                {/* Logic: Show Preview OR Show Saved URL OR Show Default Icon */}
                {avatarPreview || formData.avatar_url ? (
                    <img 
                      src={avatarPreview || formData.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-md" 
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                        <User size={48} />
                    </div>
                )}

                {/* Camera Overlay */}
                <label className="absolute bottom-0 right-0 bg-black text-white p-2.5 rounded-full cursor-pointer hover:bg-gray-800 transition shadow-lg active:scale-95">
                    <Camera size={18} />
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                    />
                </label>
            </div>
            {/* Removed the "New image selected" text as requested */}
        </div>

        {/* Read Only Email */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center">
            <Mail size={18} className="text-gray-400 mr-3" />
            <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
                <p className="text-[14px] font-medium text-gray-700">{session.user.email}</p>
            </div>
        </div>

        {/* Name Input */}
        <div className="space-y-1">
            <label className="text-[12px] font-bold ml-1 text-gray-600">Full Name</label>
            <div className="flex items-center border border-gray-200 p-3 rounded-xl focus-within:ring-1 ring-black transition bg-white">
                <User size={18} className="text-gray-400 mr-3" />
                <input 
                    type="text" 
                    value={formData.full_name} 
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full outline-none text-[14px]"
                />
            </div>
        </div>

        {/* Contact Input */}
        <div className="space-y-1">
            <label className="text-[12px] font-bold ml-1 text-gray-600">Contact Number</label>
            <div className="flex items-center border border-gray-200 p-3 rounded-xl focus-within:ring-1 ring-black transition bg-white">
                <Phone size={18} className="text-gray-400 mr-3" />
                <input 
                    type="tel" 
                    value={formData.contact_number} 
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    placeholder="+1 234 567 890"
                    className="w-full outline-none text-[14px]"
                />
            </div>
        </div>

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg active:scale-95">
            <Save size={18} />
            {loading ? 'Saving Changes...' : 'Save'}
        </button>

      </form>

      <button onClick={handleLogout} className="mt-6 w-full text-red-500 text-[13px] font-medium py-3 hover:bg-red-50 rounded-xl transition flex items-center justify-center gap-2">
        <LogOut size={16} /> Log Out
      </button>
    </div>
  );
};

export default ProfilePage;