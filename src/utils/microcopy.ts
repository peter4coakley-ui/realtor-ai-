export const microcopy = {
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue enhancing your property listings',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your.name@company.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Your password',
      submitButton: 'Sign In to Your Account',
      submitButtonLoading: 'Signing You In...',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      signUpLink: 'Get started free',
      errors: {
        invalidCredentials: "We don't recognize that email and password combination. Please try again.",
        emailNotFound: "We don't have an account with that email. Want to sign up instead?",
        wrongPassword: "That password isn't quite right. Forgot your password?",
        tooManyAttempts: 'Too many failed attempts. Please wait a few minutes and try again.',
        networkError: "We're having trouble connecting. Check your internet and try again.",
      },
    },
    signup: {
      title: 'Get Started in 30 Seconds',
      subtitle: 'Create your free account to start enhancing property photos',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your.name@company.com',
      emailHelper: "We'll send your property analysis results here",
      passwordLabel: 'Create a Password',
      passwordPlaceholder: 'Min. 8 characters',
      passwordHelper: 'Use a mix of letters, numbers, and symbols for security',
      submitButton: 'Create My Free Account',
      submitButtonLoading: 'Creating Your Account...',
      legal: 'By creating an account, you agree to our Terms of Service and Privacy Policy',
      hasAccount: 'Already have an account?',
      signInLink: 'Sign in',
      success: {
        title: 'Welcome to PropertyLens AI! 🎉',
        message: "You're all set up with 5 free credits to try our service.",
        nextStep: 'Upload your first property photo to see the magic',
        button: 'Get Started',
      },
      errors: {
        emailExists: 'This email is already registered. Want to sign in instead?',
        weakPassword: 'Please choose a stronger password with at least 8 characters, including letters and numbers.',
        invalidEmail: 'Please enter a valid email address (like you@example.com)',
        networkError: 'Something went wrong on our end. Please try again in a moment.',
      },
    },
    logout: {
      confirm: {
        title: 'Sign Out?',
        message: "You'll need to sign in again to access your account.",
        cancel: 'Stay Signed In',
        confirm: 'Sign Out',
      },
      success: 'You've been signed out. See you next time!',
    },
  },

  credits: {
    display: {
      label: 'Credits',
      remaining: (count: number) => `${count} ${count === 1 ? 'credit' : 'credits'} remaining`,
      used: (count: number) => `${count} ${count === 1 ? 'credit' : 'credits'} used`,
      perUse: '1 credit per analysis',
    },
    empty: {
      title: "You're Out of Credits",
      message: 'Each property analysis uses 1 credit. Time to refill!',
      button: 'Buy More Credits',
      pricing: 'Plans start at $9.99 for 100 credits',
    },
    lowBalance: {
      title: 'Running Low on Credits',
      message: (count: number) => `You have ${count} ${count === 1 ? 'credit' : 'credits'} left. Consider adding more to keep analyzing.`,
      button: 'Add More Credits',
      dismiss: "I'm Good for Now",
    },
  },

  payment: {
    checkout: {
      title: 'Choose Your Plan',
      subtitle: 'Select the credit package that works best for you',
      currentPlan: 'Current Plan',
      popular: 'Most Popular',
      bestValue: 'Best Value',
      oneTime: 'One-time purchase',
      perMonth: 'per month',
      button: (price: string) => `Get Started → ${price}`,
      features: {
        analyses: (count: number) => `${count} property ${count === 1 ? 'analysis' : 'analyses'}`,
        hdEnhancement: 'HD photo enhancement',
        aiDescriptions: 'AI-generated descriptions',
        support: 'Priority support',
        unlimitedStorage: 'Unlimited cloud storage',
      },
      secure: 'Secured by Stripe. We never store your card details.',
    },
    success: {
      title: 'Payment Confirmed! 🎉',
      message: (credits: number) => `Your account has been credited with ${credits} analyses. Time to make those listings shine!`,
      receipt: (email: string) => `We sent a receipt to ${email}`,
      button: 'Start Analyzing Photos',
      viewReceipt: 'View Receipt',
    },
    errors: {
      cardDeclined: 'Your card was declined. Try a different payment method or contact your bank.',
      insufficientFunds: 'The payment couldn't be processed. Please check your account balance.',
      invalidCard: 'This card number isn't valid. Please double-check your entry.',
      expiredCard: 'This card has expired. Please use a different payment method.',
      processingError: 'We had trouble processing your payment. Please try again.',
      networkError: 'Connection issue. Please check your internet and try again.',
    },
  },

  upload: {
    dropzone: {
      title: 'Drop Your Property Photo Here',
      subtitle: 'or click to browse your files',
      requirements: 'JPG or PNG • Max 10MB • Best results with good lighting',
      dragActive: 'Drop your photo now...',
    },
    processing: {
      uploading: 'Uploading your photo...',
      analyzing: 'Analyzing your property photo...',
      enhancing: 'Enhancing with AI magic...',
      generating: 'Generating professional description...',
      almostDone: 'Almost there...',
      tip: 'Pro tip: Photos taken during golden hour (sunrise/sunset) enhance better!',
    },
    success: {
      title: 'Looking Good! ✨',
      message: 'We enhanced the lighting, removed distractions, and generated a professional description.',
      download: 'Download Enhanced Photo',
      analyzeAnother: 'Analyze Another',
      creditsUsed: (used: number, remaining: number) =>
        `${used} ${used === 1 ? 'credit' : 'credits'} used • ${remaining} ${remaining === 1 ? 'credit' : 'credits'} remaining`,
    },
    errors: {
      fileTooLarge: 'This file is too large. Please use a photo under 10MB.',
      invalidType: 'Please upload a JPG or PNG image.',
      uploadFailed: 'Upload failed. Please try again.',
      processingFailed: 'We had trouble processing this photo. Try a different image or contact support.',
      networkError: 'Connection issue. Check your internet and try again.',
    },
  },

  forms: {
    validation: {
      required: (fieldName: string) => `${fieldName} is required`,
      email: 'Please enter a valid email address',
      password: {
        tooShort: 'Password must be at least 8 characters',
        tooWeak: 'Please use a mix of letters, numbers, and symbols',
        noMatch: "Passwords don't match",
      },
      general: 'Please check the highlighted fields',
    },
    buttons: {
      save: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...',
      submit: 'Submit',
      submitting: 'Submitting...',
      continue: 'Continue',
      back: 'Go Back',
      startOver: 'Start Over',
      tryAgain: 'Try Again',
    },
    success: {
      saved: 'Your changes have been saved!',
      submitted: 'Form submitted successfully!',
      deleted: 'Deleted successfully',
    },
  },

  empty: {
    noProperties: {
      title: 'No Properties Yet',
      message: 'Upload your first property photo to get started!',
      button: 'Upload a Photo',
    },
    noResults: {
      title: 'No Results Found',
      message: "We couldn't find any properties matching your search.",
      suggestion: 'Try different keywords or upload a new property photo',
      button: 'Clear Search',
    },
    noHistory: {
      title: 'No History Yet',
      message: 'Your analyzed properties will appear here.',
      button: 'Analyze Your First Property',
    },
  },

  loading: {
    default: 'Loading...',
    dashboard: 'Loading your dashboard...',
    properties: 'Loading your properties...',
    analysis: 'Analyzing your property...',
    payment: 'Processing payment...',
    account: 'Loading account details...',
  },

  errors: {
    general: {
      title: 'Something Went Wrong',
      message: "We're not sure what happened, but we're working on it. Please try again.",
      button: 'Try Again',
    },
    network: {
      title: 'Connection Issue',
      message: 'We couldn't connect to our servers. Check your internet connection and try again.',
      button: 'Retry',
    },
    notFound: {
      title: 'Page Not Found',
      message: "We couldn't find what you're looking for.",
      button: 'Go to Dashboard',
    },
    unauthorized: {
      title: 'Access Denied',
      message: 'You need to be signed in to view this page.',
      button: 'Sign In',
    },
    sessionExpired: {
      title: 'Session Expired',
      message: 'For your security, we signed you out after 30 minutes of inactivity. Please sign in again.',
      button: 'Sign In',
    },
  },

  confirmations: {
    deleteProperty: {
      title: 'Delete This Property?',
      message: (name: string) => `This will permanently delete "${name}" and all enhanced photos. This action can't be undone.`,
      cancel: 'Keep It',
      confirm: 'Delete Forever',
    },
    cancelSubscription: {
      title: 'Cancel Your Subscription?',
      message: (endDate: string) => `You'll keep your credits until ${endDate}, then your subscription will end. You can reactivate anytime.`,
      cancel: 'Never Mind',
      confirm: 'Yes, Cancel',
    },
    discardChanges: {
      title: 'Discard Changes?',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      cancel: 'Keep Editing',
      confirm: 'Discard Changes',
    },
  },

  settings: {
    title: 'Account Settings',
    subtitle: (email: string) => `Welcome back, ${email}`,
    sections: {
      account: 'Account Details',
      billing: 'Billing & Subscription',
      usage: 'Usage History',
      preferences: 'Preferences',
    },
    currentPlan: {
      title: 'Current Plan',
      noSubscription: 'No active subscription',
      status: {
        active: 'Active',
        canceled: 'Canceled',
        pastDue: 'Past Due',
        trialing: 'Trial',
      },
      renewsOn: (date: string) => `Renews on ${date}`,
      cancelsOn: (date: string) => `Cancels on ${date}`,
    },
  },

  navigation: {
    dashboard: 'Dashboard',
    properties: 'My Properties',
    settings: 'Settings',
    help: 'Help & Support',
    signOut: 'Sign Out',
  },

  tooltips: {
    credits: 'Each property analysis uses 1 credit',
    enhance: 'Enhance this photo with AI',
    download: 'Download enhanced version',
    delete: 'Delete this property',
    edit: 'Edit property details',
    share: 'Share this property',
  },
}

export type Microcopy = typeof microcopy

export function formatError(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return microcopy.errors.general.message
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100)
}

export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(date)
}
