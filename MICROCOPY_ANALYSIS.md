# Microcopy Analysis & Recommendations

## Executive Summary

Microcopy analysis of PropertyLens AI interface reveals opportunities to improve clarity, reduce user confusion, and increase task completion rates through more user-centered language, clearer calls-to-action, and helpful contextual guidance.

---

## Current State Analysis

### 🔍 Issues Identified

#### 1. Button Labels - Lack of Context

**Current Issues:**
- Generic button labels don't convey outcome
- Loading states lack reassurance
- CTAs don't create urgency or value

**Examples:**
```tsx
// ❌ Current
<Button>Sign in</Button>
<Button>Create Account</Button>
<Button>Subscribe</Button>
<Button loading={true}>Signing in...</Button>
```

**Problems:**
- "Sign in" - What happens next?
- "Create Account" - Why should I?
- "Subscribe" - To what? Why?
- Loading text doesn't reassure user

#### 2. Error Messages - Technical Language

**Current Issues:**
- Technical error messages confuse users
- Don't provide clear next steps
- Generic fallbacks aren't helpful

**Examples:**
```tsx
// ❌ Current
setError('Invalid login credentials')
setError('Failed to load subscription data')
setError('Please check your password')
setError(error.message) // Raw API errors
```

**Problems:**
- "Invalid login credentials" - Which one is wrong?
- "Failed to load" - What should I do?
- "Check your password" - Check what about it?
- Raw errors are developer-facing

#### 3. Form Placeholders - Not Helpful

**Current Issues:**
- Examples don't reduce uncertainty
- Don't guide format expectations
- Generic placeholders waste space

**Examples:**
```tsx
// ❌ Current
placeholder="you@example.com"
placeholder="Enter your password"
placeholder="John Doe"
placeholder="Create a strong password"
```

**Problems:**
- "you@example.com" - Everyone knows email format
- "Enter your password" - Obvious and unhelpful
- "John Doe" - Doesn't show what's acceptable
- "Create a strong password" - Not a placeholder job

#### 4. Helper Text - Missing or Vague

**Current Issues:**
- Important context missing
- Generic reassurances
- Doesn't answer "why"

**Examples:**
```tsx
// ❌ Current
helperText="We'll never share your email with anyone"
// Missing: Why do you need my email?
// Missing: What happens after I sign up?
// Missing: How do I know what's a strong password?
```

#### 5. Success Messages - Bland

**Current Issues:**
- No personality or delight
- Missing next steps
- Don't reinforce value

**Examples:**
```tsx
// ❌ Current
"Account created successfully! You can now sign in."
"Message Sent!"
```

**Problems:**
- Robotic and formal
- Doesn't celebrate user achievement
- Next step is obvious, not helpful

#### 6. Empty States - Unhelpful

**Current Issues:**
- Don't guide users to action
- Missing personality
- Don't explain why empty

**Examples:**
```tsx
// ❌ Current (Assumed)
"No items found"
"No data available"
"Loading..."
```

---

## Microcopy Principles

### 1. Be Human, Not Robotic

❌ **Technical:** "Authentication failed"
✅ **Human:** "Hmm, we don't recognize that email and password combination"

### 2. Show, Don't Just Tell

❌ **Vague:** "Enter a strong password"
✅ **Specific:** "At least 8 characters with a mix of letters and numbers"

### 3. Reduce Anxiety

❌ **Scary:** "Your account will be deleted"
✅ **Reassuring:** "You can reactivate anytime within 30 days"

### 4. Make Actions Clear

❌ **Generic:** "Submit"
✅ **Specific:** "Send Message" or "Create My Account"

### 5. Provide Context

❌ **Missing Why:** "Enter your email"
✅ **With Why:** "Enter your email to receive your property analysis"

### 6. Celebrate Wins

❌ **Boring:** "Done"
✅ **Delightful:** "All set! Your property analysis is ready"

### 7. Guide Next Steps

❌ **Dead End:** "Success!"
✅ **Actionable:** "Success! View your analysis or upload another photo"

### 8. Use Active Voice

❌ **Passive:** "Your account has been created"
✅ **Active:** "We created your account!"

---

## Improved Microcopy Examples

### Button Labels

#### Sign Up Flow
```tsx
// ❌ Before
<Button>Create Account</Button>
<Button loading>Creating...</Button>

// ✅ After
<Button>Get Started Free</Button>
<Button loading>Creating Your Account...</Button>
```

#### Login Flow
```tsx
// ❌ Before
<Button>Sign in</Button>
<Button loading>Signing in...</Button>

// ✅ After
<Button>Sign In to Your Account</Button>
<Button loading>Signing You In...</Button>
```

#### Checkout/Payment
```tsx
// ❌ Before
<Button>Subscribe</Button>
<Button>Buy More Credits</Button>

// ✅ After
<Button>Start 100 Credits Plan → $9.99</Button>
<Button>Add 100 Credits → $9.99</Button>
```

