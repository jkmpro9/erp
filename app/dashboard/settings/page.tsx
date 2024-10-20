"use client"

import { useState, useEffect } from 'react';
import { getSetting, setSetting } from '@/utils/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    taxRate: '',
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    currency: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const taxRateValue = await getSetting('taxRate');
    const companyInfo = await getSetting('companyInfo');
    const currencyValue = await getSetting('currency');

    setSettings({
      taxRate: taxRateValue?.toString() || '',
      companyName: companyInfo?.name || '',
      companyAddress: companyInfo?.address || '',
      companyPhone: companyInfo?.phone || '',
      currency: currencyValue?.toString() || '',
    });
  }

  async function handleSave() {
    await setSetting('taxRate', parseFloat(settings.taxRate));
    await setSetting('companyInfo', {
      name: settings.companyName,
      address: settings.companyAddress,
      phone: settings.companyPhone,
    });
    await setSetting('currency', settings.currency);

    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="taxRate" className="text-sm font-medium">Tax Rate (%)</label>
          <Input
            id="taxRate"
            name="taxRate"
            type="number"
            value={settings.taxRate}
            onChange={handleInputChange}
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium">Company Name</label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            value={settings.companyName}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="companyAddress" className="text-sm font-medium">Company Address</label>
          <Input
            id="companyAddress"
            name="companyAddress"
            type="text"
            value={settings.companyAddress}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="companyPhone" className="text-sm font-medium">Company Phone</label>
          <Input
            id="companyPhone"
            name="companyPhone"
            type="tel"
            value={settings.companyPhone}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="currency" className="text-sm font-medium">Currency</label>
          <Input
            id="currency"
            name="currency"
            type="text"
            value={settings.currency}
            onChange={handleInputChange}
          />
        </div>

        <Button onClick={handleSave} className="w-full">Save Settings</Button>
      </CardContent>
    </Card>
  );
}
