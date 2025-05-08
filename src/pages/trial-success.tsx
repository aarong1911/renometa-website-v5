import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'
import AccountSetupForm from '@/components/forms/AccountSetupForm'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

type TrialRow = {
  id: string
  onboarding_status: 'pending' | 'awaiting_ghl' | 'ready'
  ghl_location_id: string | null
}

export default function TrialSuccess() {
  const nav = useNavigate()

  /* ───────── state ───────── */
  const [loading,      setLoading]      = useState(true)
  const [user,         setUser]         = useState<any>(null)
  const [trial,        setTrial]        = useState<TrialRow | null>(null)
  const [trialChecked, setTrialChecked] = useState(false)
  const [showModal,    setShowModal]    = useState(false)
  const [readyForForm, setReadyForForm] = useState(false)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')

  /* ───────── lifecycle ───────── */
  useEffect(() => {
    let authSub: ReturnType<typeof supabase.auth.onAuthStateChange> | undefined

    ;(async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href).catch(console.error)

        const { data: { user: u } } = await supabase.auth.getUser()
        if (u) await handleAuthed(u)

        authSub = supabase.auth.onAuthStateChange(async (evt, sess) => {
          if (evt === 'SIGNED_IN' && sess?.user) await handleAuthed(sess.user)
        })
      } finally {
        setLoading(false)
      }
    })()

    return () => authSub?.data.subscription.unsubscribe()
  }, [])

  /* ───────── helpers ───────── */
  const handleAuthed = async (u: any) => {
    setUser(u)

    const { data: row } = await supabase
      .from('trials')
      .select('*')
      .eq('user_id', u.id)
      .maybeSingle()

    setTrial(row as TrialRow | null)
    setTrialChecked(true)

    if (row?.id) {
      supabase
        .channel('trial-status')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'trials', filter: `id=eq.${row.id}` },
          payload => setTrial(payload.new as TrialRow),
        )
        .subscribe()
    }

    if (row?.onboarding_status === 'pending') {
      setReadyForForm(false)
      setTimeout(() => setReadyForForm(true), 3000)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginErr('Invalid email or password.')
  }

  /* ───────── render ───────── */
  return (
    <MainLayout>
      <section className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-8 max-w-[1024px] w-full text-center mt-20">
          <h1 className="text-3xl font-bold mb-6 text-blue-dark">Free-Trial Status</h1>

          {/* ① loading */}
          {loading && <p>Checking your account…</p>}

          {/* ② login needed */}
          {!loading && !user && (
            <>
              <p className="mb-4">Please log in to complete your free-trial activation.</p>
              <form onSubmit={handleLogin} className="space-y-3 text-left">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <Button className="w-full">Log&nbsp;In</Button>
                {loginErr && <p className="text-sm text-red-600 mt-2">{loginErr}</p>}
              </form>
            </>
          )}

          {/* ③ no trial row */}
          {!loading && trialChecked && user && !trial && (
            <p className="text-red-600">We couldn’t locate your trial record. Please contact support.</p>
          )}

          {/* ④ pending → progress bar */}
          {user && trial?.onboarding_status === 'pending' && !readyForForm && (
            <>
              <p className="text-green-600 mb-4">🎉 Your free trial has been activated!</p>
              <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                <div className="bg-green-500 h-full animate-progress-bar" />
              </div>
              <style>{`
                @keyframes fill { from { width:0% } to { width:100% } }
                .animate-progress-bar { animation: fill 3s ease-in-out forwards }
              `}</style>
            </>
          )}

          {/* ⑤ pending → show form */}
          {user && trial?.onboarding_status === 'pending' && readyForForm && (
            <>
              <p className="mb-4">
                Before we spin up your CRM, we need a few company&nbsp;&amp; integration details.
              </p>
              <AccountSetupForm
                trialId={trial.id}
                defaultEmail={user.email}
                onFinish={() => setShowModal(true)}
              />
            </>
          )}

          {/* ⑥ awaiting-ghl */}
          {user && trial?.onboarding_status === 'awaiting_ghl' && (
            <p>🚀 We’re provisioning your CRM workspace. You’ll get an email within 24&nbsp;h.</p>
          )}

          {/* ⑦ ready */}
          {user && trial?.onboarding_status === 'ready' && trial.ghl_location_id && (
            <>
              <p className="text-green-600 mb-4">🎉 Your RenoMeta CRM is ready!</p>
              <Button asChild className="w-full mb-4">
                <a
                  href={`https://app.renometa.com/?lid=${trial.ghl_location_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Go&nbsp;to&nbsp;CRM
                </a>
              </Button>
              <Button variant="outline" className="w-full" onClick={() => nav('/dashboard')}>
                Open&nbsp;RenoMeta&nbsp;Dashboard
              </Button>
            </>
          )}
        </div>
      </section>

{/* ───────── success modal ───────── */}
{/* TrialSuccess.tsx – only the <Dialog> block needs the tweak */}

<Dialog
  open={showModal}
  onOpenChange={(open) => {
    setShowModal(open)
    if (!open) nav('/')        // close → home
  }}
>
  {/* 👇 add bg-white so the card is visible on top of the dark overlay */}
  <DialogContent className="text-center space-y-4 max-w-md bg-white">
    <DialogClose asChild>
      <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
        <X className="h-4 w-4" />
      </button>
    </DialogClose>

    <h2 className="text-xl font-semibold">Thanks!</h2>
    <p>
      The RenoMeta team is now provisioning your CRM workspace.<br />
      You’ll receive an email within&nbsp;24&nbsp;hours.
    </p>
  </DialogContent>
</Dialog>
    </MainLayout>
  )
}
