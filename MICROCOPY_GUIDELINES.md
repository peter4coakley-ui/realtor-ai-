# Microcopy Guidelines for PropertyLens AI

## Overview

This document provides guidelines for writing effective microcopy that reduces user confusion, improves task completion rates, and creates a delightful user experience.

---

## Core Principles

### 1. **Be Human, Not a Robot**

Write like you're talking to a friend, not filling out a form.

❌ **Robotic:**
- "Authentication process has been initiated"
- "Your request has been successfully processed"
- "An error has occurred during execution"

✅ **Human:**
- "Signing you in..."
- "All set! Your analysis is ready"
- "Something went wrong. Let's try again"

### 2. **Show Value and Outcomes**

Users don't care about features; they care about what they get.

❌ **Feature-focused:**
- "Upload image"
- "Process data"
- "Subscribe to service"

✅ **Outcome-focused:**
- "Enhance your property photo"
- "Generate professional descriptions"
- "Get 100 credits to transform your listings"

### 3. **Reduce Anxiety**

Remove doubt and build trust at every step.

❌ **Anxiety-inducing:**
- "Warning: This action is irreversible"
- "Error: Invalid input"
- "Your session will expire soon"

✅ **Reassuring:**
- "You can undo this anytime within 30 days"
- "Let's fix that — please enter a valid email address"
- "Still there? We'll keep you signed in"

### 4. **Guide the Next Step**

Never leave users at a dead end.

❌ **Dead end:**
- "Success!"
- "Done"
- "Error"

✅ **Actionable:**
- "All set! View your enhanced photo"
- "Saved! Upload another property"
- "Something went wrong. Try again or contact support"

---

## Voice & Tone

### PropertyLens AI Voice Characteristics

**Helpful** • **Friendly** • **Clear** • **Confident** • **Encouraging**

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| **Onboarding** | Welcoming, Encouraging | "Welcome! Let's get you set up in 30 seconds" |
| **Success** | Celebratory, Proud | "Looking good! ✨ Your photo is enhanced" |
| **Error** | Empathetic, Helpful | "We hit a snag. Check your connection and try again" |
| **Empty State** | Motivating, Guiding | "Ready to see the magic? Upload your first photo" |
| **Payment** | Transparent, Value-focused | "Get 100 credits → $9.99 • No subscription" |
| **Confirmation** | Clear, Non-alarming | "Delete this property? You can't undo this" |

---

## Writing Patterns

### Button Labels

#### Primary Actions
```tsx
// Format: [Action Verb] + [What/Why]

❌ Submit
✅ Create My Account

❌ Upload
✅ Upload Property Photo

❌ Buy
✅ Add 100 Credits → $9.99

❌ Save
✅ Save Changes
```

#### Secondary Actions
```tsx
// Use softer language

❌ Cancel
✅ Go Back, Never Mind, I'll Do This Later

❌ No
✅ Keep It, Not Now, Skip This Step

❌ Close
✅ Close, Done, Got It
```

#### Loading States
```tsx
// Add "..." and make it specific

❌ Loading
✅ Uploading your photo...

❌ Please wait
✅ Analyzing your property...

❌ Processing
✅ Generating professional description...
```

### Error Messages

#### Structure
```
[What happened] + [Why it matters] + [How to fix it]
```

#### Examples
```tsx
// Network Errors
❌ "Connection failed"
✅ "We couldn't connect to our servers. Check your internet and try again."

// Validation Errors
❌ "Invalid email"
✅ "Please enter a valid email address (like you@example.com)"

// Permission Errors
❌ "Access denied"
✅ "You need to be signed in to view this page. Want to sign in?"

// Payment Errors
❌ "Transaction failed"
✅ "Your payment didn't go through. Please check your card details and try again."
```

#### Avoid
- Blame language ("You entered..." → "This email...")
- Technical jargon ("Error 500" → "Something went wrong")
- ALL CAPS (feels like shouting)
- Vague messages ("Error occurred" → Be specific)

### Success Messages

#### Structure
```
[Celebration] + [What we did] + [Next step]
```

#### Examples
```tsx
// Account Created
❌ "Account created successfully"
✅ "Welcome aboard! 🎉 Let's get you started with your first property"

// Upload Complete
❌ "Upload successful"
✅ "Perfect! Your photo is enhanced and ready to download"

// Payment Confirmed
❌ "Payment processed"
✅ "All set! Your account has 100 credits ready to use"

// Form Submitted
❌ "Form submitted"
✅ "Got it! We'll get back to you within 24 hours"
```

