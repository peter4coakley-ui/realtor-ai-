# Form Validation Guide - User-Friendly Patterns

## Overview

This guide covers a comprehensive form validation system designed to reduce user frustration, prevent form abandonment, and provide clear, immediate feedback.

---

## Core Principles

### 1. Validate Early, Report Late
- ✅ Validate as the user types (behind the scenes)
- ✅ Show errors only after field blur or form submission
- ✅ Show success immediately when valid

### 2. Progressive Disclosure
- ✅ Show help text when field is empty or focused
- ✅ Show errors after user leaves field
- ✅ Show success when field is valid and complete

### 3. Error Prevention
- ✅ Provide clear constraints upfront (character limits, formats)
- ✅ Use appropriate input types (email, number, tel)
- ✅ Offer suggestions for common mistakes
- ✅ Disable invalid submissions

### 4. Clear Feedback
- ✅ Specific error messages (not "Invalid input")
- ✅ Actionable solutions (tell users what to do)
- ✅ Visual indicators (colors, icons, animations)
- ✅ Success confirmation (positive reinforcement)

### 5. Forgiveness
- ✅ Allow paste in all fields
- ✅ Auto-format where possible
- ✅ Preserve form state on errors
- ✅ Easy form reset option

---

## Components

### 1. FormValidationProvider

Global state management for form validation.

```typescript
import { FormValidationProvider } from '../contexts/FormValidationContext'

<FormValidationProvider initialValues={{ email: '', password: '' }}>
  <YourForm />
</FormValidationProvider>
```

**Features:**
- Centralized form state
- Field-level validation tracking
- Submit count management
- Form reset functionality
- Validator registration

### 2. FormField

Smart form field with built-in validation.

```typescript
import { FormField } from '../components/ui/FormField'
import { required, email, compose } from '../utils/formValidationPatterns'

<FormField
  name="email"
  label="Email Address"
  type="email"
  required
  validate={compose(
    required('Please enter your email'),
    email()
  )}
  validateOnChange={true}
  validateOnBlur={true}
  helpText="We'll never share your email"
  successMessage="Valid email address"
  placeholder="you@example.com"
/>
```

**Props:**
- `name` - Field identifier (required)
- `label` - Field label
- `type` - Input type
- `validate` - Validation function
- `validateOnChange` - Validate while typing (default: true)
- `validateOnBlur` - Validate on blur (default: true)
- `helpText` - Helper text shown when field is pristine
- `successMessage` - Message shown when valid
- `placeholder` - Input placeholder
- `required` - Mark as required
- `disabled` - Disable field

**Visual States:**
- 🔵 Default (gray) - Untouched field
- 🟢 Success (green) - Valid and complete
- 🟡 Warning (yellow) - Valid but with suggestions
- 🔴 Error (red) - Invalid input
- ⚪ Disabled (gray) - Disabled state

### 3. FormErrorSummary

Displays all form errors in one place.

```typescript
import { FormErrorSummary } from '../components/ui/FormErrorSummary'

<FormErrorSummary
  title="Please fix these issues:"
  fieldLabels={{
    email: 'Email Address',
    password: 'Password'
  }}
/>
```

**Features:**
- Lists all errors and warnings
- Click to scroll to field
- Only shows after submit attempt
- Separates errors from warnings
- Auto-focuses first error field

### 4. SuccessConfirmation

Success modal with celebration.

```typescript
import { SuccessConfirmation } from '../components/ui/SuccessConfirmation'

<SuccessConfirmation
  title="Success!"
  message="Your form has been submitted"
  icon="check"
  actions={[
    { label: 'Continue', onClick: handleContinue, variant: 'primary' },
    { label: 'Go Back', onClick: handleBack, variant: 'secondary' }
  ]}
  autoClose={true}
  autoCloseDuration={5000}
/>
```

**Props:**
- `title` - Success title
- `message` - Success message
- `icon` - Icon type (check, rocket, star, gift)
- `actions` - Action buttons
- `autoClose` - Auto-close modal
- `autoCloseDuration` - Close duration (ms)
- `onClose` - Close callback

---

## Validation Rules

### Basic Validators

```typescript
import {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  url,
  number,
  min,
  max,
  between
} from '../utils/formValidationPatterns'

// Required field
required('This field is required')

// Email validation
email('Please enter a valid email')

// Length validation
minLength(8, 'Must be at least 8 characters')
maxLength(100, 'Must be less than 100 characters')

// Pattern matching
pattern(/^[A-Z]/, 'Must start with uppercase letter')

// URL validation
url('Please enter a valid URL')

// Number validation
number('Must be a number')
min(18, 'Must be at least 18')
max(100, 'Must be 100 or less')
between(1, 10, 'Must be between 1 and 10')
```

