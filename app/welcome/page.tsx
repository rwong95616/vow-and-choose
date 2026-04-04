import { redirect } from 'next/navigation';

/** Shortcut to reopen the connect onboarding after localStorage marks it complete. */
export default function WelcomeRedirect() {
  redirect('/?onboarding=1');
}
