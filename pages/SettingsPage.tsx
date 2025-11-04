import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Header } from '../components/Header';

interface SettingsPageProps {
  onGoHome: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onGoHome }) => {
  const { profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [companyName, setCompanyName] = useState(profile?.company_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile({
        full_name: fullName || null,
        company_name: companyName || null,
        phone: phone || null,
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = () => {
    alert('Stripe integration: This will open the Stripe Customer Portal where users can manage their subscription, payment methods, and view invoices.');
  };

  const handleUpgrade = () => {
    alert('Stripe integration: This will redirect to Stripe Checkout to upgrade the subscription plan.');
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const trialDaysLeft = profile.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <Header onGoHome={onGoHome} currentView="home" />
      <div className="flex-grow overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your profile and subscription</p>
          </div>

          <Card className="p-6 bg-gradient-to-br from-teal-600 to-cyan-600 border-teal-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)} Plan
                </h3>
                <p className="text-teal-100">
                  {profile.subscription_status === 'trialing' && trialDaysLeft > 0 && (
                    <>{trialDaysLeft} days left in trial</>
                  )}
                  {profile.subscription_status === 'active' && <>Active subscription</>}
                  {profile.subscription_status === 'canceled' && <>Subscription canceled</>}
                </p>
                <p className="text-white font-semibold mt-2">
                  {profile.edits_used_this_month} / {profile.monthly_edit_limit} edits used this month
                </p>
              </div>
              <div className="flex gap-2">
                {profile.subscription_tier === 'free' && (
                  <Button onClick={handleUpgrade} className="bg-white text-teal-600 hover:bg-gray-100">
                    Upgrade Plan
                  </Button>
                )}
                {profile.subscription_tier !== 'free' && (
                  <Button onClick={handleManageBilling} variant="outline" className="border-white text-white hover:bg-white/10">
                    Manage Billing
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-teal-900/50 border border-teal-500 text-teal-200' : 'bg-red-900/50 border border-red-500 text-red-200'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-800 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <Input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ABC Realty"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  disabled={loading}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Usage & Limits</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Monthly Edits</span>
                  <span className="text-white font-medium">
                    {profile.edits_used_this_month} / {profile.monthly_edit_limit}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (profile.edits_used_this_month / profile.monthly_edit_limit) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {profile.subscription_tier === 'free' && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300 mb-3">
                    Running low on edits? Upgrade to Pro for 200 edits per month or Enterprise for unlimited edits.
                  </p>
                  <Button onClick={handleUpgrade} size="sm" className="bg-teal-500 hover:bg-teal-600">
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-red-900/50">
            <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. All your properties, images, and data will be permanently deleted.
            </p>
            <Button
              variant="destructive"
              onClick={() => alert('Account deletion would be implemented with proper confirmation flow')}
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