#### Dangerous Actions
```tsx
// ❌ Before
<Button variant="destructive">Delete</Button>

// ✅ After
<Button variant="destructive">Delete Forever</Button>
// With confirmation: "Are you sure? This can't be undone"
```

#### Secondary Actions
```tsx
// ❌ Before
<Button variant="outline">Cancel</Button>
<Button variant="outline">Clear Form</Button>

// ✅ After
<Button variant="outline">Go Back</Button>
<Button variant="outline">Start Over</Button>
```

---

### Error Messages

#### Authentication Errors
```tsx
// ❌ Before
"Invalid login credentials"

// ✅ After
"The email or password you entered isn't right. Please try again."

// Even Better (Specific)
"We don't recognize that email address. Want to sign up instead?"
"That password isn't correct. Forgot your password?"
```

#### Form Validation Errors
```tsx
// ❌ Before
"Invalid email"
"Password too short"
"Required field"

// ✅ After
"Please enter a valid email address (like you@example.com)"
"Password needs at least 8 characters"
"We need your email to send your property analysis"
```

#### Network/Server Errors
```tsx
// ❌ Before
"Failed to load subscription data"
"Error 500: Internal server error"
"Request timeout"

// ✅ After
"We're having trouble loading your subscription. Please refresh the page."
"Something went wrong on our end. We're working on it! Try again in a moment."
"This is taking longer than usual. Check your connection and try again."
```

#### Payment Errors
```tsx
// ❌ Before
"Payment failed"
"Card declined"

// ✅ After
"Your payment didn't go through. Please check your card details."
"Your card was declined. Try a different payment method or contact your bank."
```

---

### Form Labels & Placeholders

#### Email Fields
```tsx
// ❌ Before
label="Email address"
placeholder="you@example.com"

// ✅ After
label="Email Address"
placeholder="your.name@company.com"
helperText="We'll email your property analysis results here"
```

#### Password Fields
```tsx
// ❌ Before (Sign Up)
label="Password"
placeholder="Create a strong password"

// ✅ After
label="Create a Password"
placeholder="Min. 8 characters"
helperText="Use a mix of letters, numbers, and symbols"
successMessage="Strong password! You're all set"
```

```tsx
// ❌ Before (Login)
label="Password"
placeholder="Enter your password"

// ✅ After
label="Password"
placeholder="Your password"
helperText={<Link to="/forgot">Forgot password?</Link>}
```

#### Name Fields
```tsx
// ❌ Before
label="Full Name"
placeholder="John Doe"

// ✅ After
label="Your Name"
placeholder="First and last name"
helperText="How should we address you?"
```

#### Text Areas
```tsx
// ❌ Before
label="Message"
placeholder="Tell us more about your inquiry..."

// ✅ After
label="Your Message"
placeholder="What can we help you with? The more details, the better we can assist you."
helperText="Typical response time: 24 hours"
```

---

### Success Messages

#### Account Creation
```tsx
// ❌ Before
"Account created successfully! You can now sign in."

// ✅ After
"Welcome aboard! 🎉 Let's get you signed in."
// Or with more personality:
"You're in! Time to analyze some properties 🏠"
```

#### Form Submission
```tsx
// ❌ Before
"Message Sent!"

// ✅ After
"Got it! We'll get back to you within 24 hours."
// With next step:
"Message received! Check your email for a confirmation."
```

#### Upload Success
```tsx
// ❌ Before
"File uploaded successfully"

// ✅ After
"Perfect! Your photo is uploaded and ready to analyze."
```

#### Payment Success
```tsx
// ❌ Before
"Payment successful"

// ✅ After
"All set! Your credits are ready to use."
// With value:
"Payment confirmed! You now have 100 credits to enhance your property listings."
```

---

### Loading States

#### General Loading
```tsx
// ❌ Before
"Loading..."

// ✅ After (Context-Specific)
"Loading your dashboard..."
"Analyzing your property photo..."
"Processing payment..."
"Generating your analysis..."
```

#### Long Operations
```tsx
// ❌ Before
<Spinner />

// ✅ After
"This may take a minute... Enhancing your photo with AI"
"Hang tight! We're processing 12 images"
"Almost there... Generating professional descriptions"
```

---

### Empty States

#### No Data Yet
```tsx
// ❌ Before
"No items found"

// ✅ After
"No properties yet — Upload your first property photo to get started!"
// With CTA:
<EmptyState
  title="Ready to enhance your listings?"
  message="Upload a property photo and watch our AI work its magic."
  action={{ label: "Upload Your First Photo", onClick: handleUpload }}
/>
```