### Empty States

#### Structure
```
[Current state] + [Why it's empty] + [How to fill it]
```

#### Examples
```tsx
// No Content Yet
❌ "No data available"
✅ "No properties yet — Upload your first photo to get started!"

// No Search Results
❌ "0 results found"
✅ "No properties match your search. Try different keywords or clear filters"

// No Credits
❌ "Insufficient balance"
✅ "You're out of credits! Each analysis uses 1 credit. Plans start at $9.99 for 100 credits"
```

### Helper Text

#### Purpose
- Explain WHY we need this information
- Show format expectations
- Provide reassurance
- Link to help

#### Examples
```tsx
// Privacy
❌ "Enter email"
✅ "We'll email your analysis results here (never shared)"

// Format
❌ "Phone number"
✅ "Format: (555) 123-4567 or 555-123-4567"

// Reassurance
❌ "Credit card"
✅ "Secured by Stripe • We never store your card details"

// Guidance
❌ "Password"
✅ "At least 8 characters with letters and numbers for security"
```

### Placeholders

#### Good Placeholders
- Show format: `your.name@company.com`
- Give examples: `123 Main Street, Apt 4B`
- Indicate type: `Min. 8 characters`

#### Bad Placeholders
- Repeat label: `Enter your email`
- State obvious: `Type here`
- Use as instructions: `Click to select`

#### Examples
```tsx
// Email
label="Email Address"
placeholder="your.name@company.com"

// Password
label="Create a Password"
placeholder="Min. 8 characters"

// Name
label="Your Name"
placeholder="First and last name"

// Address
label="Property Address"
placeholder="123 Main St, Apt 4B"
```

---

## Context-Specific Guidelines

### Authentication

#### Sign Up
```tsx
// Focus on value and speed
Heading: "Get Started in 30 Seconds"
Subheading: "Create your free account to start enhancing property photos"
Button: "Create My Free Account"
Success: "Welcome! 🎉 You're all set with 5 free credits"
```

#### Login
```tsx
// Make it welcoming
Heading: "Welcome Back"
Subheading: "Sign in to continue enhancing your listings"
Button: "Sign In to Your Account"
Forgot: "Forgot your password?"
```

#### Errors
```tsx
// Be specific and helpful
Wrong Password: "That password isn't quite right. Forgot your password?"
Email Not Found: "We don't have an account with that email. Want to sign up?"
Too Many Attempts: "Too many failed attempts. Please wait a few minutes"
```

### Payment & Checkout

#### Pricing
```tsx
// Emphasize value
Title: "Starter Pack"
Price: "$9.99"
Description: "Perfect for trying out PropertyLens AI"
Features: "• 100 property analyses • HD enhancement • AI descriptions"
Button: "Get Started → $9.99"
Note: "One-time purchase • No subscription"
```

#### Success
```tsx
Title: "Payment Confirmed! 🎉"
Message: "Your account has been credited with 100 analyses. Time to make those listings shine!"
Receipt: "We sent a receipt to your.email@example.com"
Action: "Start Analyzing Photos"
```

#### Errors
```tsx
Card Declined: "Your card was declined. Try a different payment method or contact your bank"
Network Issue: "Payment failed due to connection issue. Your card wasn't charged. Try again"
```

### Upload & Processing

#### Upload Zone
```tsx
Title: "Drop Your Property Photo Here"
Subtitle: "or click to browse your files"
Requirements: "JPG or PNG • Max 10MB • Best results with good lighting"
```

#### Processing
```tsx
Status: "Analyzing your property photo..."
Tip: "Pro tip: Photos taken during golden hour enhance better!"
Progress: "Almost there... Generating description"
```

#### Success
```tsx
Title: "Looking Good! ✨"
Message: "We enhanced the lighting, removed distractions, and generated a professional description"
Actions: "Download Enhanced Photo" | "Analyze Another"
Credits: "1 credit used • 99 credits remaining"
```

### Forms

#### Validation
```tsx
// Real-time
As typing: Show format hints
On blur: Validate and show errors
On submit: Prevent submission, focus first error

// Messages
Required: "We need your email to send the analysis"
Format: "Please enter a valid email (like you@example.com)"
Length: "Password must be at least 8 characters"
```