### Composition

Combine multiple validators:

```typescript
import { compose } from '../utils/formValidationPatterns'

validate={compose(
  required('Email is required'),
  email('Invalid email format'),
  maxLength(100, 'Email is too long')
)}
```

### Conditional Validation

```typescript
import { when } from '../utils/formValidationPatterns'

validate={when(
  (value) => value.length > 0,
  compose(
    minLength(8, 'Password must be 8+ characters'),
    pattern(/[A-Z]/, 'Must contain uppercase letter')
  )
)}
```

### Custom Validators

```typescript
import { custom } from '../utils/formValidationPatterns'

validate={custom(
  (value) => {
    return value.includes('@company.com')
  },
  'Must be a company email address'
)}
```

### Async Validation

```typescript
import { asyncValidation } from '../utils/formValidationPatterns'

validate={asyncValidation(
  async (username) => {
    const response = await fetch(`/api/check-username?username=${username}`)
    const { available } = await response.json()
    return available
  },
  'Username is already taken',
  800 // debounce ms
)}
```

---

## Usage Examples

### Simple Login Form

```typescript
import { FormValidationProvider, useFormValidation } from '../contexts/FormValidationContext'
import { FormField } from '../components/ui/FormField'
import { FormErrorSummary } from '../components/ui/FormErrorSummary'
import { required, email, password } from '../utils/formValidationPatterns'

function LoginForm() {
  const { validateForm, isSubmitting, setIsSubmitting } = useFormValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = await validateForm()
    if (!isValid) return

    setIsSubmitting(true)
    // Submit logic here
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormErrorSummary />

      <FormField
        name="email"
        label="Email"
        type="email"
        validate={compose(required(), email())}
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        validate={compose(required(), password())}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export function Login() {
  return (
    <FormValidationProvider initialValues={{ email: '', password: '' }}>
      <LoginForm />
    </FormValidationProvider>
  )
}
```

### Custom Field with Character Counter

```typescript
<FormField name="bio" label="Bio" required>
  {({ value, onChange, onBlur, onFocus, error, touched }) => (
    <>
      <textarea
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } } as any)}
        onBlur={onBlur}
        onFocus={onFocus}
        maxLength={500}
        className={error && touched ? 'border-red-500' : 'border-gray-600'}
      />
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">
          {value?.length || 0} / 500 characters
        </span>
        {value?.length > 450 && (
          <span className="text-yellow-400">
            {500 - value.length} characters remaining
          </span>
        )}
      </div>
    </>
  )}
</FormField>
```

### Multi-Step Form

```typescript
function MultiStepForm() {
  const [step, setStep] = useState(1)
  const { validateForm, fields } = useFormValidation()

  const handleNext = async () => {
    const isValid = await validateForm()
    if (isValid) {
      setStep(step + 1)
    }
  }

  return (
    <FormValidationProvider initialValues={{}}>
      {step === 1 && <PersonalInfoStep />}
      {step === 2 && <ContactInfoStep />}
      {step === 3 && <ReviewStep />}

      <button onClick={handleNext}>
        {step === 3 ? 'Submit' : 'Next'}
      </button>
    </FormValidationProvider>
  )
}
```

---

## Best Practices

### 1. Error Messages

❌ **Don't:**
- "Invalid input"
- "Error"
- "Wrong format"
- "Field is incorrect"

✅ **Do:**
- "Please enter a valid email address"
- "Password must be at least 8 characters"
- "Username can only contain letters and numbers"
- "This field is required"

### 2. Help Text

❌ **Don't:**
- "Enter email"
- "Your password"
- Leave users guessing

✅ **Do:**
- "We'll never share your email with anyone"
- "Password must be 8+ characters with letters and numbers"
- "Choose a unique username (3-20 characters)"

### 3. Success Messages

❌ **Don't:**
- Skip success feedback
- Use generic "Valid"
- Over-celebrate small wins

✅ **Do:**
- "Great! Valid email address"
- "Strong password!"
- "Username is available"
- Keep it brief and positive

### 4. Validation Timing

❌ **Don't:**
- Show errors while typing
- Wait until submit for all validation
- Block valid submission

✅ **Do:**
- Validate on blur for most fields
- Validate on change for password strength
- Show success immediately
- Show errors after blur or submit

### 5. Form Structure

❌ **Don't:**
- Ask for unnecessary information
- Use long forms without grouping
- Hide required indicators

✅ **Do:**
- Only ask for essential fields
- Group related fields
- Mark required fields clearly
- Use multi-step for long forms