#### No Results
```tsx
// ❌ Before
"No results found"

// ✅ After
"We couldn't find any properties matching your search."
// With help:
"Try different keywords or upload a new property photo"
```

#### No Credits
```tsx
// ❌ Before
"Insufficient credits"

// ✅ After
"You're out of credits! Each analysis uses 1 credit."
// With action:
<EmptyState
  title="Time to refill your credits"
  message="You need 1 credit to analyze this property. Plans start at just $9.99 for 100 credits."
  action={{ label: "Buy Credits", onClick: goToCheckout }}
/>
```

---

### Helper Text & Hints

#### Privacy Concerns
```tsx
// ❌ Before
helperText="We'll never share your email with anyone"

// ✅ After
helperText="Your email is private. We only use it to send your analysis results."
```

#### Format Guidance
```tsx
// ❌ Before
helperText="Enter a valid phone number"

// ✅ After
helperText="Format: (555) 123-4567 or 555-123-4567"
```

#### Why We Need This
```tsx
// ❌ Before
label="Company Name"

// ✅ After
label="Company Name (Optional)"
helperText="We'll include this in your property analysis reports"
```

#### Reassurance
```tsx
// ❌ Before
label="Credit Card"

// ✅ After
label="Credit Card"
helperText="Secured by Stripe. We never store your card details."
```

---

### Navigation & Links

#### Breadcrumbs
```tsx
// ❌ Before
"Home > Properties > Edit"

// ✅ After
"Dashboard > My Properties > Edit Listing"
```

#### Link Text
```tsx
// ❌ Before
<Link>Click here</Link>
<Link>Learn more</Link>
<Link>Read more</Link>

// ✅ After
<Link>View example property analysis</Link>
<Link>How our AI enhances listings</Link>
<Link>Read our pricing guide</Link>
```

#### Tabs
```tsx
// ❌ Before
"Tab 1" | "Tab 2" | "Tab 3"

// ✅ After (Context-Specific)
"Original Photo" | "Enhanced Photo" | "Before & After"
"Account Details" | "Billing" | "Usage"
```

---

## Microcopy Patterns by Context

### Onboarding Flow

#### Step 1: Sign Up
- **Heading:** "Get Started in 30 Seconds"
- **Subheading:** "Create your free account to start enhancing property photos"
- **Email Label:** "Email Address"
- **Email Helper:** "We'll send your analysis results here"
- **Password Label:** "Create a Password"
- **Password Helper:** "At least 8 characters with letters and numbers"
- **Button:** "Create My Free Account"
- **Legal:** "By signing up, you agree to our Terms and Privacy Policy"
- **Alt Option:** "Already have an account? Sign in"

#### Step 2: Welcome
- **Heading:** "Welcome to PropertyLens AI! 🎉"
- **Message:** "You're all set up with 5 free credits to try our service."
- **Next Step:** "Upload your first property photo to see the magic"
- **Button:** "Upload a Photo"
- **Skip:** "I'll do this later"

### Error Recovery

#### Network Error
```tsx
<Alert type="error">
  <AlertTitle>Connection Hiccup</AlertTitle>
  <AlertMessage>
    We couldn't connect to our servers. Check your internet connection and try again.
  </AlertMessage>
  <AlertAction>
    <Button>Try Again</Button>
  </AlertAction>
</Alert>
```

#### Auth Error
```tsx
<Alert type="warning">
  <AlertTitle>Session Expired</AlertTitle>
  <AlertMessage>
    For your security, we signed you out after 30 minutes of inactivity. Please sign in again.
  </AlertMessage>
  <AlertAction>
    <Button>Sign In</Button>
  </AlertAction>
</Alert>
```

### Confirmation Dialogs

#### Delete Confirmation
```tsx
<Dialog>
  <DialogTitle>Delete This Property?</DialogTitle>
  <DialogMessage>
    This will permanently delete "123 Main St" and all enhanced photos.
    This action can't be undone.
  </DialogMessage>
  <DialogActions>
    <Button variant="outline">Keep It</Button>
    <Button variant="destructive">Delete Forever</Button>
  </DialogActions>
</Dialog>
```

#### Cancel Subscription
```tsx
<Dialog>
  <DialogTitle>Cancel Your Subscription?</DialogTitle>
  <DialogMessage>
    You'll keep your credits until {endDate}, then your subscription will end.
    You can reactivate anytime.
  </DialogMessage>
  <DialogActions>
    <Button variant="outline">Never Mind</Button>
    <Button variant="destructive">Yes, Cancel</Button>
  </DialogActions>
</Dialog>
```

---

## Tone & Voice Guidelines

### Brand Personality

**PropertyLens AI Voice:**
- **Helpful** not condescending
- **Friendly** not unprofessional
- **Clear** not jargon-filled
- **Confident** not arrogant
- **Encouraging** not pushy

### Do's and Don'ts