#### Success
```tsx
// Inline
✓ "Valid email address"
✓ "Strong password! You're all set"
✓ "Great subject line"

// Page-level
"Your changes have been saved!"
"Form submitted! Check your email for confirmation"
```

---

## Length Guidelines

### Buttons
- **Ideal:** 1-3 words ("Sign In", "Get Started", "Buy Credits")
- **Maximum:** 5 words ("Add 100 Credits → $9.99")
- **Avoid:** Sentences or multiple lines

### Titles/Headings
- **Ideal:** 2-6 words ("Welcome Back", "Account Settings")
- **Maximum:** 10 words ("Get Started in 30 Seconds")
- **Avoid:** Full sentences unless compelling

### Descriptions
- **Ideal:** 1 sentence (10-15 words)
- **Maximum:** 2 sentences (25 words)
- **Avoid:** Paragraphs in UI elements

### Error Messages
- **Ideal:** 1-2 sentences with clear action
- **Maximum:** 3 sentences
- **Avoid:** Technical details or stack traces

### Helper Text
- **Ideal:** 5-10 words
- **Maximum:** 15 words
- **Avoid:** Paragraphs (link to help docs instead)

---

## Accessibility Considerations

### Screen Readers

```tsx
// Use aria-label for icon-only buttons
<button aria-label="Close dialog">
  <CloseIcon />
</button>

// Provide context in aria-live regions
<div role="status" aria-live="polite">
  Uploading your photo... 50% complete
</div>

// Describe image buttons
<button aria-label="Upload property photo">
  <UploadIcon />
</button>
```

### Error Announcements

```tsx
// Mark errors with role="alert"
<p role="alert" className="error">
  Please enter a valid email address
</p>

// Associate errors with inputs
<input
  aria-describedby="email-error"
  aria-invalid="true"
/>
<p id="email-error" role="alert">
  Please enter a valid email address
</p>
```

---

## Localization Ready

### Avoid
- Idioms ("hit the ground running")
- Slang ("that's dope")
- Cultural references
- Wordplay that doesn't translate
- Date/time formats in strings

### Use
- Simple, clear language
- Active voice
- Short sentences
- Universal concepts
- Parameterized strings for dates/numbers

### Example
```tsx
// ❌ Not localization-ready
"You'll receive an email on 12/5/2024"

// ✅ Localization-ready
"You'll receive an email on {formatDate(date)}"
// Where formatDate uses user's locale
```

---

## Testing Checklist

### Before Publishing

- [ ] Read aloud — Does it sound natural?
- [ ] Length check — Is it concise?
- [ ] Action clear — Do users know what happens next?
- [ ] Error recovery — Can users fix the problem?
- [ ] Tone appropriate — Does it match the context?
- [ ] No jargon — Would your mom understand it?
- [ ] Accessible — Does it work with screen readers?
- [ ] Localization-ready — Can it be translated?

### A/B Test Candidates

1. Button labels (conversion impact)
2. Error messages (recovery rate)
3. Empty states (engagement rate)
4. Success messages (retention impact)

---

## Quick Reference

### Do's
✅ Use contractions (we'll, you're, it's)
✅ Address user directly (you, your)
✅ Use active voice ("We sent" not "Email was sent")
✅ Be specific about outcomes
✅ Anticipate user questions
✅ Celebrate user success
✅ Admit when things go wrong
✅ Provide clear next steps

### Don'ts
❌ Use jargon or technical terms
❌ Blame the user
❌ Be vague or generic
❌ Use corporate speak
❌ Over-apologize
❌ Use ALL CAPS (except acronyms)
❌ End with dead ends
❌ Assume user knowledge

---

## Resources

### Tools
- **Hemingway Editor** - Check readability
- **Grammarly** - Check grammar and tone
- **axe DevTools** - Test accessibility

### References
- **Voice and Tone** - Mailchimp Style Guide
- **Microcopy** - UX Writing Hub
- **Button Copy** - Nielsen Norman Group

---

## Conclusion

Great microcopy:
1. **Reduces confusion** - Users know what to do
2. **Builds trust** - Honest, helpful communication
3. **Prevents errors** - Clear guidance upfront
4. **Recovers gracefully** - Helpful when things go wrong
5. **Delights users** - Personality creates connection

**Remember:** Every word matters. Make them count.
