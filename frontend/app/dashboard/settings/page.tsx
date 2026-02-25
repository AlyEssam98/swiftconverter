"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ProfileData {
    email: string;
    displayName: string;
    credits: number;
}

export default function SettingsPage() {
    const [profile, setProfile] = useState(null as ProfileData | null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/v1/profile');
                setProfile(res.data);
                setName(res.data.displayName || '');
            } catch (err) {
                console.error("Failed to fetch profile", err);
                toast.error("Failed to load profile settings");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put('/api/v1/profile', { displayName: name });
            setProfile(res.data);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your account preferences</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Profile Settings</span>
                    </CardTitle>
                    <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profile?.email || ''} disabled className="bg-gray-50" />
                    </div>
                    <div>
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : "Save Changes"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