#### ✅ Do
- Use contractions (we'll, you're, it's)
- Address user directly (you, your)
- Use active voice
- Be specific about outcomes
- Anticipate questions
- Celebrate user success
- Admit when things go wrong
- Provide clear next steps

#### ❌ Don't
- Use jargon or technical terms
- Blame the user
- Be vague or generic
- Use corporate speak
- Over-apologize
- Use ALL CAPS (except acronyms)
- End with dead ends
- Assume user knowledge

---

## Context-Specific Examples

### Payment/Checkout

#### Pricing Cards
```tsx
<PricingCard>
  <Title>Starter Pack</Title>
  <Price>$9.99</Price>
  <Description>
    Perfect for trying out PropertyLens AI
  </Description>
  <Features>
    • 100 property analyses
    • HD photo enhancement
    • AI-generated descriptions
    • Basic support
  </Features>
  <Button>Get Started → $9.99</Button>
  <Note>One-time purchase • No subscription</Note>
</PricingCard>
```

#### Checkout Success
```tsx
<Success>
  <Title>Payment Confirmed! 🎉</Title>
  <Message>
    Your account has been credited with 100 analyses.
    Time to make those listings shine!
  </Message>
  <Receipt>
    We sent a receipt to {email}
  </Receipt>
  <Actions>
    <Button>Start Analyzing Photos</Button>
    <Link>View Receipt</Link>
  </Actions>
</Success>
```

### Upload Flow

#### Upload Area
```tsx
<UploadArea>
  <Icon>📸</Icon>
  <Title>Drop your property photo here</Title>
  <Subtitle>or click to browse your files</Subtitle>
  <Requirements>
    JPG or PNG • Max 10MB • Best results with good lighting
  </Requirements>
</UploadArea>
```

#### Processing
```tsx
<ProcessingState>
  <Progress value={60} />
  <Status>Analyzing your property photo...</Status>
  <Tip>
    Pro tip: Photos taken during golden hour (sunrise/sunset)
    enhance better!
  </Tip>
</ProcessingState>
```

#### Upload Success
```tsx
<UploadSuccess>
  <Title>Looking good! ✨</Title>
  <Message>
    We enhanced the lighting, removed distractions, and
    generated a professional description.
  </Message>
  <Preview>
    <BeforeAfter before={original} after={enhanced} />
  </Preview>
  <Actions>
    <Button>Download Enhanced Photo</Button>
    <Button variant="outline">Analyze Another</Button>
  </Actions>
  <Credits>
    1 credit used • {remaining} credits remaining
  </Credits>
</UploadSuccess>
```

---

## Testing Recommendations

### A/B Test Ideas

1. **Button CTAs**
   - A: "Sign Up"
   - B: "Get Started Free"
   - Measure: Sign-up conversion

2. **Error Messages**
   - A: "Invalid credentials"
   - B: "We don't recognize that email/password combination"
   - Measure: Recovery rate

3. **Helper Text**
   - A: No helper text
   - B: Context-specific helper text
   - Measure: Form completion rate

4. **Success Messages**
   - A: "Success!"
   - B: Personalized success with next step
   - Measure: Next action completion

### Metrics to Track

- **Task Completion Rate** - Do users finish what they started?
- **Error Recovery Rate** - Do users fix errors and continue?
- **Time to Complete** - Does better copy reduce confusion time?
- **Support Tickets** - Does clarity reduce support needs?
- **User Satisfaction** - Do users report better experience?

---

## Quick Reference

### Common Scenarios

| Scenario | ❌ Avoid | ✅ Use |
|----------|---------|--------|
| Loading | "Loading..." | "Loading your dashboard..." |
| Error | "Error occurred" | "Something went wrong. Please try again." |
| Success | "Done" | "All set! Your analysis is ready." |
| Empty | "No data" | "Upload your first photo to get started!" |
| Delete | "Delete?" | "Delete this property? This can't be undone." |
| Save | "Submit" | "Save My Changes" |
| Required | * | "Required" or "(Required)" |
| Optional | (empty) | "(Optional)" |

### Word Substitutions

| ❌ Avoid | ✅ Use |
|---------|--------|
| Execute | Do, Run, Start |
| Terminate | End, Stop, Close |
| Utilize | Use |
| Authenticate | Sign in, Log in |
| Synchronize | Sync, Update |
| Initiate | Start, Begin |
| Verify | Check, Confirm |
| Invalid | Incorrect, Not quite right |

---

## Summary

Effective microcopy:
1. **Reduces cognitive load** - Users understand instantly
2. **Prevents errors** - Clear guidance reduces mistakes
3. **Builds trust** - Honest, helpful tone creates confidence
4. **Increases completion** - Clear next steps drive action
5. **Delights users** - Personality creates memorable experience

**Golden Rule:** Write for a smart friend, not a robot or a manual.
