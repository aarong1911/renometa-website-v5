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

/* ───────────────── props definition ───────────────── */
type AccountSetupFormProps = {
  trialId: string;
  defaultEmail: string;
  onFinish: () => void;
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
  first_name: z.string().min(2, "First name must be at least 2 characters."),
  last_name: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  business_name: z.string().min(2, "Business name must be at least 2 characters."),
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
const AccountSetupForm: React.FC<AccountSetupFormProps> = ({
  trialId,
  defaultEmail,
  onFinish,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [prefill, setPrefill] = useState({
    first_name: "",
    last_name: "",
    email: defaultEmail,
  });

  /* fetch user metadata for defaults */
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

  /* update defaults when profile arrives */
  useEffect(() => {
    reset({
      ...prefill,
      country: "USA",
      website: "http://",
      business_niche: [],
      integrations: [],
    });
  }, [prefill, reset]);

  /* ───────── submit (status line removed) ───────── */
  const submit = async (data: AccountForm) => {
    setSubmitting(true);

    const { error } = await supabase
      .from("trials")
      .update({
        ...data,
        other_apps: data.other_apps || null,
      })
      .eq("id", trialId);

    setSubmitting(false);

    if (error) {
      console.error("trial update failed:", error);
      return;
    }
    onFinish(); // open the modal
  };

  /* ───────── JSX ───────── */
  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(submit)}
      className="bg-white max-w-5xl mx-auto w-full mt-20 px-8 pb-10 pt-12 rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Account Setup</h2>

      {/* personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input {...register("first_name")} />
          {errors.first_name && (
            <p className="text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input {...register("last_name")} />
          {errors.last_name && (
            <p className="text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      {/* email */}
      <div>
        <label className="block text-sm font-semibold mb-1">Email</label>
        <Input value={prefill.email} disabled readOnly />
      </div>

      {/* business name + niche */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Business Name <span className="text-red-500">*</span>
          </label>
          <Input {...register("business_name")} />
          {errors.business_name && (
            <p className="text-sm text-red-600">{errors.business_name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Business Niche <span className="text-red-500">*</span>
          </label>
          <Controller
            name="business_niche"
            control={control}
            render={({ field }) => (
              <>
                <Select
                  value={field.value[0] ?? undefined}
                  onValueChange={(v) => field.onChange([v])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {trades.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.business_niche && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.business_niche.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* phone + address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Business Phone <span className="text-red-500">*</span>
          </label>
          <Input {...register("business_phone")} />
          {errors.business_phone && (
            <p className="text-sm text-red-600">
              {errors.business_phone.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <Input {...register("address")} />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>
      </div>

      {/* city / state / zip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["city", "state", "zip"] as const).map((k) => (
          <div key={k}>
            <label className="block text-sm font-semibold mb-1">
              {k === "zip"
                ? "ZIP"
                : k.charAt(0).toUpperCase() + k.slice(1)}
              <span className="text-red-500">*</span>
            </label>
            <Input {...register(k)} />
            {errors[k] && (
              <p className="text-sm text-red-600">{errors[k]?.message}</p>
            )}
          </div>
        ))}
      </div>

      {/* country + website */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <Input {...register("country")} />
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Website</label>
          <Input {...register("website")} />
          {errors.website && (
            <p className="text-sm text-red-600">{errors.website.message}</p>
          )}
        </div>
      </div>

      {/* time zone */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Time Zone <span className="text-red-500">*</span>
        </label>
        <Controller
          name="time_zone"
          control={control}
          render={({ field }) => (
            <>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((z) => (
                    <SelectItem key={z.value} value={z.value}>
                      {z.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time_zone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.time_zone.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* integrations */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Select integrations you plan to connect{" "}
          <span className="text-red-500">*</span>
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
          <p className="text-sm text-red-600 mt-1">
            {errors.integrations.message}
          </p>
        )}
      </div>

      {/* other apps */}
      <div>
        <label className="block text-sm font-semibold mb-1">Other Apps</label>
        <Input
          {...register("other_apps")}
          placeholder="Any other platform? Tell us here"
        />
      </div>

      {/* submit */}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting…" : "Submit & Continue"}
      </Button>
    </motion.form>
  );
};

export default AccountSetupForm;
