'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Save, UserCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuthHeaders, getMediaUrl, getMyProfile, setStoredUserData, updateMyProfile, uploadImage } from '@/lib/api';

interface ProfileUser {
  id: string;
  userId: string;
  usn?: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  status?: string;
  grade?: string;
  createdAt?: string;
}

export function ProfileEditor() {
  const { 'x-user-role': userRole } = getAuthHeaders();
  const homeHref = userRole === 'faculty' ? '/faculty' : '/student';

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getMyProfile();
        setProfile(user);
        setName(user.name || '');
        setEmail(user.email || '');
        setGrade(user.grade || '');
        setAvatarPreview(getMediaUrl(user.image));
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let image = profile?.image || '';
      if (avatarFile) {
        image = await uploadImage(avatarFile);
      }

      const updated = await updateMyProfile({
        name,
        email,
        grade,
        image
      });

      setProfile(updated);
      setName(updated.name || '');
      setEmail(updated.email || '');
      setGrade(updated.grade || '');
      setAvatarPreview(getMediaUrl(updated.image));
      setAvatarFile(null);
      setStoredUserData({
        id: updated.id,
        name: updated.name,
        role: updated.role,
        usn: updated.usn,
        image: updated.image,
        grade: updated.grade
      });
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-center rounded-3xl border border-border bg-card p-12 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-white/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-12 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-red-300">{error || 'Profile not found'}</p>
          <Link href={homeHref} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2FA8CC] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href={homeHref} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to portal
        </Link>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card className="border-border bg-card text-foreground shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Profile</CardTitle>
                <span className="rounded-full border border-[#2FA8CC]/30 bg-[#2FA8CC]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2FA8CC]">
                  {profile.role}
                </span>
              </div>
              <CardDescription className="text-white/60">
                Update your personal details and keep your account record in sync with MongoDB.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-4 rounded-3xl border border-border bg-black/20 p-4">
                <Avatar className="h-20 w-20 border border-border bg-[#1F4E79]">
                  <AvatarImage src={avatarPreview || ''} alt={profile.name} />
                  <AvatarFallback className="bg-[#2FA8CC]/20 text-xl text-white">
                    <UserCircle2 className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">{profile.name}</p>
                  <p className="truncate text-sm text-white/60">{profile.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{profile.userId}</p>
                </div>
              </div>

              <div className="grid gap-4 text-sm text-white/75">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">User ID</p>
                  <p className="mt-1 rounded-2xl border border-border bg-card px-4 py-3 font-medium">{profile.userId}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">USN</p>
                  <p className="mt-1 rounded-2xl border border-border bg-card px-4 py-3 font-medium">{profile.usn || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">Status</p>
                  <p className="mt-1 rounded-2xl border border-border bg-card px-4 py-3 font-medium">{profile.status || 'active'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-white text-slate-900 shadow-2xl">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-2xl">Edit details</CardTitle>
              <CardDescription>
                Change the basics shown on your account and portal screens.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-6">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your full name"
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade / Class</Label>
                    <Input
                      id="grade"
                      value={grade}
                      onChange={(event) => setGrade(event.target.value)}
                      placeholder="Class 10, Grade 12, etc."
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Profile photo</Label>
                    <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-slate-600 hover:bg-slate-100">
                      <Camera className="h-4 w-4" />
                      {avatarFile ? avatarFile.name : 'Choose a new photo'}
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-11 rounded-xl bg-[#1F4E79] px-6 font-semibold text-white hover:bg-[#163a5c]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setName(profile.name || '');
                      setEmail(profile.email || '');
                      setGrade(profile.grade || '');
                      setAvatarPreview(getMediaUrl(profile.image))
                      setAvatarFile(null);
                      setError('');
                      setSuccess('');
                    }}
                    className="h-11 rounded-xl border-slate-200 px-6 font-semibold text-slate-700"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