---

## Accessibility

### Keyboard Navigation
```typescript
<FormField
  name="email"
  // Automatically includes:
  // - Tab navigation
  // - Enter to submit
  // - Escape to clear (custom)
/>
```

### Screen Readers
```typescript
// Automatic ARIA attributes:
aria-invalid={hasError ? 'true' : 'false'}
aria-describedby={hasError ? 'field-error' : 'field-help'}
aria-required={required ? 'true' : 'false'}
```

### Visual Indicators
- ✅ Color + icon (not color alone)
- ✅ Clear focus states
- ✅ High contrast text
- ✅ Visible error messages

---

## Performance Optimization

### Debouncing

```typescript
// Built-in debouncing for validation
validateOnChange={true} // Debounced by 300ms
```

### Async Validation

```typescript
// Debounce expensive checks
asyncValidation(
  expensiveCheck,
  'Error message',
  800 // Wait 800ms after typing stops
)
```

### Memoization

```typescript
const validate = useMemo(
  () => compose(required(), email()),
  []
)
```

---

## Common Patterns

### Password with Strength Indicator

Use the existing `PasswordInput` component:

```typescript
import { PasswordInput } from '../components/ui/PasswordInput'

<PasswordInput
  label="Password"
  value={password}
  onChange={setPassword}
  showStrength={true}
  showRequirements={true}
  required
/>
```

### Confirm Password (Not Recommended)

If you must use password confirmation:

```typescript
import { matches } from '../utils/formValidationPatterns'

<FormField
  name="confirmPassword"
  label="Confirm Password"
  type="password"
  validate={matches('password', getFieldValue, 'Passwords must match')}
/>
```

**Better approach:** Use password strength indicator instead!

### Email with Typo Detection

```typescript
// Built into email validator
validate={email()} // Automatically suggests corrections
```

### URL with Auto-formatting

```typescript
import { normalizeUrl } from '../utils/formValidation'

<FormField
  name="website"
  label="Website"
  validate={url()}
  normalize={normalizeUrl} // Adds https:// automatically
/>
```

---

## Testing

### Manual Testing Checklist

- [ ] Enter valid data → Shows success
- [ ] Enter invalid data → Shows error
- [ ] Leave field empty (required) → Shows error
- [ ] Type and delete → Validates correctly
- [ ] Tab through fields → Focus order correct
- [ ] Submit with errors → Shows error summary
- [ ] Submit valid form → Shows success
- [ ] Clear form → Resets all fields
- [ ] Paste data → Works correctly
- [ ] Mobile view → Touch targets adequate

### Automated Testing

```typescript
// Example with React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

test('shows error for invalid email', async () => {
  render(<LoginForm />)

  const emailInput = screen.getByLabelText('Email')
  fireEvent.change(emailInput, { target: { value: 'invalid' } })
  fireEvent.blur(emailInput)

  await waitFor(() => {
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
  })
})
```

---

## Troubleshooting

### Error: "useFormValidation must be used within FormValidationProvider"

**Solution:** Wrap your form in FormValidationProvider:

```typescript
<FormValidationProvider>
  <YourForm />
</FormValidationProvider>
```

### Validation not triggering

**Check:**
- Validator is registered with `validate` prop
- Field name matches in validator
- `validateOnChange` or `validateOnBlur` is true

### Errors showing too early

**Solution:** Errors only show after:
- Field is touched (blur)
- Form submit attempted
- Set `validateOnChange={false}`

### Success not showing

**Check:**
- `successMessage` prop is set
- Field value is not empty
- No errors exist
- Field is touched and dirty

---

## Migration Guide

### From Standard Forms

1. Wrap form in FormValidationProvider
2. Replace `<input>` with `<FormField>`
3. Add validation rules
4. Add FormErrorSummary
5. Add SuccessConfirmation

### From Other Libraries

**From Formik:**
- FormValidationProvider ≈ Formik
- FormField ≈ Field
- useFormValidation ≈ useFormik

**From React Hook Form:**
- FormValidationProvider ≈ FormProvider
- FormField ≈ Controller
- useFormValidation ≈ useForm

---

## Summary

This validation system provides:

✅ **User-Friendly** - Clear feedback, helpful messages
✅ **Error Prevention** - Validate early, guide users
✅ **Performance** - Debounced validation, optimized rendering
✅ **Accessible** - Keyboard navigation, screen reader support
✅ **Flexible** - Custom validators, composable rules
✅ **Complete** - Success confirmation, error summaries
✅ **Modern** - Animations, visual feedback, mobile-optimized

The result: **Lower form abandonment, higher completion rates, happier users.**
