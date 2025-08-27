import React, { useState } from 'react';
import { Company } from '@/api/entities';
import { User } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const marshallIslandsOrganizations = [
    "Ministry of Health & Human Services",
    "Ministry of Education",
    "Marshall Islands Marine Resources Authority (MIMRA)",
    "College of the Marshall Islands (CMI)",
    "University of the South Pacific (USP), RMI Campus",
    "Marshall Islands Social Security Administration (MISSA)",
    "National Telecommunications Authority (NTA)",
    "Air Marshall Islands",
    "Tobolar Copra Processing Authority",
    "Majuro Atoll Waste Company (MAWC)",
    "Kwajalein Atoll Joint Utility Resources (KAJUR)",
    "Bank of Marshall Islands",
    "National Training Council",
    "Waan Aelõñ in Majel (WAM)",
    "Marshall Islands Visitors Authority (MIVA)",
    "Custom..."
];

export default function AddCompanyModal({ isOpen, onClose, onSubmit, currentUser }) {
    const [companyName, setCompanyName] = useState('');
    const [customCompanyName, setCustomCompanyName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSelectChange = (value) => {
        if (value === "Custom...") {
            setCompanyName("Custom...");
        } else {
            setCompanyName(value);
            setCustomCompanyName('');
        }
    };

    const finalCompanyName = companyName === 'Custom...' ? customCompanyName : companyName;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!finalCompanyName || !contactEmail) {
            setError('Company name and contact email are required.');
            return;
        }
        setError('');
        setIsSubmitting(true);

        try {
            const newCompany = await Company.create({
                name: finalCompanyName,
                owner_email: currentUser.email,
                contact_email: contactEmail,
                address: address,
                subscription_plan: 'Standard', // Default to a paid plan
                subscription_status: 'trialing',
                trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14-day trial
            });

            // If the admin creating this company doesn't have one, assign them to it.
            if (!currentUser.company_id) {
                await User.updateMyUserData({ company_id: newCompany.id });
            }

            onSubmit(); // This will close modal and refresh data
        } catch (err) {
            console.error("Error creating company:", err);
            setError('Failed to create company. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                    <DialogDescription>
                        Create a new company profile in the HR system.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="company-select">Company Name</Label>
                            <Select onValueChange={handleSelectChange} value={companyName}>
                                <SelectTrigger className="bg-slate-700 border-gray-600">
                                    <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {marshallIslandsOrganizations.map(org => (
                                        <SelectItem key={org} value={org}>{org}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {companyName === 'Custom...' && (
                            <div className="space-y-2">
                                <Label htmlFor="custom-company-name">Custom Company Name</Label>
                                <Input
                                    id="custom-company-name"
                                    value={customCompanyName}
                                    onChange={(e) => setCustomCompanyName(e.target.value)}
                                    className="bg-slate-700 border-gray-600"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="contact-email">Contact Email</Label>
                            <Input
                                id="contact-email"
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="bg-slate-700 border-gray-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="bg-slate-700 border-gray-600"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-orange-600">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Company
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}