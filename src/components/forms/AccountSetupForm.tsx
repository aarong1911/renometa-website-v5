import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

/* ───────────────── props ───────────────── */
type AccountSetupFormProps = {
  trialId: string;
  defaultEmail: string;
  onFinish?: () => void;
};

/* ───────────────── constants ───────────────── */
const integrations = [
  { id: "google_calendar", label: "Google Calendar" },
  { id: "gmb", label: "Google Business Profile" },
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "quickbooks", label: "QuickBooks" },
  { id: "stripe", label: "Stripe" },
  { id: "slack", label: "Slack" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok" },
  { id: "other", label: "Something else (specify below)" },
] as const;

const trades = [
  "General Contracting",
  "Roofing",
  "Plumbing",
  "HVAC",
  "Electrician",
  "Landscaping",
  "Painting",
  "Carpentry",
  "Masonry",
  "Other",
] as const;

const timeZones = [
  { value: "EST", label: "Eastern (EST)" },
  { value: "CST", label: "Central (CST)" },
  { value: "MST", label: "Mountain (MST)" },
  { value: "PST", label: "Pacific (PST)" },
  { value: "AKST", label: "Alaska (AKST)" },
  { value: "HST", label: "Hawaii-Aleutian (HST)" },
] as const;

/* ───────────────── validation ───────────────── */
const schema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  business_name: z.string().min(2),
  business_niche: z.array(z.string()).min(1).max(2),
  business_phone: z.string().min(6),
  address: z.string().min(4),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(3),
  country: z.string().min(2),
  website: z.string().url().optional(),
  time_zone: z.string().min(2),
  integrations: z.array(z.string()).min(1),
  other_apps: z.string().optional(),
});
type AccountForm = z.infer<typeof schema>;

/* ───────────────── component ───────────────── */
const AccountSetupForm: React.FC<AccountSetupFormProps> = ({ trialId, defaultEmail }) => {
  const [submitting, setSubmitting] = useState(false);
  const [prefill, setPrefill] = useState({ first_name: "", last_name: "", email: defaultEmail });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const meta = user?.user_metadata ?? {};
      setPrefill({
        first_name: meta.first_name ?? "",
        last_name: meta.last_name ?? "",
        email: user?.email ?? defaultEmail,
      });
    };
    fetchProfile();
  }, [defaultEmail]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...prefill,
      country: "USA",
      website: "http://",
      business_niche: [],
      integrations: [],
    },
  });

  useEffect(() => {
    reset({
      ...prefill,
      country: "USA",
      website: "http://",
      business_niche: [],
      integrations: [],
    });
  }, [prefill, reset]);

  const submit = async (data: AccountForm) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("trials")
        .update({
          ...data,
          onboarding_status: "ready",
          other_apps: data.other_apps || null,
        })
        .eq("id", trialId);

      if (error) throw error;

      localStorage.setItem("renometa_user", JSON.stringify({
        email: defaultEmail,
        name: `${data.first_name} ${data.last_name}`,
        company: data.business_name,
      }));

      window.location.href = "https://connect.renometa.com/dashboard";
    } catch (err) {
      console.error("Error saving form to Supabase:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(submit)}
      className="bg-white max-w-5xl mx-auto w-full mt-20 px-8 pb-10 pt-12 rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Account Setup</h2>

      {/* Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="First Name" error={errors.first_name} {...register("first_name")} />
        <InputField label="Last Name" error={errors.last_name} {...register("last_name")} />
      </div>

      <Input value={prefill.email} disabled readOnly />

      {/* Business Name + Niche */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Business Name" error={errors.business_name} {...register("business_name")} />
        <Controller
          name="business_niche"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Business Niche"
              options={trades}
              value={field.value[0] ?? ""}
              onChange={(v) => field.onChange([v])}
              error={errors.business_niche?.message}
            />
          )}
        />
      </div>

      {/* Contact + Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Business Phone" error={errors.business_phone} {...register("business_phone")} />
        <InputField label="Street Address" error={errors.address} {...register("address")} />
      </div>

      {/* City/State/ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField label="City" error={errors.city} {...register("city")} />
        <InputField label="State" error={errors.state} {...register("state")} />
        <InputField label="ZIP" error={errors.zip} {...register("zip")} />
      </div>

      {/* Country + Website */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Country" error={errors.country} {...register("country")} />
        <InputField label="Website" error={errors.website} {...register("website")} />
      </div>

      {/* Time Zone */}
      <Controller
        name="time_zone"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Time Zone"
            options={timeZones.map((z) => ({ value: z.value, label: z.label }))}
            value={field.value}
            onChange={field.onChange}
            error={errors.time_zone?.message}
          />
        )}
      />

      {/* Integrations */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Integrations <span className="text-red-500">*</span>
        </label>
        <Controller
          name="integrations"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {integrations.map((opt) => (
                <label key={opt.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value?.includes(opt.id)}
                    onCheckedChange={(chk) => {
                      const next = chk
                        ? [...field.value, opt.id]
                        : field.value.filter((v) => v !== opt.id);
                      field.onChange(next);
                    }}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.integrations && (
          <p className="text-sm text-red-600 mt-1">{errors.integrations.message}</p>
        )}
      </div>

      {/* Other Apps */}
      <InputField
        label="Other Apps"
        placeholder="Any other platform?"
        error={errors.other_apps}
        {...register("other_apps")}
      />

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Submit & Continue"}
      </Button>
    </motion.form>
  );
};

export default AccountSetupForm;

/* Helper Components */
const InputField = ({ label, error, ...props }: any) => (
  <div>
    <label className="block text-sm font-semibold mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <Input {...props} />
    {error && <p className="text-sm text-red-600">{error.message}</p>}
  </div>
);

const SelectField = ({ label, options, value, onChange, error }: any) => (
  <div>
    <label className="block text-sm font-semibold mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt: any) => (
          <SelectItem key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);
// This component is used to set up the account during the trial onboarding process.
// It collects necessary business and personal information, validates it, and submits it to Supabase.